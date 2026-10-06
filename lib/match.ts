import { archetypes as archetypeCopy, chips as chipCopy } from '@/content/copy'
import type { ArchetypeId } from './archetype'
import type { Problem } from './problem'
import { LEARN, labelOf, type LearnId } from './taxonomy'
import type { World } from './world'

/**
 * Which four problems to show a founder, and why.
 *
 * A transparent weighted score with no model, no network and no randomness:
 * the same answers always give the same four. Every chip on a card is the
 * name of a factor that scored for that card, in the founder's own terms, so
 * a recommendation can always be interrogated.
 *
 * Access carries the most weight. In a three-week sprint, being able to talk
 * to the person with the problem this week beats being excited about it.
 */

export const WEIGHTS = {
  access: 30,
  industry: 20,
  learn: 15,
  comfort: 15,
  side: 10,
  intent: 5,
  archetype: 5,
} as const

type Factor = keyof typeof WEIGHTS

/** The learning each archetype tends to love. A small nudge, never a gate. */
const AFFINITY: Record<ArchetypeId, LearnId[]> = {
  surveyor: ['data', 'agents'],
  scout: ['voice', 'mobile'],
  inventor: ['agents', 'vision'],
  tinkerer: ['automation', 'web'],
  strategist: ['web', 'data'],
  builder: ['payments', 'web'],
}

const RANK: Record<Problem['rarity'], number> = { rare: 0, epic: 1, legendary: 2, mythic: 3 }

/** Where on the rarity ladder a founder's comfort and intent point. */
export function rarityTarget(world: Pick<World, 'comfort' | 'intent'>): number {
  const base = [0, 0, 0.7, 1.2, 1.8, 2.4][world.comfort] ?? 1
  const lift = { company: 0.4, both: 0.2, career: 0, exploring: -0.2 }[world.intent]
  return Math.min(3, Math.max(0, base + lift))
}

export type MatchInput = {
  world: World
  archetype: ArchetypeId | null
  /** Problems already tried and passed on. Never shown again. */
  exclude?: string[]
  /** Problems the team suggested after a Try another. Shown first. */
  suggested?: string[]
}

export type Match = {
  problem: Problem
  score: number
  chips: string[]
  gentle: boolean
  suggested: boolean
}

type Scored = { problem: Problem; score: number; parts: { factor: Factor; value: number; chip: string | null }[] }

function scoreOne(problem: Problem, input: MatchInput): Scored {
  const { world, archetype } = input
  const parts: Scored['parts'] = []

  // A problem's first industry is what it is about; the others are where it
  // also shows up. Those count for a little and never earn a chip, so a
  // farming problem that touches retail cannot pass itself off as a retail one.
  const [primary, ...secondary] = problem.industries
  const reachable = new Set<string>(world.access.flatMap((entry) => entry.worlds))
  const reach = primary && reachable.has(primary) ? 1 : secondary.some((industry) => reachable.has(industry)) ? SECONDARY : 0
  parts.push({ factor: 'access', value: reach, chip: reach === 1 ? chipCopy.access : null })

  const liked = new Set<string>(world.industries)
  const like = primary && liked.has(primary) ? 1 : secondary.some((industry) => liked.has(industry)) ? SECONDARY : 0
  parts.push({
    factor: 'industry',
    value: like,
    chip: like === 1 && primary ? chipCopy.industry(labelOf.industryShort(primary)) : null,
  })

  const wanted = world.learn.filter((id): id is LearnId => id !== 'other')
  const overlap = problem.learn.filter((id) => wanted.includes(id))
  const learnValue = wanted.length ? Math.min(1, overlap.length / Math.min(2, wanted.length)) : 0
  const firstLearn = LEARN.find((item) => item.id === overlap[0])
  parts.push({ factor: 'learn', value: learnValue, chip: firstLearn ? firstLearn.chip : null })

  const target = rarityTarget(world)
  const rank = RANK[problem.rarity]
  const fit = Math.max(0, 1 - Math.abs(rank - target) / 2)
  parts.push({
    factor: 'comfort',
    value: fit,
    chip: fit >= 0.75 ? (rank > target + 0.25 ? chipCopy.stretch : chipCopy.sized) : null,
  })

  const sideValue = world.side === 'unsure' ? 0.5 : world.side === problem.side ? 1 : 0
  parts.push({ factor: 'side', value: sideValue, chip: sideValue === 1 ? chipCopy.side[problem.side] : null })

  const intentValue =
    world.intent === 'company' || world.intent === 'both'
      ? problem.signal.strength >= 4
        ? 1
        : 0
      : problem.learn.length >= 2
        ? 1
        : 0
  parts.push({
    factor: 'intent',
    value: intentValue,
    chip: intentValue ? (world.intent === 'company' || world.intent === 'both' ? chipCopy.demand : chipCopy.portfolio) : null,
  })

  const loves = archetype ? AFFINITY[archetype] : []
  const suits = problem.learn.some((id) => loves.includes(id))
  parts.push({
    factor: 'archetype',
    value: suits ? 1 : 0,
    chip: suits && archetype ? chipCopy.archetype(archetypeCopy[archetype].name) : null,
  })

  const score = parts.reduce((sum, part) => sum + WEIGHTS[part.factor] * part.value, 0)
  return { problem, score, parts }
}

/** The best two or three reasons, strongest first. */
function chipsOf(scored: Scored): string[] {
  return scored.parts
    .filter((part) => part.chip !== null && part.value > 0)
    .sort((a, b) => WEIGHTS[b.factor] * b.value - WEIGHTS[a.factor] * a.value)
    .slice(0, 3)
    .map((part) => part.chip as string)
}

/** How much a problem's secondary industries count, against 1 for its first. */
const SECONDARY = 0.3

/**
 * Spreading the four: each repeat of an industry or a rarity already on
 * screen costs more, and an industry the founder chose or can reach that is
 * not on screen yet earns a little, so every answer they gave gets a look in.
 */
export const SPREAD = { industry: 12, rarity: 6, coverage: 14 } as const

/** Below this, a problem has not really matched anything the founder said. */
export const MATCH_FLOOR = 25

/**
 * The four. Greedy by score, with a growing penalty for repeating an
 * industry or a rarity already chosen, so a founder never gets four of the
 * same thing.
 * If fewer than four clear the floor, the gentlest open problems fill in and
 * say so, because nobody who just answered six questions gets an empty screen.
 */
export function topMatches(problems: Problem[], input: MatchInput, count = 4): Match[] {
  const exclude = new Set(input.exclude ?? [])
  const pool = problems.filter((problem) => !exclude.has(problem.id))
  const scored = pool.map((problem) => scoreOne(problem, input))
  const out: Match[] = []

  for (const id of input.suggested ?? []) {
    const found = scored.find((item) => item.problem.id === id)
    if (found && out.length < count) {
      out.push({ problem: found.problem, score: found.score, chips: [chipCopy.suggested, ...chipsOf(found)].slice(0, 3), gentle: false, suggested: true })
    }
  }

  const taken = () => new Set(out.map((match) => match.problem.id))
  const remaining = scored
    .filter((item) => item.score >= MATCH_FLOOR)
    .sort((a, b) => b.score - a.score || a.problem.id.localeCompare(b.problem.id))

  const wanted = new Set<string>([
    ...input.world.industries,
    ...input.world.access.flatMap((entry) => entry.worlds),
  ])

  while (out.length < count) {
    const used = taken()
    const industries = out.map((match) => match.problem.industries[0])
    const rarities = out.map((match) => match.problem.rarity)
    let best: { item: Scored; adjusted: number } | null = null
    for (const item of remaining) {
      if (used.has(item.problem.id)) continue
      // Each repeat costs more than the last, so a strong industry can take
      // two cards but rarely four, and the founder's other picks get a look in.
      const sameIndustry = industries.filter((industry) => industry === item.problem.industries[0]).length
      const sameRarity = rarities.filter((rarity) => rarity === item.problem.rarity).length
      const primary = item.problem.industries[0] ?? ''
      const fresh = out.length > 0 && wanted.has(primary) && sameIndustry === 0 ? SPREAD.coverage : 0
      const adjusted = item.score - SPREAD.industry * sameIndustry - SPREAD.rarity * sameRarity + fresh
      if (!best || adjusted > best.adjusted) best = { item, adjusted }
    }
    if (!best) break
    out.push({ problem: best.item.problem, score: best.item.score, chips: chipsOf(best.item), gentle: false, suggested: false })
  }

  if (out.length < count) {
    const used = taken()
    const gentle = pool
      .filter((problem) => !used.has(problem.id))
      .sort(
        (a, b) =>
          RANK[a.rarity] - RANK[b.rarity] ||
          a.learn.length - b.learn.length ||
          b.signal.strength - a.signal.strength ||
          a.id.localeCompare(b.id),
      )
    for (const problem of gentle.slice(0, count - out.length)) {
      out.push({ problem, score: 0, chips: [chipCopy.gentle], gentle: true, suggested: false })
    }
  }

  return out
}

