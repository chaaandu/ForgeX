import { describe, expect, it } from 'vitest'
import h1 from '@/data/archetypes.json'
import {
  archetypeOf,
  ARCHETYPES,
  classify,
  isCompleteTrial,
  scoreTrial,
  TRIAL,
} from '@/lib/archetype'
import { trial as trialCopy } from '@/content/copy'

type Row = { archetype: string; axes: { u: number; e: number; s: number } }

describe('six archetypes from the Hackathon 1 axes', () => {
  const rows = h1 as Row[]

  it('keeps every founder in the family Hackathon 1 gave them', () => {
    for (const row of rows) expect(ARCHETYPES[archetypeOf(row.axes)].family).toBe(row.archetype)
  })

  it('maps the 110 into the six as expected', () => {
    const counts: Record<string, number> = {}
    for (const row of rows) counts[archetypeOf(row.axes)] = (counts[archetypeOf(row.axes)] ?? 0) + 1
    expect(rows).toHaveLength(110)
    expect(counts).toEqual({
      surveyor: 20,
      scout: 39,
      inventor: 15,
      tinkerer: 13,
      strategist: 11,
      builder: 12,
    })
  })

  it('breaks ties experiment, then understand, then structure', () => {
    expect(classify({ u: 5, e: 5, s: 5 })).toBe('alchemist')
    expect(archetypeOf({ u: 5, e: 5, s: 5 })).toBe('inventor')
    expect(archetypeOf({ u: 6, e: 2, s: 2 })).toBe('scout')
    expect(archetypeOf({ u: 2, e: 2, s: 6 })).toBe('builder')
  })

  it('scores only complete trials, by option key', () => {
    const answers = Object.fromEntries(
      TRIAL.map((question) => [question.id, question.options[0]!.key]),
    )
    expect(isCompleteTrial(answers)).toBe(true)
    expect(isCompleteTrial({ ...answers, 'it-broke': 'nonsense' })).toBe(false)
    expect(scoreTrial(answers).u).toBeGreaterThan(0)
  })

  it('has founder-facing copy for every question and option, with no quote glyphs', () => {
    for (const question of TRIAL) {
      const copy = trialCopy[question.id]
      expect(copy).toBeDefined()
      for (const option of question.options) {
        const label = copy?.options[option.key]
        expect(label).toBeTruthy()
        expect(label).not.toMatch(/[“”‘’"]/)
      }
    }
  })
})
