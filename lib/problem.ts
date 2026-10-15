import { z } from 'zod'
import { DIFFICULTIES, GEOS, INDUSTRY_IDS, LEARN_IDS, SIDE_IDS } from './taxonomy'

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
  /** For the team only. Stripped before anything reaches a founder's browser. */
  difficulty: z.enum(DIFFICULTIES),
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

export const DIFFICULTY_LABEL: Record<Problem['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

/**
 * A problem cut down to what one founder can build in 2 days: the narrower
 * challenge, what we expect to see working, and where to go if there is time
 * left. `data/problems.scope.json` holds one per problem that fits; a problem
 * without one is never offered.
 */
const bullet = z.string().trim().min(8).max(140)

export const scopeSchema = z.object({
  task: z.string().trim().min(10).max(200),
  expect: z.array(bullet).min(3).max(6),
  further: z.array(bullet).max(3),
})

export type Scope = z.infer<typeof scopeSchema>

export const scopeFileSchema = z.array(
  z.union([
    scopeSchema.extend({ id: problemIdSchema, fit: z.literal(true) }),
    z.object({ id: problemIdSchema, fit: z.literal(false), why: z.string() }),
  ]),
)

/** One bullet a line: how a list of bullets sits in a Sheet cell and in a textarea. */
export const bullets = {
  read: (cell: string) =>
    cell
      .split('\n')
      .map((line) => line.replace(/^\s*[-•*]\s*/, '').trim())
      .filter(Boolean),
  write: (items: string[]) => items.join('\n'),
}

/**
 * What a founder's browser receives: the 2-day challenge, which is the
 * problem's headline, and what is broken. No title, no open challenge, no
 * difficulty and no signal. Built by
 * naming fields, so anything added to a problem later stays on the server
 * until someone decides otherwise.
 */
export type FounderProblem = Pick<
  Problem,
  'id' | 'problem' | 'challenge' | 'industries' | 'side' | 'learn' | 'geo'
> & { expect: string[]; further: string[] }

export function forFounder(problem: Problem & { scope: Scope }): FounderProblem {
  return {
    id: problem.id,
    problem: problem.problem,
    challenge: problem.scope.task,
    expect: problem.scope.expect,
    further: problem.scope.further,
    industries: problem.industries,
    side: problem.side,
    learn: problem.learn,
    geo: problem.geo,
  }
}
