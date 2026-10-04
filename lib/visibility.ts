import { normaliseEmail } from './roles'
import type { BetMap, Role } from './types'

/**
 * The team sees every bettor's email. A student sees an email on their own bet
 * only, which is how the client knows which problem is theirs.
 */
export function visibleBets(role: Role, viewerEmail: string, bets: BetMap): BetMap {
  if (role === 'team') return bets
  const me = normaliseEmail(viewerEmail)
  const out: BetMap = {}
  for (const [id, bet] of Object.entries(bets)) {
    out[id] =
      normaliseEmail(bet.email) === me
        ? { name: bet.name, photo: bet.photo, at: bet.at, email: me }
        : { name: bet.name, photo: bet.photo, at: bet.at }
  }
  return out
}
