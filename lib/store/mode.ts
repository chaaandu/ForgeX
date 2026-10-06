/**
 * Mock mode swaps the Sheet for memory and adds a password-less sign-in. It
 * must never be reachable in production, so it needs the flag and a
 * non-production deploy, not just the flag.
 */
export function isMock(): boolean {
  return process.env.MOCK_BACKEND === 'true' && process.env.VERCEL_ENV !== 'production'
}
