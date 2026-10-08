import type { Submission } from '@/lib/data/submissions'

/**
 * Where a stop stands for one founder. Before 6 pm a stop can be saved and
 * sent as often as they like. After it, a stop that was sent is locked; one
 * that wasn't can still be sent once, and is marked late.
 */
export type StopState = {
  current: Submission | null
  sent: boolean
  late: boolean
  closed: boolean
  locked: boolean
}

export function stopState(history: Submission[], closes: string, now: Date): StopState {
  const deadline = new Date(closes).getTime()
  const current = history.at(-1) ?? null
  const onTime = history.some(
    (item) => item.status === 'sent' && new Date(item.savedAt).getTime() <= deadline,
  )
  const late = !onTime && history.some((item) => item.status === 'sent')
  const closed = now.getTime() > deadline
  return { current, sent: onTime || late, late, closed, locked: closed && (onTime || late) }
}

/**
 * Phases go in order: a phase opens once the one before it has been sent, on
 * time or late. Phase 1 is open from the start.
 */
export function phaseOpen(stop: 1 | 2 | 3, sentStops: ReadonlySet<number>): boolean {
  return stop === 1 || sentStops.has(stop - 1)
}
