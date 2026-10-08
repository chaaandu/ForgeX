import { describe, expect, it } from 'vitest'
import { PLAN_STEPS, STRETCH } from '@/content/plan'
import { monthGrid, progressOf } from '@/lib/build'
import type { Submission } from '@/lib/data/submissions'
import { cleanValue, stepComplete, stretchComplete } from '@/lib/inputs'
import { normaliseWorkLink } from '@/lib/links'
import { dayNumber, LAST_DAY, LAUNCH, nextStop, sprintDays, STOPS } from '@/lib/plan'
import { stepsFor, stopFieldsFor } from '@/lib/steps'
import { phaseOpen, stopState } from '@/lib/stops'
import { TRACKS } from '@/lib/tracks'

describe('the calendar', () => {
  it('runs 22 days, launch to the last day', () => {
    const days = sprintDays()
    expect(days[0]).toBe(LAUNCH)
    expect(days.at(-1)).toBe(LAST_DAY)
    expect(days).toHaveLength(22)
    expect(dayNumber('2026-10-08')).toBe(0)
    expect(dayNumber('2026-10-12')).toBe(4)
  })

  it('closes every stop at 6 pm IST on its day', () => {
    for (const stop of Object.values(STOPS)) {
      expect(stop.closes).toBe(`${stop.day}T18:00:00+05:30`)
    }
    expect(nextStop(new Date('2026-10-16T12:29:00Z'))).toBe(1)
    expect(nextStop(new Date('2026-10-16T12:31:00Z'))).toBe(2)
    expect(nextStop(new Date('2026-10-27T00:00:00Z'))).toBeNull()
  })
})

describe('the plan', () => {
  it('gives every step a unique, frozen-looking ID and a day inside the sprint', () => {
    const ids = PLAN_STEPS.map((step) => step.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const step of PLAN_STEPS) {
      expect(step.day >= LAUNCH && step.day <= LAST_DAY, step.id).toBe(true)
      expect(step.tracks.length, step.id).toBeGreaterThan(0)
    }
  })

  it('gives each track all 3 stops, and only its own build cards', () => {
    for (const track of TRACKS) {
      const ids = stepsFor(track).map((step) => step.id)
      expect(ids).toEqual(expect.arrayContaining(['stop-1', 'stop-2', 'stop-3']))
      const cards = stepsFor(track).filter((step) => step.card)
      expect(cards.length, track).toBe(track === 'guided' ? 15 : 0)
    }
  })

  it('numbers the guided cards 1 to 15, in date order', () => {
    const cards = stepsFor('guided')
      .filter((step) => step.card)
      .map((step) => step.card)
    expect(cards).toEqual(Array.from({ length: 15 }, (_, index) => index + 1))
  })

  it('never sends a track name to the browser with a step', () => {
    for (const step of stepsFor('guided')) expect('tracks' in step).toBe(false)
    for (const field of stopFieldsFor('autonomous', 1)) expect('tracks' in field).toBe(false)
  })

  it('fills stop fields only from steps the same track has', () => {
    for (const track of TRACKS) {
      const mine = new Set(stepsFor(track).map((step) => step.id))
      for (const stop of [1, 2, 3] as const) {
        for (const field of stopFieldsFor(track, stop)) {
          const from = field.from ?? []
          if (from.length)
            expect(
              from.some((id) => mine.has(id)),
              `${track} ${field.id}`,
            ).toBe(true)
        }
      }
    }
  })

  it('suggests no solutions: no stretch list, no example answers', () => {
    expect(STRETCH).toHaveLength(0)
    for (const step of PLAN_STEPS) expect(step.example, step.id).toBeUndefined()
    expect(stepsFor('autonomous').some((step) => step.id === 'a-stretch')).toBe(true)
  })

  it('puts the pitch on Sat 17 Oct, for everyone', () => {
    for (const track of TRACKS) {
      expect(stepsFor(track).find((step) => step.id === 'pitch')?.day).toBe('2026-10-17')
    }
  })
})

describe('progress', () => {
  it('counts due, done and behind against today', () => {
    const steps = stepsFor('guided')
    const ticks = { sketch: { done: true, value: '', at: '' } }
    const progress = progressOf(steps, ticks, '2026-10-12')
    expect(progress.done).toBe(1)
    expect(progress.due).toBe(steps.filter((step) => step.day <= '2026-10-12').length)
    // Everything due before today, less the one done.
    expect(progress.behind).toBe(steps.filter((step) => step.day < '2026-10-12').length - 1)
  })
})

const sub = (status: 'draft' | 'sent', savedAt: string): Submission => ({
  id: savedAt,
  email: 'a@forge27.mesaschool.co',
  stop: 1,
  status,
  fields: {},
  savedAt,
  late: false,
})

describe('a stop', () => {
  const closes = STOPS[1].closes
  const before = new Date('2026-10-16T10:00:00+05:30')
  const after = new Date('2026-10-16T19:00:00+05:30')

  it('stays open before 6 pm, sent or not', () => {
    expect(stopState([sub('draft', '2026-10-15T10:00:00Z')], closes, before).locked).toBe(false)
    const sent = stopState([sub('sent', '2026-10-16T04:00:00Z')], closes, before)
    expect(sent.sent && !sent.locked && !sent.late).toBe(true)
  })

  it('locks at 6 pm once sent', () => {
    const state = stopState([sub('sent', '2026-10-16T04:00:00Z')], closes, after)
    expect(state.locked).toBe(true)
    expect(state.late).toBe(false)
  })

  it('takes one late send after 6 pm, flags it, then locks', () => {
    const drafted = stopState([sub('draft', '2026-10-15T10:00:00Z')], closes, after)
    expect(drafted.closed && !drafted.locked).toBe(true)
    const late = stopState(
      [sub('draft', '2026-10-15T10:00:00Z'), sub('sent', '2026-10-16T14:00:00Z')],
      closes,
      after,
    )
    expect(late.late && late.locked).toBe(true)
  })
})

describe('phase order', () => {
  it('opens each phase only after the one before was sent', () => {
    expect(phaseOpen(1, new Set())).toBe(true)
    expect(phaseOpen(2, new Set())).toBe(false)
    expect(phaseOpen(2, new Set([1]))).toBe(true)
    expect(phaseOpen(3, new Set([1]))).toBe(false)
    expect(phaseOpen(3, new Set([1, 2]))).toBe(true)
  })
})

describe('work links', () => {
  it('wants a repo, not a profile, for GitHub', () => {
    expect(normaliseWorkLink('github', 'github.com/meera/cake-orders')).toBe(
      'https://github.com/meera/cake-orders',
    )
    expect(normaliseWorkLink('github', 'https://github.com/meera')).toBeNull()
    expect(normaliseWorkLink('github', 'gitlab.com/meera/cake-orders')).toBeNull()
  })

  it('checks where designs, videos and screenshots live', () => {
    expect(normaliseWorkLink('design', 'https://www.figma.com/design/abc/Orders')).not.toBeNull()
    expect(normaliseWorkLink('video', 'https://www.loom.com/share/abc')).not.toBeNull()
    expect(normaliseWorkLink('video', 'https://youtu.be/abc123')).toBeNull()
    expect(normaliseWorkLink('video', 'https://vimeo.com/123')).toBeNull()
    expect(
      normaliseWorkLink('screenshot', 'https://drive.google.com/file/d/abc/view'),
    ).not.toBeNull()
    expect(normaliseWorkLink('screenshot', 'https://imgur.com/abc')).toBeNull()
  })

  it('takes any real address for a live app, and never a script', () => {
    expect(normaliseWorkLink('live', 'cake-orders.vercel.app')).toBe(
      'https://cake-orders.vercel.app',
    )
    expect(normaliseWorkLink('live', 'meerabakes.in/orders')).toBe('https://meerabakes.in/orders')
    expect(normaliseWorkLink('live', 'javascript:alert(1)')).toBeNull()
    expect(normaliseWorkLink('live', 'localhost:3000')).toBeNull()
  })
})

describe('answers', () => {
  it('checks numbers, ticks and stretch choices', () => {
    expect(cleanValue({ kind: 'number' }, '07')).toBe('7')
    expect(cleanValue({ kind: 'number' }, 'seven')).toBeNull()
    expect(cleanValue({ kind: 'check' }, 'yes')).toBe('yes')
    // No list is offered any more, so any picked ID is refused; their own idea still counts.
    expect(
      cleanValue({ kind: 'stretch' }, JSON.stringify({ picked: ['anything'], own: '' })),
    ).toBeNull()
    expect(stretchComplete({ picked: ['a'], own: 'b' })).toBe(true)
  })

  it('lets an optional link tick empty, and nothing else', () => {
    expect(stepComplete({ kind: 'link', link: 'design', label: '', optional: true }, '')).toBe(true)
    expect(stepComplete({ kind: 'link', link: 'github', label: '' }, '')).toBe(false)
    expect(stepComplete({ kind: 'stop', stop: 1 }, '')).toBe(false)
    expect(stepComplete(undefined, '')).toBe(true)
  })
})

describe('the month grid', () => {
  it('lays October out in Monday-first weeks, with research on its two days', () => {
    const steps = stepsFor('structured')
    const weeks = monthGrid(steps, {}, { sent: true, title: 'Your research' }, '2026-10-14')
    expect(weeks).toHaveLength(5)
    expect(weeks[0]![0]!.day).toBe('2026-09-28')
    const days = weeks.flat()
    expect(days.filter((cell) => cell.inMonth)).toHaveLength(31)
    expect(days.find((cell) => cell.day === '2026-10-09')!.steps).toEqual([
      { title: 'Your research', done: true },
    ])
    expect(days.find((cell) => cell.day === '2026-10-15')!.future).toBe(true)
    expect(days.find((cell) => cell.day === '2026-10-12')!.steps.length).toBeGreaterThan(0)
  })
})
