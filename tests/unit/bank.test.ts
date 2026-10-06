import { describe, expect, it } from 'vitest'
import problems from '@/data/problems.json'
import internal from '@/data/problems.internal.json'
import { problemInternalSchema, problemSchema } from '@/lib/problem'

describe('the problem bank', () => {
  it('parses against the shared schema, so every tag is in the taxonomy', () => {
    for (const raw of problems as unknown[]) expect(() => problemSchema.parse(raw)).not.toThrow()
  })
  it('has frozen, unique, gapless IDs', () => {
    const ids = (problems as { id: string }[]).map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach((id, index) => expect(id).toBe(`P${String(index + 1).padStart(3, '0')}`))
  })
  it('has internal evidence for every problem', () => {
    const ids = new Set((internal as unknown[]).map((raw) => problemInternalSchema.parse(raw).id))
    for (const item of problems as { id: string }[]) expect(ids.has(item.id)).toBe(true)
  })
  it('never names a solution in the problem text', () => {
    for (const item of problems as { problem: string }[]) {
      expect(item.problem).not.toMatch(/\b(an? app|platform|AI-powered|tool that)\b/i)
    }
  })
})
