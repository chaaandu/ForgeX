import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { HACKATHON, phaseAt, STAGE_IDS, type StageId } from '@/lib/hackathon'
import { currentPath, mayEnter } from '@/lib/journey'
import { normaliseWorkLink } from '@/lib/links'
import { mayBuild, needsNote, ownProblemSchema, wordCount } from '@/lib/own-problem'
import { bullets, problemSchema, scopeFileSchema } from '@/lib/problem'
import { mayAct, mayDecide, pocOf, staffOf } from '@/lib/staff'
import { nextDue, problemWindow, stepsFor, type StepInput } from '@/lib/steps'
import { cleanField, isStageComplete, missingIn, progressOf } from '@/lib/submission'
import { bannedIn, decorativeQuotes } from '@/lib/voice'
import type { World } from '@/lib/world'

const read = (name: string) =>
  JSON.parse(readFileSync(join(process.cwd(), 'data', name), 'utf8')) as unknown[]

const at = (iso: string) => phaseAt(new Date(iso))

describe('the clock', () => {
  it('opens at the announcement, and the problem window shuts on the 20th', () => {
    expect(at('2026-10-14T23:59:00+05:30').open).toBe(false)
    expect(at('2026-10-15T00:00:00+05:30')).toMatchObject({
      open: true,
      problemsOpen: true,
      bankOpen: false,
    })
    expect(at('2026-10-20T23:58:59+05:30').problemsOpen).toBe(true)
    expect(at('2026-10-20T23:59:00+05:30')).toMatchObject({ problemsOpen: false, bankOpen: false })
    // The extra time for new and rejected problems runs to 12:30 pm on the 21st; the bank opens then.
    expect(at('2026-10-21T12:29:59+05:30')).toMatchObject({ extended: true, bankOpen: false })
    expect(at('2026-10-21T12:30:00+05:30')).toMatchObject({ extended: false, bankOpen: true })
  })

  it('shuts each stage at its own hour, and the last one ends it', () => {
    expect(at('2026-10-22T13:59:59+05:30').closed.prototype).toBe(false)
    expect(at('2026-10-22T14:00:00+05:30').closed).toMatchObject({ prototype: true, launch: false })
    expect(at('2026-10-22T19:29:59+05:30').closed.launch).toBe(false)
    expect(at('2026-10-22T19:30:00+05:30').closed).toMatchObject({ launch: true, pitch: false })
    expect(at('2026-10-23T13:00:00+05:30')).toMatchObject({ over: true })
  })

  it('lets every stage pass its date without ever locking', () => {
    expect(at('2026-10-21T23:58:59+05:30').closed.scope).toBe(false)
    const after = at('2026-10-21T23:59:00+05:30')
    expect(after.closed.scope).toBe(true)
    expect(after.locked.scope).toBe(false)
    expect(at('2026-10-24T13:00:00+05:30').locked).toMatchObject({
      scope: false,
      prototype: false,
      launch: false,
      pitch: false,
    })
  })

  it('runs in order', () => {
    const times = [
      HACKATHON.opens,
      HACKATHON.problemsClose,
      HACKATHON.bankOpens,
      ...STAGE_IDS.map((stage) => HACKATHON.stages[stage]),
    ].map(Date.parse)
    expect([...times].sort((a, b) => a - b)).toEqual(times)
  })
})

describe('the 2-day versions', () => {
  const bank = read('problems.json').map((item) => problemSchema.parse(item))
  const scopes = scopeFileSchema.parse(read('problems.scope.json'))

  it('belong to problems in the bank, one each', () => {
    const ids = new Set(bank.map((item) => item.id))
    expect(scopes.filter((item) => !ids.has(item.id))).toEqual([])
    expect(new Set(scopes.map((item) => item.id)).size).toBe(scopes.length)
  })

  it('come in all 3 levels, and cover every industry', () => {
    const byId = new Map(bank.map((item) => [item.id, item]))
    const fit = scopes.filter((item) => item.fit).map((item) => byId.get(item.id)!)
    const perLevel = { easy: 0, medium: 0, hard: 0 }
    const perIndustry = new Map<string, number>()
    for (const item of fit) {
      perLevel[item.difficulty] += 1
      const first = item.industries[0] ?? ''
      perIndustry.set(first, (perIndustry.get(first) ?? 0) + 1)
    }
    // Enough of each level that 117 founders are not all handed the same few.
    for (const [level, count] of Object.entries(perLevel))
      expect(count, level).toBeGreaterThanOrEqual(30)
    // Enough in each industry that a founder who picks only that one still gets 4.
    for (const [industry, count] of perIndustry) expect(count, industry).toBeGreaterThanOrEqual(4)
    expect(perIndustry.size).toBe(12)
  })

  it('are short bullets in the house voice', () => {
    const words = (text: string) => text.trim().split(/\s+/).length
    const flags: string[] = []
    for (const item of scopes) {
      if (!item.fit) continue
      const lines = [item.task, ...item.expect, ...item.further]
      if (words(item.task) > 16) flags.push(`${item.id}: task is long`)
      if (item.expect.length < 4 || item.expect.length > 5) flags.push(`${item.id}: expect count`)
      if (item.further.length !== 2) flags.push(`${item.id}: further count`)
      for (const line of [...item.expect, ...item.further]) {
        if (words(line) > 12) flags.push(`${item.id}: long bullet: ${line}`)
        if (!line.endsWith('.')) flags.push(`${item.id}: no full stop: ${line}`)
      }
      for (const line of lines) {
        if (bannedIn(line).length || decorativeQuotes(line) || /[!—]/.test(line))
          flags.push(`${item.id}: voice: ${line}`)
      }
    }
    expect(flags).toEqual([])
  })

  it('survive a round trip through a Sheet cell', () => {
    const list = ['A customer can book a slot.', 'The AI reminds them.']
    expect(bullets.read(bullets.write(list))).toEqual(list)
    expect(bullets.read('- One thing.\n• Another thing.\n\n')).toEqual([
      'One thing.',
      'Another thing.',
    ])
  })
})

describe('work links', () => {
  it('takes a repo, not a profile', () => {
    expect(normaliseWorkLink('github', 'github.com/ananya/kirana?tab=readme')).toBe(
      'https://github.com/ananya/kirana',
    )
    expect(normaliseWorkLink('github', 'https://github.com/ananya')).toBeNull()
    expect(normaliseWorkLink('github', 'gitlab.com/ananya/kirana')).toBeNull()
  })

  it('takes a live product, not the repo, the deck or the video', () => {
    expect(normaliseWorkLink('live', 'kirana.vercel.app/')).toBe('https://kirana.vercel.app')
    expect(normaliseWorkLink('live', 'https://github.com/ananya/kirana')).toBeNull()
    expect(normaliseWorkLink('live', 'https://docs.google.com/presentation/d/1')).toBeNull()
    expect(normaliseWorkLink('live', 'localhost:3000')).toBeNull()
  })

  it('takes a Google deck, a LinkedIn post and a Loom', () => {
    expect(normaliseWorkLink('deck', 'docs.google.com/presentation/d/1AbC/edit?usp=sharing')).toBe(
      'https://docs.google.com/presentation/d/1AbC/edit?usp=sharing',
    )
    expect(normaliseWorkLink('deck', 'canva.com/design/1')).toBeNull()
    expect(
      normaliseWorkLink('post', 'https://www.linkedin.com/posts/ananya_forgex-activity-1?utm=x'),
    ).toBe('https://www.linkedin.com/posts/ananya_forgex-activity-1')
    expect(normaliseWorkLink('post', 'linkedin.com/in/ananya-rao')).toBeNull()
    expect(normaliseWorkLink('post', 'https://lnkd.in/abc123')).toBe('https://lnkd.in/abc123')
    expect(normaliseWorkLink('video', 'loom.com/share/1a2b')).toBe('https://loom.com/share/1a2b')
    expect(normaliseWorkLink('video', 'youtube.com/watch?v=1')).toBeNull()
  })

  it('never lets a script through', () => {
    expect(normaliseWorkLink('live', 'javascript:alert(1)')).toBeNull()
  })
})

describe('the stages', () => {
  const full = {
    scope: 'https://docs.google.com/document/d/scope',
    github: 'https://github.com/a/b',
    prototype: 'https://b.vercel.app',
    proof: 'https://drive.google.com/drive/folders/proof',
    linkedin: 'https://www.linkedin.com/posts/a_b',
    live: 'https://b.vercel.app',
    deck: 'https://docs.google.com/presentation/d/1',
    video: 'https://www.loom.com/share/1',
  }

  it('each asks for its own links, and more posts are optional', () => {
    for (const stage of STAGE_IDS) expect(isStageComplete(stage, full), stage).toBe(true)
    expect(missingIn('scope', {})).toEqual(['scope'])
    expect(missingIn('prototype', { ...full, prototype: '' })).toEqual(['prototype'])
    expect(missingIn('prototype', { github: full.github })).toEqual(['prototype', 'proof'])
    // The launch is the Vercel link alone; the post and the documentation come with the pitch.
    expect(missingIn('launch', {})).toEqual(['live'])
    expect(missingIn('pitch', { deck: full.deck })).toEqual(['video', 'linkedin'])
  })

  it('cleans each field, and says when it cannot', () => {
    expect(cleanField('github', '')).toBe('')
    expect(cleanField('github', 'not a link')).toBeNull()
    expect(cleanField('scope', 'docs.google.com/document/d/1')).toBe(
      'https://docs.google.com/document/d/1',
    )
    expect(cleanField('linkedinMore', 'linkedin.com/posts/a_1\nlinkedin.com/posts/a_2')).toBe(
      'https://linkedin.com/posts/a_1\nhttps://linkedin.com/posts/a_2',
    )
    expect(cleanField('linkedinMore', 'linkedin.com/posts/a_1 nonsense')).toBeNull()
  })
})

describe('progress', () => {
  const none: Record<StageId, boolean> = {
    scope: false,
    prototype: false,
    launch: false,
    pitch: false,
  }

  it('is 10 when sent, 20 when approved, then 30, 55, 80 and 100', () => {
    expect(progressOf({ sent: false, approved: false, submitted: none })).toBe(0)
    expect(progressOf({ sent: true, approved: false, submitted: none })).toBe(10)
    expect(progressOf({ sent: true, approved: true, submitted: none })).toBe(20)
    const scope = { ...none, scope: true }
    expect(progressOf({ sent: true, approved: true, submitted: scope })).toBe(30)
    const prototype = { ...scope, prototype: true }
    expect(progressOf({ sent: true, approved: true, submitted: prototype })).toBe(55)
    const launch = { ...prototype, launch: true }
    expect(progressOf({ sent: true, approved: true, submitted: launch })).toBe(80)
    expect(progressOf({ sent: true, approved: true, submitted: { ...launch, pitch: true } })).toBe(
      100,
    )
  })
})

describe('an own problem', () => {
  const good = {
    industry: 'retail',
    title: 'Weekend markets lose their regulars',
    person: 'Stall owners at a weekend market.',
    problem: 'Regulars cannot tell where a stall will be next week.',
    promise: 'Their regulars always find them.',
    why: 'My family runs a stall at the weekend market.',
    plan: 'Spoke to 6 stall owners. Next, a page for the next market.',
    primary: 'https://drive.google.com/drive/folders/1',
    secondary: 'https://docs.google.com/document/d/1',
  }

  it('needs the 3Ps, why them, a plan, secondary research and a short name', () => {
    expect(ownProblemSchema.safeParse(good).success).toBe(true)
    expect(ownProblemSchema.safeParse({ ...good, why: '' }).success).toBe(false)
    // Primary research is optional; secondary is not.
    expect(ownProblemSchema.safeParse({ ...good, primary: '' }).success).toBe(true)
    expect(ownProblemSchema.safeParse({ ...good, secondary: '' }).success).toBe(false)
    expect(
      ownProblemSchema.safeParse({
        ...good,
        title: 'one two three four five six seven eight nine ten',
      }).success,
    ).toBe(false)
  })

  it('counts only words, and holds each field to its limit', () => {
    expect(wordCount('  one   two\n\nthree  ')).toBe(3)
    expect(wordCount('')).toBe(0)
    const many = (n: number) => Array.from({ length: n }, () => 'word').join(' ')
    expect(ownProblemSchema.safeParse({ ...good, person: many(40) }).success).toBe(true)
    expect(ownProblemSchema.safeParse({ ...good, person: many(41) }).success).toBe(false)
    expect(ownProblemSchema.safeParse({ ...good, problem: many(80) }).success).toBe(true)
    expect(ownProblemSchema.safeParse({ ...good, problem: many(81) }).success).toBe(false)
    expect(ownProblemSchema.safeParse({ ...good, plan: many(100) }).success).toBe(true)
    expect(ownProblemSchema.safeParse({ ...good, plan: many(101) }).success).toBe(false)
    expect(ownProblemSchema.safeParse({ ...good, why: many(60) }).success).toBe(true)
    expect(ownProblemSchema.safeParse({ ...good, why: many(61) }).success).toBe(false)
    const tooLong = ownProblemSchema.safeParse({ ...good, promise: many(41) })
    expect(tooLong.success ? '' : tooLong.error.issues[0]?.message).toBe('words')
  })

  it('is built only once approved, approved with changes, or picked from the bank', () => {
    expect(['none', 'waiting', 'rejected'].map((state) => mayBuild(state as 'none'))).toEqual([
      false,
      false,
      false,
    ])
    expect(['approved', 'changes', 'bank'].map((state) => mayBuild(state as 'bank'))).toEqual([
      true,
      true,
      true,
    ])
    expect(needsNote('approved')).toBe(false)
    expect(needsNote('changes')).toBe(true)
    expect(needsNote('rejected')).toBe(true)
  })
})

describe("the steps on a founder's home", () => {
  const blank: StepInput = {
    state: 'none',
    sentAt: { scope: '', prototype: '', launch: '', pitch: '' },
    fields: {},
    reopened: [],
    researchDone: false,
    answered: false,
  }
  const during = at('2026-10-17T12:00:00+05:30')
  const afterClose = at('2026-10-21T13:00:00+05:30')
  const extra = at('2026-10-21T10:00:00+05:30')
  const byId = (input: StepInput, phase = during) =>
    Object.fromEntries(stepsFor(input, phase).map((step) => [step.id, step]))

  it('asks for the problem first, and keeps the stages shut until it is approved', () => {
    const steps = byId(blank)
    expect(steps.problem).toMatchObject({ state: 'todo', action: 'write', current: true })
    expect(steps.prototype).toMatchObject({ state: 'locked', href: null })
    expect(byId({ ...blank, state: 'waiting' }).prototype?.state).toBe('locked')
    expect(byId({ ...blank, state: 'rejected' }).problem).toMatchObject({ action: 'fix' })
  })

  it('opens the stages once approved, with or without changes, the MVP scope first', () => {
    for (const state of ['approved', 'changes'] as const) {
      const steps = byId({ ...blank, state })
      expect(steps.scope).toMatchObject({ state: 'todo', action: 'add', current: true })
      expect(steps.prototype).toMatchObject({ state: 'todo', action: 'add', current: false })
    }
  })

  it('keeps taking the MVP scope after its date, so it is never missed', () => {
    const late = at('2026-10-22T10:00:00+05:30')
    expect(byId({ ...blank, state: 'approved' }, late).scope).toMatchObject({
      state: 'todo',
      action: 'add',
    })
  })

  it('sends anyone without an approved problem to the bank once the window shuts', () => {
    expect(byId(blank, afterClose).problem).toMatchObject({
      state: 'missed',
      href: '/world',
      action: 'pick',
    })
    expect(byId({ ...blank, answered: true }, afterClose).problem?.href).toBe('/matches')
    expect(byId({ ...blank, state: 'rejected' }, afterClose).problem).toMatchObject({
      action: 'pick',
    })
  })

  it('gives extra time to anyone with nothing sent or a rejected problem, and no one else', () => {
    expect(byId(blank, extra).problem).toMatchObject({
      action: 'write',
      due: HACKATHON.problemsExtended,
    })
    expect(byId({ ...blank, state: 'rejected' }, extra).problem?.action).toBe('fix')
    // Sent before the window shut: it waits for its response.
    const before = { ...blank, state: 'waiting' as const, latestSent: '2026-10-20T18:00:00+05:30' }
    expect(problemWindow(before, extra).open).toBe(false)
    // Sent in the extra time: it can still be changed until it ends.
    const inExtra = { ...blank, state: 'waiting' as const, latestSent: '2026-10-21T10:00:00+05:30' }
    expect(problemWindow(inExtra, extra)).toEqual({ open: true, due: HACKATHON.problemsExtended })
    expect(problemWindow({ ...blank, state: 'approved' }, extra).open).toBe(false)
    // The countdown runs to the end of the extra time.
    expect(nextDue(stepsFor(blank, extra), extra)).toEqual({
      step: 'problem',
      at: HACKATHON.problemsExtended,
    })
    // Once it ends, nothing to write: the bank.
    expect(byId(blank, afterClose).problem?.action).toBe('pick')
  })

  it('lets a problem be written again after the window only when reopened', () => {
    expect(byId({ ...blank, reopened: ['problem'] }, afterClose).problem?.action).toBe('write')
  })

  it('asks a bank pick for research, and never shuts a stage after its date', () => {
    expect(byId({ ...blank, state: 'bank' }, afterClose).problem).toMatchObject({
      action: 'add',
      current: true,
    })
    const late = at('2026-10-24T14:15:00+05:30')
    const approved = { ...blank, state: 'approved' as const }
    expect(byId(approved, late).prototype).toMatchObject({ state: 'todo', action: 'add' })
    expect(
      byId({ ...approved, sentAt: { ...blank.sentAt, prototype: 'x' } }, late).prototype?.action,
    ).toBe('change')
  })

  it('counts down to the next deadline still open', () => {
    expect(nextDue(stepsFor(blank, during), during)).toEqual({
      step: 'problem',
      at: HACKATHON.problemsClose,
    })
    // Approved, the problem is behind them: the MVP scope is next.
    expect(nextDue(stepsFor({ ...blank, state: 'approved' }, during), during)?.step).toBe('scope')
    // A bank pick still owes its research, but the countdown is to the MVP scope.
    expect(
      nextDue(stepsFor({ ...blank, state: 'bank', researchDone: true }, during), during)?.step,
    ).toBe('scope')
    // Once its date passes, the countdown moves on even if it is not in.
    const after = at('2026-10-22T10:00:00+05:30')
    expect(nextDue(stepsFor({ ...blank, state: 'approved' }, after), after)?.step).toBe('prototype')
    const late = at('2026-10-22T14:15:00+05:30')
    expect(nextDue(stepsFor({ ...blank, state: 'approved' }, late), late)?.step).toBe('launch')
  })
})

describe('the team', () => {
  it('lets the super admin and the reviewers act, and everyone else watch', () => {
    expect(staffOf('chandu@mesaschool.co')).toEqual({ admin: true, reviewer: null })
    expect(staffOf('Saurabh@mesaschool.co')).toEqual({ admin: false, reviewer: 'Saurabh' })
    expect(mayAct(staffOf('team@mesaschool.co'))).toBe(false)
    // Outside mock mode a stand-in email is nobody; Param's own address is Param.
    expect(mayAct(staffOf('param@mesaschool.co'))).toBe(false)
    expect(staffOf('param@joinsquareup.com').reviewer).toBe('Param')
    expect(staffOf('eakbari@mesaschool.co').reviewer).toBe('Ebrahim')
  })

  it('knows a POC by their email or their first name', () => {
    const pocs = ['Akshita', 'Vedansh', 'Chandu']
    expect(pocOf({ email: 'akshita@mesaschool.co', firstName: '' }, pocs)).toBe('Akshita')
    expect(pocOf({ email: 'v.k@mesaschool.co', firstName: 'Vedansh' }, pocs)).toBe('Vedansh')
    expect(pocOf({ email: 'team@mesaschool.co', firstName: 'Team' }, pocs)).toBeNull()
  })

  it('lets a reviewer answer their own group and anyone unassigned', () => {
    const saurabh = staffOf('saurabh@mesaschool.co')
    expect(mayDecide(saurabh, 'Saurabh')).toBe(true)
    expect(mayDecide(saurabh, '')).toBe(true)
    expect(mayDecide(saurabh, 'Param')).toBe(false)
    expect(mayDecide(staffOf('chandu@mesaschool.co'), 'Param')).toBe(true)
  })
})

describe('the journey', () => {
  const world: World = { v: 2, industries: ['retail'], side: 'business', learn: ['web'] }

  it('walks the first three steps in order, then goes home', () => {
    expect(currentPath({ level: 0, world: null })).toBe('/arrive')
    expect(currentPath({ level: 1, world: null })).toBe('/archetype')
    expect(currentPath({ level: 2, world: null })).toBe('/profile')
    expect(currentPath({ level: 3, world: null })).toBe('/build')
  })

  it('opens the bank only to someone who has answered the questions', () => {
    expect(mayEnter({ level: 3, world: null }, 'matches')).toBe(false)
    expect(mayEnter({ level: 3, world }, 'matches')).toBe(true)
    expect(mayEnter({ level: 2, world }, 'world')).toBe(false)
  })
})
