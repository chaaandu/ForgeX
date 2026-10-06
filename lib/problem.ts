import { z } from 'zod'
import { GEOS, INDUSTRY_IDS, LEARN_IDS, RARITIES, SIDE_IDS } from './taxonomy'

/**
 * A problem as founders see it. Nothing here names a target user or a
 * solution: finding those is the founder's work. `data/problems.json` is an
 * array of these, and the Problems tab holds the same fields plus a Status.
 */
export const problemIdSchema = z.string().regex(/^P\d{3}$/)

export const problemSchema = z.object({
  id: problemIdSchema,
  title: z
    .string()
    .min(3)
    .refine((title) => title.trim().split(/\s+/).length < 10, 'Title must be under ten words'),
  problem: z.string().min(80).max(600),
  challenge: z.string().min(10).max(160),
  rarity: z.enum(RARITIES),
  industries: z.array(z.enum(INDUSTRY_IDS)).min(1).max(3),
  side: z.enum(SIDE_IDS),
  learn: z.array(z.enum(LEARN_IDS)).min(1).max(3),
  geo: z.enum(GEOS),
  signal: z.object({
    count: z.number().int().min(1),
    /** 1 to 5, the count on a log scale nudged by source diversity. */
    strength: z.number().int().min(1).max(5),
    /** For example "Seen across 23 posts in 2025 and 2026". No links. */
    line: z.string().min(5),
  }),
})

export type Problem = z.infer<typeof problemSchema>

const score = z.object({ value: z.number().int().min(1).max(5), note: z.string().min(3) })

/** Everything the team sees and founders never do. `data/problems.internal.json`. */
export const problemInternalSchema = z.object({
  id: problemIdSchema,
  evidence: z
    .array(
      z.object({
        source: z.string(),
        url: z.string().url(),
        date: z.string(),
        paraphrase: z.string().max(240),
      }),
    )
    .min(3),
  sources: z.record(z.string(), z.number().int().min(0)),
  whyNow: z.string().min(10),
  players: z.array(z.object({ name: z.string(), gap: z.string() })),
  scores: z.object({
    pain: score,
    frequency: score,
    willingness: score,
    buildability: score,
    learning: score,
    novelty: score,
    openness: score,
  }),
  total: z.number(),
})

export type ProblemInternal = z.infer<typeof problemInternalSchema>

export const RARITY_LABEL: Record<Problem['rarity'], string> = {
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
}
