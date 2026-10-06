/**
 * A team member's name from their email, for the console: priya.sharma@ reads
 * as Priya Sharma. Good enough to say who approved what without a staff list.
 */
export function nameOf(email: string): string {
  const local = email.split('@')[0] ?? email
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
