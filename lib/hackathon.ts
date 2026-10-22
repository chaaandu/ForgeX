import { isMock } from '@/lib/store/mode'

/**
 * Every time the hackathon runs on, in one place. Change a time here and the
 * countdowns, the locks, the bank and the console all follow. The dates are
 * the owner's and may move; nothing else in the code names a date.
 */
export const HACKATHON = {
  /** The announcement: the portal opens to founders. Before it they see the day it opens, and nothing else. */
  opens: '2026-10-15T00:00:00+05:30',
  /** The last moment a founder can send their own problem, or send it again. */
  problemsClose: '2026-10-20T23:59:00+05:30',
  /**
   * Extra time, on the owner's call on 21 Oct, for founders who had sent
   * nothing or had their problem rejected when the window shut: they may
   * still send one until this time. A problem sent in this time may be
   * changed until it ends. Everyone else stays as the window left them.
   */
  problemsExtended: '2026-10-21T12:30:00+05:30',
  /** From here a founder with no approved problem picks one from the bank. */
  bankOpens: '2026-10-21T12:30:00+05:30',
  /** Each submission after the problem, and when it is due. Every one locks then, except the MVP scope. */
  stages: {
    scope: '2026-10-21T23:59:00+05:30',
    prototype: '2026-10-22T13:30:00+05:30',
    launch: '2026-10-22T19:30:00+05:30',
    pitch: '2026-10-23T13:00:00+05:30',
  },
} as const

export const STAGE_IDS = ['scope', 'prototype', 'launch', 'pitch'] as const
export type StageId = (typeof STAGE_IDS)[number]

/**
 * Due on a date, but never locked: the MVP scope is required, and one sent
 * late is still taken (and marked late), so nobody needs it reopened.
 */
export const SOFT_STAGES: readonly StageId[] = ['scope']

/** Every step that has a deadline, in order: the problem, then the three submissions. */
export type StepId = 'problem' | StageId

export const dueOf = (step: StepId): string =>
  step === 'problem' ? HACKATHON.problemsClose : HACKATHON.stages[step]

const holder = globalThis as typeof globalThis & { __forgexNow?: string }

/** Mock mode only: moves the clock while the server runs, or puts it back with null. */
export function pinClock(iso: string | null): void {
  if (!isMock()) return
  if (iso && !Number.isNaN(new Date(iso).getTime())) holder.__forgexNow = iso
  else delete holder.__forgexNow
}

/**
 * Now, as the hackathon sees it. Mock mode may pin it, with PLAN_NOW or while
 * running through `pinClock`, so tests and screenshots can stand on any hour
 * of the event. Production never can.
 */
export function clock(): Date {
  const pinned = holder.__forgexNow ?? process.env.PLAN_NOW
  if (pinned && isMock()) {
    const date = new Date(pinned)
    if (!Number.isNaN(date.getTime())) return date
  }
  return new Date()
}

const after = (iso: string, now: Date) => now.getTime() >= new Date(iso).getTime()

export type Phase = {
  /** The portal is open to founders. */
  open: boolean
  /** Founders may still send their own problem. */
  problemsOpen: boolean
  /** The window has shut, but the extra time for new and rejected problems runs. */
  extended: boolean
  /** Founders without an approved problem may pick from the bank. */
  bankOpen: boolean
  /** Which deadlines have passed. */
  closed: Record<StepId, boolean>
  /** Which steps no longer take anything: every passed deadline but a soft one. */
  locked: Record<StepId, boolean>
  /** The last deadline has passed. */
  over: boolean
}

export function phaseAt(now: Date): Phase {
  const closed = {
    problem: after(HACKATHON.problemsClose, now),
    scope: after(HACKATHON.stages.scope, now),
    prototype: after(HACKATHON.stages.prototype, now),
    launch: after(HACKATHON.stages.launch, now),
    pitch: after(HACKATHON.stages.pitch, now),
  }
  const locked = { ...closed }
  for (const stage of SOFT_STAGES) locked[stage] = false
  const open = after(HACKATHON.opens, now)
  return {
    open,
    problemsOpen: open && !closed.problem,
    extended: open && closed.problem && !after(HACKATHON.problemsExtended, now),
    bankOpen: after(HACKATHON.bankOpens, now),
    closed,
    locked,
    over: closed.pitch,
  }
}
