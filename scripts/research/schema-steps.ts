import { z } from 'zod'
import { GEOS, INDUSTRY_IDS, LEARN_IDS, RARITIES, SIDE_IDS } from '../../lib/taxonomy'

/**
 * The shapes that pass between pipeline steps. Every file a step writes is
 * parsed with one of these by the step that reads it, whichever engine
 * (the API or the research agent) produced it.
 *
 *   candidates.json  Candidate[]   step 2, cluster
 *   scored.json      Scored[]      step 3, score
 *   dropped.json     Dropped[]     step 4, drop
 *   shortlist.json   Shortlist     step 5, balance
 *
 * The final files are checked against lib/problem.ts, not these.
 */

/** Stable within one candidates.json. Not a problem ID: those are assigned at step 6. */
export const candidateKeySchema = z.string().regex(/^C\d{3,4}$/)

export const ENGINES = ['api', 'agent'] as const

export const candidateSchema = z.object({
  key: candidateKeySchema,
  title: z.string().min(3),
  problem: z.string().min(40),
  challenge: z.string().min(10),
  /** IDs from data/research/raw/*.jsonl. Unknown IDs are ignored downstream, never invented. */
  signalIds: z.array(z.string()).min(1),
  industries: z.array(z.enum(INDUSTRY_IDS)).min(1).max(3),
  side: z.enum(SIDE_IDS),
  learn: z.array(z.enum(LEARN_IDS)).min(1).max(3),
  geo: z.enum(GEOS),
  /** `version:` of prompts/cluster.md that produced this record. */
  promptVersion: z.number().int().min(1),
  engine: z.enum(ENGINES),
})
export type Candidate = z.infer<typeof candidateSchema>
export const candidatesFileSchema = z.array(candidateSchema)

export const SCORE_KEYS = [
  'pain',
  'frequency',
  'willingness',
  'buildability',
  'learning',
  'novelty',
  'openness',
] as const
export type ScoreKey = (typeof SCORE_KEYS)[number]

const scoreSchema = z.object({ value: z.number().int().min(1).max(5), note: z.string().min(3) })

export const scoresSchema = z.object({
  pain: scoreSchema,
  frequency: scoreSchema,
  willingness: scoreSchema,
  buildability: scoreSchema,
  learning: scoreSchema,
  novelty: scoreSchema,
  openness: scoreSchema,
})
export type Scores = z.infer<typeof scoresSchema>

/** The judgement calls behind the hard drops in docs/RESEARCH.md. */
export const flagsSchema = z.object({
  hardware: z.boolean(),
  regulatedData: z.boolean(),
  governmentOnly: z.boolean(),
  incumbentFeature: z.boolean(),
  /** One line explaining any flag that is true. */
  note: z.string(),
})

export const scoredSchema = candidateSchema.extend({
  scores: scoresSchema,
  flags: flagsSchema,
  whyNow: z.string().min(10),
  players: z.array(z.object({ name: z.string().min(1), gap: z.string().min(3) })),
  /** Sum of the seven values, 7 to 35. */
  total: z.number().int().min(7).max(35),
  /** `version:` of prompts/score.md that produced the scores. */
  scorePromptVersion: z.number().int().min(1),
})
export type Scored = z.infer<typeof scoredSchema>
export const scoredFileSchema = z.array(scoredSchema)

export const DROP_REASONS = [
  'needs hardware',
  'needs regulated data',
  'government is the only buyer',
  'a feature an incumbent will ship',
  'buildability 2 or below',
  'fewer than 3 independent signals',
  // Counted after signals dated before 2024-01 are set aside (see MIN_SIGNAL_DATE).
  'only one source type',
] as const
export type DropReason = (typeof DROP_REASONS)[number]

export const droppedSchema = z.object({
  key: candidateKeySchema,
  title: z.string(),
  total: z.number(),
  signals: z.number().int(),
  reasons: z.array(z.enum(DROP_REASONS)).min(1),
})
export type Dropped = z.infer<typeof droppedSchema>
export const droppedFileSchema = z.array(droppedSchema)

export const selectedSchema = scoredSchema.extend({
  rarity: z.enum(RARITIES),
  /** pain x openness x novelty, adjusted for the inverse of buildability. Ranks rarity only. */
  ambition: z.number(),
})
export type Selected = z.infer<typeof selectedSchema>

export const shortlistSchema = z.object({
  target: z.number().int(),
  selected: z.array(selectedSchema),
  /** Kept but not selected, best first. */
  reserve: z.array(scoredSchema),
})
export type Shortlist = z.infer<typeof shortlistSchema>

// ---------------------------------------------------------------------------
// What the model returns. Looser than the records above (no keys, versions or
// totals, which the scripts add), and free of refinements, so the same shape
// can be sent as a structured-output schema. Every item is then re-checked
// against the strict schema before it is written.

export const candidateDraftSchema = z.object({
  title: z.string(),
  problem: z.string(),
  challenge: z.string(),
  signalIds: z.array(z.string()),
  industries: z.array(z.enum(INDUSTRY_IDS)),
  side: z.enum(SIDE_IDS),
  learn: z.array(z.enum(LEARN_IDS)),
  geo: z.enum(GEOS),
})
export const clusterOutputSchema = z.object({ candidates: z.array(candidateDraftSchema) })

const draftScore = z.object({ value: z.number().int(), note: z.string() })
export const scoreDraftSchema = z.object({
  key: z.string(),
  scores: z.object({
    pain: draftScore,
    frequency: draftScore,
    willingness: draftScore,
    buildability: draftScore,
    learning: draftScore,
    novelty: draftScore,
    openness: draftScore,
  }),
  flags: z.object({
    hardware: z.boolean(),
    regulatedData: z.boolean(),
    governmentOnly: z.boolean(),
    incumbentFeature: z.boolean(),
    note: z.string(),
  }),
  whyNow: z.string(),
  players: z.array(z.object({ name: z.string(), gap: z.string() })),
})
export const scoreOutputSchema = z.object({ scored: z.array(scoreDraftSchema) })

export function totalOf(scores: Scores): number {
  return SCORE_KEYS.reduce((sum, key) => sum + scores[key].value, 0)
}
