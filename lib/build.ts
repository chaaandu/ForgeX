import 'server-only'
import type { StepView } from '@/components/build/StepList'
import { STRETCH } from '@/content/plan'
import { dayLabel } from '@/lib/dates'
import type { Founder } from '@/lib/data/founders'
import { allReviews, fixStepId, latestBy, type Review } from '@/lib/data/reviews'
import type { Ticks } from '@/lib/data/steps'
import { dayOf, LAUNCH, RESEARCH_DAYS, STOP_NUMBERS, type StopNumber } from '@/lib/plan'
import { stepsFor, type FounderStep } from '@/lib/steps'
import { trackOf } from '@/lib/tracks'

/**
 * Where a founder's build stands: how many steps are due, done and behind,
 * and the fixes the team asked for. Shared by Today, the plan, the profile
 * and the console, so they can never disagree.
 */

export type Progress = { total: number; due: number; done: number; behind: number }

export function progressOf(steps: FounderStep[], ticks: Ticks, today: string): Progress {
  const done = (step: FounderStep) => Boolean(ticks[step.id]?.done)
  const due = steps.filter((step) => step.day <= today)
  return {
    total: steps.length,
    due: due.length,
    done: steps.filter(done).length,
    behind: due.filter((step) => step.day < today && !done(step)).length,
  }
}

export type Fix = { id: string; text: string; stop: StopNumber; done: boolean; recent: boolean }

/**
 * Ticked in the last 12 hours, by the real clock. Today keeps these in view,
 * ticked, so a step doesn't vanish from under a founder's thumb.
 */
const RECENT_MS = 12 * 3600_000
export function recent(at: string | undefined): boolean {
  const time = at ? new Date(at).getTime() : Number.NaN
  return Number.isFinite(time) && Date.now() - time < RECENT_MS
}

/** Each stop's standing review, if any, and its fix list as ticks. */
export function fixesOf(email: string, reviews: Review[], ticks: Ticks): Fix[] {
  return STOP_NUMBERS.flatMap((stop) => {
    const review = latestBy(reviews, String(stop) as '1' | '2' | '3').get(email)
    if (!review) return []
    return review.fixes.map((text, index) => {
      const id = fixStepId(review.id, index)
      return { id, text, stop, done: Boolean(ticks[id]?.done), recent: recent(ticks[id]?.at) }
    })
  })
}

export async function reviewsFor(founder: Founder) {
  const reviews = (await allReviews()).filter(
    (review) => review.email === founder.email && review.stop !== 'checkin',
  )
  return Object.fromEntries(
    STOP_NUMBERS.map((stop) => [
      stop,
      latestBy(reviews, String(stop) as '1').get(founder.email) ?? null,
    ]),
  ) as Record<StopNumber, Review | null>
}

export function stepsOf(founder: Founder): FounderStep[] {
  return stepsFor(trackOf(founder.track))
}

/** Steps with where each one stands today, ready for a founder's browser. */
export function viewSteps(
  steps: FounderStep[],
  ticks: Ticks,
  today: string,
  researchSent = true,
): StepView[] {
  return steps.map((step) => ({
    ...step,
    // The build days wait for the research; the research days never lock.
    locked: !researchSent && step.day > RESEARCH_DAYS[1],
    // Opens by itself when it waits on them: something to add or send that's
    // due, or a card or template to open on its own day.
    needsAction:
      !ticks[step.id]?.done &&
      (researchSent || step.day <= RESEARCH_DAYS[1]) &&
      ((Boolean(step.input) &&
        !(step.input?.kind === 'link' && step.input.optional) &&
        step.day <= today) ||
        (Boolean(step.guide) && step.day === today)),
    ticked: Boolean(ticks[step.id]?.done),
    value: ticks[step.id]?.value ?? '',
    overdue: step.day < today && !ticks[step.id]?.done,
    recent: recent(ticks[step.id]?.at),
    dayLabel: dayLabel(step.day),
  }))
}

/** Stretch options, only for a founder whose plan asks them to choose. */
export function stretchFor(steps: FounderStep[]) {
  return steps.some((step) => step.input?.kind === 'stretch')
    ? STRETCH.map((item) => ({ id: item.id, label: item.label }))
    : []
}

/** The links that make a profile a portfolio: from the newest stop that has them, else from the steps. */
export function workLinks(
  ticks: Ticks,
  submissions: { stop: StopNumber; status: string; fields: Record<string, string> }[],
): { live: string; repo: string; design: string; video: string; producthunt: string } {
  const sent = [...submissions]
    .filter((item) => item.status === 'sent')
    .sort((a, b) => b.stop - a.stop)
  const fromStops = (field: string) =>
    sent.map((item) => item.fields[field] ?? '').find(Boolean) ?? ''
  const fromSteps = (ids: string[]) => ids.map((id) => ticks[id]?.value ?? '').find(Boolean) ?? ''
  return {
    live: fromStops('live') || fromSteps(['g-card-3', 's-live', 'a-live']),
    repo: fromStops('repo') || fromSteps(['g-card-1', 's-repo', 'a-repo']),
    design: fromStops('design') || fromSteps(['sketch']),
    video: fromStops('video') || fromSteps(['g-card-15', 'demo']),
    producthunt: fromStops('producthunt') || fromSteps(['producthunt']),
  }
}

export type DayCell = {
  day: string
  label: string
  inMonth: boolean
  future: boolean
  steps: { title: string; done: boolean }[]
}

/**
 * One month as GitHub draws a year: a column per week, Monday at the top,
 * and each day carrying that day's steps and whether each is done. The two
 * research days carry the research itself.
 */
export function monthGrid(
  steps: FounderStep[],
  ticks: Ticks,
  research: { sent: boolean; title: string },
  today: string,
  month = LAUNCH.slice(0, 7),
): DayCell[][] {
  const first = new Date(`${month}-01T12:00:00+05:30`)
  const start = new Date(first)
  // Back to the Monday on or before the 1st.
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7))
  const weeks: DayCell[][] = []
  const at = new Date(start)
  while (weeks.length === 0 || dayOf(at).slice(0, 7) === month) {
    const week: DayCell[] = []
    for (let index = 0; index < 7; index += 1) {
      const day = dayOf(at)
      const own = steps
        .filter((step) => step.day === day)
        .map((step) => ({ title: step.title, done: Boolean(ticks[step.id]?.done) }))
      week.push({
        day,
        label: dayLabel(day),
        inMonth: day.slice(0, 7) === month,
        future: day > today,
        steps: (RESEARCH_DAYS as readonly string[]).includes(day)
          ? [{ title: research.title, done: research.sent }]
          : own,
      })
      at.setUTCDate(at.getUTCDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}
