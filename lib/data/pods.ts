import 'server-only'
import { appendRows, rows } from '@/lib/store'

/**
 * Pods: the guided founders sit in 5 pods with daily standups, each with one
 * or more peer mentors from the autonomous volunteers. Append-only; the newest
 * row for a person stands, and an empty pod takes them out.
 */
export const POD_COUNT = 5
export type PodRole = 'member' | 'mentor'
export type Seat = { pod: number; role: PodRole }

export async function seats(): Promise<Map<string, Seat>> {
  const now = new Map<string, Seat>()
  for (const { cells } of await rows('pods')) {
    const email = cells.Email.trim().toLowerCase()
    const pod = Number(cells.Pod)
    if (Number.isInteger(pod) && pod >= 1 && pod <= POD_COUNT) {
      now.set(email, { pod, role: cells.Role === 'mentor' ? 'mentor' : 'member' })
    } else now.delete(email)
  }
  return now
}

export async function seat(
  email: string,
  pod: number | null,
  role: PodRole,
  by: string,
): Promise<void> {
  await appendRows('pods', [
    {
      At: new Date().toISOString(),
      Email: email,
      Pod: pod ? String(pod) : '',
      Role: role,
      'Set by': by,
    },
  ])
}
