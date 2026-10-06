import 'server-only'
import archetypes from '@/data/archetypes.json'
import { archetypeOf, ARCHETYPES, type ArchetypeId } from '@/lib/archetype'
import { students } from '@/lib/students'
import type { Problem } from '@/lib/problem'

export type Face = {
  first: string
  photo: string
  archetype: ArchetypeId | null
}

const axesByEmail = new Map(
  (archetypes as { email: string; axes: { u: number; e: number; s: number } }[]).map((row) => [
    row.email,
    row.axes,
  ]),
)

export const faces: Face[] = students
  .filter((student) => student.photo)
  .map((student) => {
    const axes = axesByEmail.get(student.email)
    return {
      first: student.firstName,
      photo: student.photo ?? '',
      archetype: axes ? archetypeOf(axes) : null,
    }
  })

const sample = faces.find((face) => face.archetype === 'scout') ?? faces[0]!

export const founder = {
  name: students.find((student) => student.photo === sample.photo)?.name ?? sample.first,
  first: sample.first,
  photo: sample.photo,
  number: 23,
  of: 119,
  archetype: (sample.archetype ?? 'scout') as ArchetypeId,
  bio: "Grew up behind the counter of my dad's hardware shop. Want to build the tool he never had.",
}

export const family = ARCHETYPES[founder.archetype].family

/** A sample, written to the bank's rules, for judging the card. Not in the bank. */
export const sampleProblem: Problem = {
  id: 'P000',
  title: 'Kirana shelves are restocked from memory',
  problem:
    'A neighbourhood store carries over a thousand items and reorders most of them from memory. Stock-outs are noticed when a customer asks, and dead stock at the year-end count. The cost is quiet: sales nobody records and cash sitting on shelves.',
  challenge: 'Make knowing what to reorder take ten minutes a week, not a guess.',
  rarity: 'epic',
  industries: ['retail'],
  side: 'business',
  learn: ['vision', 'data'],
  geo: 'IN',
  signal: { count: 23, strength: 4, line: 'Seen across 23 posts in 2025 and 2026' },
}

export const sampleChips = ['You can reach this user', 'Teaches computer vision', 'Retail, your pick']
