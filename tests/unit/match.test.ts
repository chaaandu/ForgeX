import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { MATCH_FLOOR, matchSets, MIXES, scoreOf, SETS, topMatches } from '@/lib/match'
import { problemSchema, scopeFileSchema, type Problem } from '@/lib/problem'
import { INDUSTRY_IDS, type Difficulty } from '@/lib/taxonomy'
import type { World } from '@/lib/world'

const read = (name: string) =>
  JSON.parse(readFileSync(join(process.cwd(), 'data', name), 'utf8')) as unknown[]

/** The pool a founder is matched from: the problems with a 2-day version. */
const open = new Set(
  scopeFileSchema
    .parse(read('problems.scope.json'))
    .filter((item) => item.fit)
    .map((item) => item.id),
)
const bank = read('problems.json')
  .map((item) => problemSchema.parse(item))
  .filter((item) => open.has(item.id))

const world = (patch: Partial<World> = {}): World => ({
  v: 2,
  industries: ['retail'],
  side: 'business',
  learn: ['data'],
  ...patch,
})

const problem = (patch: Partial<Problem>): Problem => ({
  id: 'P900',
  title: 'A test problem',
  problem: 'x'.repeat(90),
  challenge: 'Help someone do something.',
  difficulty: 'medium',
  industries: ['retail'],
  side: 'business',
  learn: ['data'],
  geo: 'IN',
  signal: { count: 3, strength: 3, line: 'Seen across 3 posts' },
  ...patch,
})

const levels = (list: { problem: Problem }[]) => {
  const count: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 }
  for (const match of list) count[match.problem.difficulty] += 1
  return count
}

describe('the mix', () => {
  it('is 1 easy, 2 medium and 1 hard, then easier with each set of 4 others', () => {
    expect(MIXES).toEqual([
      { easy: 1, medium: 2, hard: 1 },
      { easy: 2, medium: 1, hard: 1 },
      { easy: 2, medium: 2, hard: 0 },
    ])
    expect(SETS).toBe(3)
  })

  it('gives every founder 3 sets in that mix, and never the same problem twice', () => {
    for (const industry of INDUSTRY_IDS) {
      const input = { world: world({ industries: [industry], side: 'unsure' }), archetype: null }
      const sets = matchSets(bank, input)
      expect(sets, industry).toHaveLength(3)
      sets.forEach((set, index) => {
        expect(set, `${industry}, set ${index + 1}`).toHaveLength(4)
        expect(levels(set), `${industry}, set ${index + 1}`).toEqual(MIXES[index])
      })
      const ids = sets.flat().map((match) => match.problem.id)
      expect(new Set(ids).size, industry).toBe(12)
    }
  })

  it('shows the same sets every time, so going back finds the same 4', () => {
    const input = { world: world({ industries: ['food', 'health'] }), archetype: 'scout' as const }
    const ids = (sets: ReturnType<typeof matchSets<Problem>>) =>
      sets.map((set) => set.map((match) => match.problem.id))
    expect(ids(matchSets(bank, input))).toEqual(ids(matchSets(bank, input)))
    expect(matchSets(bank, input)[0]).toEqual(topMatches(bank, input))
  })

  it('hands a place to the nearest level when a level has run out', () => {
    const pool = [
      problem({ id: 'P901', difficulty: 'easy' }),
      problem({ id: 'P902', difficulty: 'medium' }),
      problem({ id: 'P903', difficulty: 'medium' }),
      problem({ id: 'P904', difficulty: 'medium' }),
    ]
    const shown = topMatches(pool, { world: world(), archetype: null }, MIXES[0])
    expect(levels(shown)).toEqual({ easy: 1, medium: 3, hard: 0 })
  })
})

describe('topMatches', () => {
  it('is deterministic', () => {
    const input = { world: world(), archetype: 'surveyor' as const }
    expect(topMatches(bank, input).map((match) => match.problem.id)).toEqual(
      topMatches(bank, input).map((match) => match.problem.id),
    )
  })

  it('returns four, and never an empty screen', () => {
    const picky = world({ industries: ['other'], side: 'creator', learn: ['voice'] })
    expect(topMatches(bank, { world: picky, archetype: null })).toHaveLength(4)
    expect(topMatches([], { world: world(), archetype: null })).toHaveLength(0)
  })

  it('leans to the industries a founder chose', () => {
    const top = topMatches(bank, { world: world({ industries: ['agri'] }), archetype: null })
    expect(top.filter((match) => match.problem.industries.includes('agri')).length).toBeGreaterThan(
      0,
    )
  })

  it('counts a secondary industry for less than the first', () => {
    const input = { world: world({ industries: ['food'] }), archetype: null }
    const first = scoreOf(problem({ industries: ['food', 'retail'] }), input)
    const second = scoreOf(problem({ industries: ['retail', 'food'] }), input)
    const none = scoreOf(problem({ industries: ['retail'] }), input)
    expect(first).toBeGreaterThan(second)
    expect(second).toBeGreaterThan(none)
  })

  it('gives every chosen industry a look in', () => {
    const chosen = ['retail', 'health', 'education'] as const
    const top = topMatches(bank, { world: world({ industries: [...chosen] }), archetype: null })
    const shown = new Set(top.map((match) => match.problem.industries[0]))
    for (const industry of chosen) expect(shown.has(industry), industry).toBe(true)
  })

  it('marks a place nothing matched as gentle', () => {
    const far = problem({ id: 'P901', industries: ['agri'], side: 'creator', learn: ['voice'] })
    const input = { world: world(), archetype: null }
    expect(scoreOf(far, input)).toBeLessThan(MATCH_FLOOR)
    expect(topMatches([far], input)).toEqual([{ problem: far, score: 0, gentle: true }])
  })
})
