import type { Role } from './types'

export const STUDENT_DOMAIN = '@forge27.mesaschool.co'
export const TEAM_DOMAIN = '@mesaschool.co'

/**
 * People on the team who sign in with an address outside Mesa, named one by
 * one. Keep this to the reviewers in `lib/staff.ts`.
 */
export const TEAM_GUESTS: readonly string[] = ['param@joinsquareup.com']

/**
 * Role from the email domain, plus the named guests above. The founder domain
 * is tested first because it is itself a subdomain suffix, and the match is on
 * the full `@domain` so `someone@evilmesaschool.co` gets nothing back.
 */
export function roleForEmail(raw: string | null | undefined): Role | null {
  const email = (raw ?? '').trim().toLowerCase()
  if (!email.includes('@')) return null
  if (email.endsWith(STUDENT_DOMAIN)) return 'founder'
  if (email.endsWith(TEAM_DOMAIN)) return 'team'
  if (TEAM_GUESTS.includes(email)) return 'team'
  return null
}

export function normaliseEmail(raw: string | null | undefined): string {
  return (raw ?? '').trim().toLowerCase()
}
