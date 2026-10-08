import type { Founder } from '@/lib/data/founders'

/**
 * Where a founder may be. Onboarding is 4 steps and opens in order: arrive,
 * archetype, profile, the challenge. Seeing the challenge (level 4) opens the
 * 3 weeks: the kickoff, Today, Plan and Phases. Research is the plan's first
 * work, not an onboarding step; sending it unlocks the build days.
 */
export const ROUTES = {
  arrive: { path: '/arrive', needs: 0 },
  archetype: { path: '/archetype', needs: 1 },
  profile: { path: '/profile', needs: 2 },
  challenge: { path: '/challenge', needs: 3 },
  today: { path: '/today', needs: 4 },
} as const

export type Step = keyof typeof ROUTES

/** The furthest place a founder can be, which is where signing in takes them. */
export function currentPath(founder: Pick<Founder, 'level'>): string {
  if (founder.level >= ROUTES.today.needs) return ROUTES.today.path
  const order: Step[] = ['arrive', 'archetype', 'profile', 'challenge']
  return ROUTES[order[Math.min(founder.level, order.length - 1)]!].path
}

export function mayEnter(founder: Pick<Founder, 'level'>, step: Step): boolean {
  return founder.level >= ROUTES[step].needs
}
