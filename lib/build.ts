import 'server-only'
import type { StepView } from '@/components/build/StepList'
import { STRETCH } from '@/content/plan'
import { dayLabel } from '@/lib/dates'
import type { Founder } from '@/lib/data/founders'
import { allReviews, fixStepId, latestBy, type Review } from '@/lib/data/reviews'
import type { Ticks } from '@/lib/data/steps'
import { STOP_NUMBERS, type StopNumber } from '@/lib/plan'
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
export function viewSteps(steps: FounderStep[], ticks: Ticks, today: string): StepView[] {
  return steps.map((step) => ({
    ...step,
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
): { live: string; repo: string; design: string; video: string } {
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
  }
}
