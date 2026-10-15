import type { ArchetypeId } from './archetype'
import type { Problem } from './problem'
import type { Difficulty, LearnId } from './taxonomy'
import type { World } from './world'

/**
 * Which problems to show a founder, and in what order.
 *
 * A transparent weighted score with no model, no network and no randomness:
 * the same answers always give the same list. The industries a founder chose
 * carry the most weight, because in 2 days caring about the people with the
 * problem is what keeps someone building.
 */

export const WEIGHTS = {
  industry: 45,
  learn: 30,
  side: 20,
  archetype: 5,
} as const

/** The kind of build each archetype tends to love. A small nudge, never a gate. */
const AFFINITY: Record<ArchetypeId, LearnId[]> = {
  surveyor: ['data', 'agents'],
  scout: ['voice', 'mobile'],
  inventor: ['agents', 'vision'],
  tinkerer: ['automation', 'web'],
  strategist: ['web', 'data'],
  builder: ['payments', 'web'],
}

export type MatchInput = {
  world: World
  archetype: ArchetypeId | null
}

export type Match<P extends Problem = Problem> = {
  problem: P
  score: number
  /** Nothing the founder said points here; shown so the screen is never empty. */
  gentle: boolean
}

/** How much a problem's secondary industries count, against 1 for its first. */
const SECONDARY = 0.3

export function scoreOf(problem: Problem, input: MatchInput): number {
  const { world, archetype } = input

  // A problem's first industry is what it is about; the others are where it
  // also shows up. Those count for a little, so a farming problem that touches
  // retail cannot pass itself off as a retail one.
  const [primary, ...secondary] = problem.industries
  const liked = new Set<string>(world.industries)
  const industry =
    primary && liked.has(primary) ? 1 : secondary.some((item) => liked.has(item)) ? SECONDARY : 0

  const overlap = problem.learn.filter((id) => world.learn.includes(id))
  const learn = Math.min(1, overlap.length / Math.min(2, world.learn.length))

  const side = world.side === 'unsure' ? 0.5 : world.side === problem.side ? 1 : 0

  const loves = archetype ? AFFINITY[archetype] : []
  const suits = problem.learn.some((id) => loves.includes(id)) ? 1 : 0

  return (
    WEIGHTS.industry * industry +
    WEIGHTS.learn * learn +
    WEIGHTS.side * side +
    WEIGHTS.archetype * suits
  )
}

/**
 * Spreading the list: each repeat of an industry already chosen costs more,
 * and an industry the founder picked that has not appeared yet earns a little,
 * so every answer they gave gets a look in.
 */
export const SPREAD = { industry: 12, coverage: 14 } as const

/** Below this, a problem has not really matched anything the founder said. */
export const MATCH_FLOOR = 25

/** How many problems of each level a founder is shown. */
export type Mix = Record<Difficulty, number>

/**
 * What each set of 4 is made of. The first set is 1 easy, 2 medium and 1
 * hard. Asking for 4 others swaps a medium for an easy; asking again drops
 * the hard one. After the third set there are no more. The owner's rule.
 */
export const MIXES: [Mix, Mix, Mix] = [
  { easy: 1, medium: 2, hard: 1 },
  { easy: 2, medium: 1, hard: 1 },
  { easy: 2, medium: 2, hard: 0 },
]

export const SETS = MIXES.length

const EASIER: Record<Difficulty, Difficulty[]> = {
  hard: ['medium', 'easy'],
  medium: ['easy', 'hard'],
  easy: ['medium', 'hard'],
}

/**
 * The founder's problems, best first, with a set number from each level.
 * Greedy by score among the levels that still have a place to fill, with a
 * growing penalty for repeating an industry, so nobody gets four of the same
 * thing. A place nothing matched is filled by the best-evidenced problem of
 * that level and says so; a level the bank has run out of gives its place to
 * the nearest level that has one. Nobody who answered gets fewer than the mix
 * while the bank can fill it.
 */
export function topMatches<P extends Problem>(
  all: P[],
  input: MatchInput,
  mix: Mix = MIXES[0],
  /** Problems already shown in an earlier set: never shown twice. */
  exclude: ReadonlySet<string> = new Set(),
): Match<P>[] {
  const problems = all.filter((problem) => !exclude.has(problem.id))
  const scored = problems
    .map((problem) => ({ problem, score: scoreOf(problem, input) }))
    .sort((a, b) => b.score - a.score || a.problem.id.localeCompare(b.problem.id))
  const wanted = new Set<string>(input.world.industries)
  const left: Mix = { ...mix }
  const out: Match<P>[] = []
  const used = new Set<string>()

  // A level with too few problems hands its places to the nearest level.
  for (const level of ['hard', 'medium', 'easy'] as const) {
    const have = problems.filter((problem) => problem.difficulty === level).length
    let spare = Math.max(0, left[level] - have)
    left[level] -= spare
    for (const other of EASIER[level]) {
      if (!spare) break
      const room = problems.filter((problem) => problem.difficulty === other).length - left[other]
      const moved = Math.min(spare, Math.max(0, room))
      left[other] += moved
      spare -= moved
    }
  }

  const take = (item: (typeof scored)[number], gentle: boolean) => {
    used.add(item.problem.id)
    left[item.problem.difficulty] -= 1
    out.push({ problem: item.problem, score: gentle ? 0 : item.score, gentle })
  }

  for (;;) {
    const industries = out.map((match) => match.problem.industries[0])
    let best: { item: (typeof scored)[number]; adjusted: number } | null = null
    for (const item of scored) {
      if (item.score < MATCH_FLOOR) break
      if (used.has(item.problem.id) || left[item.problem.difficulty] <= 0) continue
      const primary = item.problem.industries[0] ?? ''
      // Each repeat costs more than the last, so a strong industry can take
      // two cards but rarely four, and the founder's other picks get a look in.
      const same = industries.filter((industry) => industry === primary).length
      const fresh = out.length > 0 && wanted.has(primary) && same === 0 ? SPREAD.coverage : 0
      const adjusted = item.score - SPREAD.industry * same * (same + 1) * 0.5 + fresh
      if (!best || adjusted > best.adjusted) best = { item, adjusted }
    }
    if (!best) break
    take(best.item, false)
  }

  // Places nothing matched: the best-evidenced open problems of that level.
  const gentle = [...scored].sort(
    (a, b) =>
      b.problem.signal.strength - a.problem.signal.strength ||
      a.problem.id.localeCompare(b.problem.id),
  )
  for (const item of gentle) {
    if (!used.has(item.problem.id) && left[item.problem.difficulty] > 0) take(item, true)
  }

  return out.sort((a, b) => b.score - a.score || a.problem.id.localeCompare(b.problem.id))
}

/**
 * Every set a founder can see, in order: the first 4, then 4 others, then 4
 * more, each in its own mix and none repeating a problem from a set before
 * it. The same answers always give the same sets, so going back to an earlier
 * one shows exactly what was there.
 */
export function matchSets<P extends Problem>(problems: P[], input: MatchInput): Match<P>[][] {
  const shown = new Set<string>()
  return MIXES.map((mix) => {
    const set = topMatches(problems, input, mix, shown)
    for (const match of set) shown.add(match.problem.id)
    return set
  }).filter((set) => set.length > 0)
}
