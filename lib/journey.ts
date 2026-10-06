import type { Founder } from '@/lib/data/founders'

/**
 * Where a founder may be. Levels open in order and stay open: you can go back
 * to anything you have done, never skip ahead. The stored level is the
 * furthest one completed (0 before arriving, 6 once a why is sent).
 */
export const ROUTES = {
  arrive: { path: '/arrive', needs: 0 },
  archetype: { path: '/archetype', needs: 1 },
  profile: { path: '/profile', needs: 2 },
  world: { path: '/world', needs: 3 },
  matches: { path: '/matches', needs: 4 },
  why: { path: '/why', needs: 4 },
} as const

export type Step = keyof typeof ROUTES

/** The furthest place a founder can be, which is where signing in takes them. */
export function currentPath(founder: Pick<Founder, 'level' | 'slug'>): string {
  if (founder.level >= 6) return `/f/${founder.slug}`
  const order: Step[] = ['arrive', 'archetype', 'profile', 'world', 'matches']
  return ROUTES[order[Math.min(founder.level, order.length - 1)]!].path
}

export function mayEnter(founder: Pick<Founder, 'level'>, step: Step): boolean {
  return founder.level >= ROUTES[step].needs
}
