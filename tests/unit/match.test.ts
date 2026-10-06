import { describe, expect, it } from 'vitest'
import { MATCH_FLOOR, rarityTarget, topMatches } from '@/lib/match'
import type { Problem } from '@/lib/problem'
import type { World } from '@/lib/world'
import { chips } from '@/content/copy'

let n = 0
function problem(over: Partial<Problem>): Problem {
  n += 1
  return {
    id: `P${String(n).padStart(3, '0')}`,
    title: 'A title',
    problem: 'x'.repeat(100),
    challenge: 'Make something better',
    rarity: 'epic',
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
  problem({ industries: ['retail'], side: 'business', learn: ['data'], rarity: 'rare' }),
  problem({ industries: ['health'], side: 'consumer', learn: ['voice'], rarity: 'epic' }),
  problem({ industries: ['health'], side: 'consumer', learn: ['voice'], rarity: 'epic' }),
  problem({ industries: ['money'], side: 'business', learn: ['payments'], rarity: 'mythic' }),
  problem({ industries: ['retail'], side: 'consumer', learn: ['voice'], rarity: 'legendary' }),
  problem({ industries: ['fashion'], side: 'creator', learn: ['vision'], rarity: 'rare' }),
]

describe('topMatches', () => {
  it('is deterministic', () => {
    const a = topMatches(bank, { world, archetype: 'scout' })
    const b = topMatches([...bank].reverse(), { world, archetype: 'scout' })
    expect(a.map((match) => match.problem.id)).toEqual(b.map((match) => match.problem.id))
  })

  it('returns four, and never an empty screen', () => {
    expect(topMatches(bank, { world, archetype: null })).toHaveLength(4)
    const nothing: World = { ...world, industries: ['agri'], access: [], learn: ['payments'], side: 'creator' }
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

  it('breaks near-ties toward an industry it has not shown yet', () => {
    const both: World = { ...world, industries: ['health', 'money'], access: [] }
    const h1 = problem({ industries: ['health'], side: 'consumer', learn: ['voice'] })
    const h2 = problem({ industries: ['health'], side: 'consumer', learn: ['voice'] })
    const m = problem({ industries: ['money'], side: 'consumer', learn: ['voice'] })
    const order = topMatches([h1, h2, m], { world: both, archetype: null }).map((match) => match.problem.id)
    expect(order.slice(0, 2)).toEqual([h1.id, m.id])
  })

  it('never shows an excluded problem and puts suggestions first', () => {
    const matches = topMatches(bank, { world, archetype: null, exclude: [bank[0]!.id], suggested: [bank[5]!.id] })
    expect(matches.map((match) => match.problem.id)).not.toContain(bank[0]!.id)
    expect(matches[0]?.problem.id).toBe(bank[5]!.id)
    expect(matches[0]?.chips[0]).toBe(chips.suggested)
  })

  it('marks the fallback as gentle and says so', () => {
    const nothing: World = { ...world, industries: ['agri'], access: [], learn: ['payments'], side: 'creator', comfort: 1, intent: 'exploring' }
    const matches = topMatches([problem({ rarity: 'mythic', industries: ['homes'], learn: ['vision'], side: 'business' })], {
      world: nothing,
      archetype: null,
    })
    expect(matches[0]?.gentle).toBe(true)
    expect(matches[0]?.chips).toEqual([chips.gentle])
  })
})

describe('rarityTarget', () => {
  it('climbs with comfort and with company intent', () => {
    expect(rarityTarget({ comfort: 1, intent: 'career' })).toBeLessThan(rarityTarget({ comfort: 5, intent: 'career' }))
    expect(rarityTarget({ comfort: 3, intent: 'company' })).toBeGreaterThan(rarityTarget({ comfort: 3, intent: 'career' }))
  })
})
