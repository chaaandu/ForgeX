/**
 * The sprint's calendar, in one place. Every date the portal shows or acts on
 * comes from here, so a moved workshop or a later stop is one edit. Times are
 * IST and written with their offset, so a server in any timezone reads them
 * the same.
 *
 * What happens on each day, per track, is in `content/plan.ts`.
 */
import { isMock } from '@/lib/store/mode'

/** Day 1. The challenge goes live and research starts. */
export const LAUNCH = '2026-10-09'

/** Research runs for these days; building opens once a founder sends theirs. */
export const RESEARCH_DAYS = ['2026-10-09', '2026-10-10'] as const

/** The last day of the sprint. Building carries on after stop 3 until here. */
export const LAST_DAY = '2026-10-30'

export const STOP_NUMBERS = [1, 2, 3] as const
export type StopNumber = (typeof STOP_NUMBERS)[number]

/** Each hard stop closes at 6 pm IST on its day. */
export const STOPS: Record<StopNumber, { day: string; closes: string }> = {
  1: { day: '2026-10-16', closes: '2026-10-16T18:00:00+05:30' },
  2: { day: '2026-10-23', closes: '2026-10-23T18:00:00+05:30' },
  3: { day: '2026-10-26', closes: '2026-10-26T18:00:00+05:30' },
}

export const WORKSHOP_IDS = ['figma', 'cursor', 'cloud', 'vercel'] as const
export type WorkshopId = (typeof WORKSHOP_IDS)[number]

/** Workshops are fixed. The names are in content/copy.ts under `plan.workshops`. */
export const WORKSHOPS: Record<WorkshopId, { day: string }> = {
  figma: { day: '2026-10-10' },
  cursor: { day: '2026-10-13' },
  cloud: { day: '2026-10-21' },
  vercel: { day: '2026-10-23' },
}

/** One-to-one check-ins with the team, after stop 3. */
export const CHECKINS = { from: '2026-10-27', to: '2026-10-30' } as const

/** Founders who committed to tech and AI move into venture building. */
export const VENTURE_BUILDING = '2026-11-02'

const IST = 'Asia/Kolkata'

/**
 * Now, as the plan sees it. Mock mode may pin it with PLAN_NOW, so tests and
 * screenshots can stand on any day of the sprint. Production never can.
 */
export function planNow(): Date {
  const pinned = process.env.PLAN_NOW
  if (pinned && isMock()) {
    const date = new Date(pinned)
    if (!Number.isNaN(date.getTime())) return date
  }
  return new Date()
}

/** The IST calendar day of a moment, as `2026-10-14`. */
export function dayOf(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: IST }).format(date)
}

/** Every day of the sprint, launch to the last day, in order. */
export function sprintDays(): string[] {
  const days: string[] = []
  const at = new Date(`${LAUNCH}T12:00:00+05:30`)
  const end = new Date(`${LAST_DAY}T12:00:00+05:30`)
  while (at <= end) {
    days.push(dayOf(at))
    at.setUTCDate(at.getUTCDate() + 1)
  }
  return days
}

/** Day 1 is launch day. Before launch it is 0; after the last day it stays at the last. */
export function dayNumber(today: string): number {
  const days = sprintDays()
  if (today < days[0]!) return 0
  const index = days.indexOf(today)
  return index < 0 ? days.length : index + 1
}

/** The next stop that hasn't closed, or null once all three have. */
export function nextStop(now: Date): StopNumber | null {
  return STOP_NUMBERS.find((n) => new Date(STOPS[n].closes).getTime() > now.getTime()) ?? null
}

export function stopClosed(n: StopNumber, now: Date): boolean {
  return now.getTime() > new Date(STOPS[n].closes).getTime()
}
