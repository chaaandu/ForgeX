import 'server-only'
import { appendRows, rows } from '@/lib/store'

/** The audit trail: every step a founder takes and every move the team makes. */
export type EventKind =
  | 'arrived'
  | 'level'
  | 'archetype'
  | 'profile'
  | 'research'
  | 'step'
  | 'stop'
  | 'message'
  | 'review'
  | 'checkin'
  | 'pod'
  | 'wall'
  | 'bank'
  | 'export'

export async function logEvent(email: string, kind: EventKind, data: object = {}): Promise<void> {
  await appendRows('events', [
    { At: new Date().toISOString(), Email: email, Kind: kind, Data: JSON.stringify(data) },
  ])
}

/**
 * Arrival order. A founder's number is the rank of their first `arrived` event
 * in the log. Appends are serialised by Google, so two founders arriving in
 * the same second still get distinct numbers, and no lock is needed.
 */
export async function arrivalRank(email: string): Promise<number | null> {
  const seen: string[] = []
  for (const { cells } of await rows('events')) {
    if (cells.Kind !== 'arrived') continue
    const who = cells.Email.trim().toLowerCase()
    if (!seen.includes(who)) seen.push(who)
  }
  const index = seen.indexOf(email.trim().toLowerCase())
  return index < 0 ? null : index + 1
}
