import type { Founder } from '@/lib/data/founders'

/**
 * Where a founder may be. Onboarding is three steps that open in order and
 * stay open: arrive, archetype, profile. After it everything starts from
 * their home, which shows the next thing to do. The three questions and the
 * bank exist only for a founder who ends up picking one of our problems.
 */
export const ROUTES = {
  arrive: { path: '/arrive', needs: 0 },
  archetype: { path: '/archetype', needs: 1 },
  profile: { path: '/profile', needs: 2 },
  world: { path: '/world', needs: 3 },
  matches: { path: '/matches', needs: 3 },
} as const

export type Step = keyof typeof ROUTES

type Where = Pick<Founder, 'level' | 'world'>

/** The furthest place a founder can be, which is where signing in takes them. */
export function currentPath(founder: Where): string {
  const order: Step[] = ['arrive', 'archetype', 'profile']
  if (founder.level < 3) return ROUTES[order[Math.max(0, founder.level)] ?? 'arrive'].path
  return '/build'
}

export function mayEnter(founder: Where, step: Step): boolean {
  if (founder.level < ROUTES[step].needs) return false
  return step === 'matches' ? founder.world !== null : true
}
