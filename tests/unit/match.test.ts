import { describe, expect, it } from 'vitest'
import { MATCH_FLOOR, difficultyTarget, topMatches } from '@/lib/match'
import type { Problem } from '@/lib/problem'
import type { World } from '@/lib/world'
import { chips } from '@/content/copy'
import { TRACK_DIFFICULTIES, seesBank, trackOf } from '@/lib/tracks'

let n = 0
function problem(over: Partial<Problem>): Problem {
  n += 1
  return {
    id: `P${String(n).padStart(3, '0')}`,
    title: 'A title',
    problem: 'x'.repeat(100),
    challenge: 'Make something better',
    difficulty: 'medium',
    industries: ['retail'],
    side: 'business',
    learn: ['data'],
    geo: 'IN',
    signal: { count: 5, strength: 3, line: 'Seen across 5 posts in 2026' },
    ...over,
  }
}

const world: World = {
  v: 1,
  industries: ['health'],
  side: 'consumer',
  access: [{ kind: 'family', worlds: ['retail'] }],
  learn: ['voice'],
  intent: 'career',
  comfort: 3,
}

const bank = [
  problem({ industries: ['retail'], side: 'business', learn: ['data'], difficulty: 'easy' }),
  problem({ industries: ['health'], side: 'consumer', learn: ['voice'], difficulty: 'medium' }),
  problem({ industries: ['health'], side: 'consumer', learn: ['voice'], difficulty: 'medium' }),
  problem({ industries: ['money'], side: 'business', learn: ['payments'], difficulty: 'hard' }),
  problem({ industries: ['retail'], side: 'consumer', learn: ['voice'], difficulty: 'medium' }),
  problem({ industries: ['fashion'], side: 'creator', learn: ['vision'], difficulty: 'easy' }),
]

describe('topMatches', () => {
  it('is deterministic', () => {
    const a = topMatches(bank, { world, archetype: 'scout' })
    const b = topMatches([...bank].reverse(), { world, archetype: 'scout' })
    expect(a.map((match) => match.problem.id)).toEqual(b.map((match) => match.problem.id))
  })

  it('returns four, and never an empty screen', () => {
    expect(topMatches(bank, { world, archetype: null })).toHaveLength(4)
    const nothing: World = {
      ...world,
      industries: ['agri'],
      access: [],
      learn: ['payments'],
      side: 'creator',
    }
    const matches = topMatches(bank.slice(0, 4), { world: nothing, archetype: null })
    expect(matches).toHaveLength(4)
  })

  it('puts access first: a reachable world beats a merely liked one', () => {
    const [first] = topMatches(bank, { world, archetype: null })
    expect(first?.problem.industries).toContain('retail')
    expect(first?.chips[0]).toBe(chips.access)
  })

  it('only gives chips for factors that scored', () => {
    for (const match of topMatches(bank, { world, archetype: 'scout' })) {
      if (match.gentle) continue
      if (match.chips.includes(chips.access)) expect(match.problem.industries).toContain('retail')
      if (match.chips.includes('Teaches voice AI')) expect(match.problem.learn).toContain('voice')
      if (match.chips.includes(chips.side.consumer)) expect(match.problem.side).toBe('consumer')
      expect(match.score).toBeGreaterThanOrEqual(MATCH_FLOOR)
    }
  })

  it('counts a secondary industry for half and never chips it', () => {
    const farming = problem({ industries: ['agri', 'retail'], side: 'business', learn: ['data'] })
    const shop = problem({ industries: ['retail'], side: 'business', learn: ['data'] })
    const [first, second] = topMatches([farming, shop], { world, archetype: null })
    expect(first?.problem.id).toBe(shop.id)
    expect(second?.chips).not.toContain(chips.access)
    expect(second?.chips).not.toContain(chips.industry('Retail'))
  })

  it('breaks near-ties toward an industry it has not shown yet', () => {
    const both: World = { ...world, industries: ['health', 'money'], access: [] }
    const h1 = problem({ industries: ['health'], side: 'consumer', learn: ['voice'] })
    const h2 = problem({ industries: ['health'], side: 'consumer', learn: ['voice'] })
    const m = problem({ industries: ['money'], side: 'consumer', learn: ['voice'] })
    const order = topMatches([h1, h2, m], { world: both, archetype: null }).map(
      (match) => match.problem.id,
    )
    expect(order.slice(0, 2)).toEqual([h1.id, m.id])
  })

  it('never shows an excluded problem and puts suggestions first', () => {
    const matches = topMatches(bank, {
      world,
      archetype: null,
      exclude: [bank[0]!.id],
      suggested: [bank[5]!.id],
    })
    expect(matches.map((match) => match.problem.id)).not.toContain(bank[0]!.id)
    expect(matches[0]?.problem.id).toBe(bank[5]!.id)
    expect(matches[0]?.chips[0]).toBe(chips.suggested)
  })

  it('marks the fallback as gentle and says so', () => {
    const nothing: World = {
      ...world,
      industries: ['agri'],
      access: [],
      learn: ['payments'],
      side: 'creator',
      comfort: 1,
      intent: 'exploring',
    }
    const matches = topMatches(
      [problem({ difficulty: 'hard', industries: ['homes'], learn: ['vision'], side: 'business' })],
      {
        world: nothing,
        archetype: null,
      },
    )
    expect(matches[0]?.gentle).toBe(true)
    expect(matches[0]?.chips).toEqual([chips.gentle])
  })
})

describe('difficultyTarget', () => {
  it('climbs with comfort and with company intent', () => {
    expect(difficultyTarget({ comfort: 1, intent: 'career' })).toBeLessThan(
      difficultyTarget({ comfort: 5, intent: 'career' }),
    )
    expect(difficultyTarget({ comfort: 3, intent: 'company' })).toBeGreaterThan(
      difficultyTarget({ comfort: 3, intent: 'career' }),
    )
  })
})

describe('tracks', () => {
  it('never offers a difficulty the track does not allow', () => {
    const guided = topMatches(bank, { world, archetype: null, allowed: TRACK_DIFFICULTIES.guided })
    expect(guided.every((match) => match.problem.difficulty !== 'hard')).toBe(true)
    const structured = topMatches(bank, {
      world,
      archetype: null,
      allowed: TRACK_DIFFICULTIES.structured,
    })
    expect(structured.every((match) => match.problem.difficulty !== 'easy')).toBe(true)
  })

  it('gives autonomous founders no bank at all, and reads unknown tracks as structured', () => {
    expect(seesBank('autonomous')).toBe(false)
    expect(seesBank(trackOf(' Guided '))).toBe(true)
    expect(trackOf('')).toBe('structured')
  })
})
