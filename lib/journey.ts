import type { Founder } from '@/lib/data/founders'

/**
 * Where a founder may be. Onboarding opens in order and stays open: you can
 * go back to anything you have done, never skip ahead. The stored level is
 * the furthest step finished (0 before arriving, 5 once research is sent).
 * From 5 on, the plan is home: Today, Plan, Stops and Messages.
 */
export const ROUTES = {
  arrive: { path: '/arrive', needs: 0 },
  archetype: { path: '/archetype', needs: 1 },
  profile: { path: '/profile', needs: 2 },
  challenge: { path: '/challenge', needs: 3 },
  research: { path: '/research', needs: 4 },
  today: { path: '/today', needs: 5 },
} as const

export type Step = keyof typeof ROUTES

/** The furthest place a founder can be, which is where signing in takes them. */
export function currentPath(founder: Pick<Founder, 'level'>): string {
  if (founder.level >= ROUTES.today.needs) return ROUTES.today.path
  const order: Step[] = ['arrive', 'archetype', 'profile', 'challenge', 'research']
  return ROUTES[order[Math.min(founder.level, order.length - 1)]!].path
}

export function mayEnter(founder: Pick<Founder, 'level'>, step: Step): boolean {
  return founder.level >= ROUTES[step].needs
}
