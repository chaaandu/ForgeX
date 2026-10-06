/**
 * Where to go after signing in. Only a path on this site is accepted, so a
 * crafted link cannot bounce someone to another domain. Anything else goes
 * through /enter, which sends a founder to the furthest level they reached.
 */
export function safeNext(raw: string | undefined | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\') || raw.startsWith('/login')) return '/enter'
  return raw
}
