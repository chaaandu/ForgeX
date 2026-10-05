import { z } from 'zod'
import { TAGS } from './types'

export const toolKitSchema = z.object({
  kit: z.string(),
  tools: z.string(),
})

export const problemSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  tag: z.enum(TAGS),
  cluster: z.string(),
  region: z.string(),
  problem: z.string(),
  who: z.string(),
  whyItMatters: z.string(),
  challenge: z.string(),
  northStar: z.string(),
  directions: z.array(z.string()),
  constraints: z.string(),
  buildExpectation: z.string(),
  tools: z.array(toolKitSchema),
  mechanic: z.string().default(''),
})

export const problemsSchema = z.array(problemSchema)

export const betSchema = z.object({
  name: z.string(),
  photo: z.string(),
  at: z.string(),
  email: z.string().optional(),
})

export const betMapSchema = z.record(z.string(), betSchema)

/** `action: "data"` response from Apps Script. */
/** How many problems each email has picked, and how many changes are allowed. */
export const picksSchema = z.record(z.string(), z.number())

export const dataResponseSchema = z.object({
  ok: z.literal(true),
  problems: problemsSchema,
  bets: betMapSchema,
  picks: picksSchema.optional(),
  maxChanges: z.number().optional(),
})

/** `action: "bet"` and `action: "release"` responses. */
export const writeResponseSchema = z.object({
  ok: z.literal(true),
  bets: betMapSchema.optional(),
  picks: picksSchema.optional(),
  maxChanges: z.number().optional(),
})

export const errorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
  by: z.string().optional(),
})

export const sheetResponseSchema = z.union([
  dataResponseSchema,
  writeResponseSchema,
  errorResponseSchema,
])

/** What `GET /api/bets` returns to the browser. */
export const betsRouteSchema = z.object({
  bets: betMapSchema,
  closed: z.boolean(),
  degraded: z.boolean(),
  /** Changes this viewer has left. Null for the team, who never bet. */
  changesLeft: z.number().nullable(),
})

export type BetsRoute = z.infer<typeof betsRouteSchema>

/** Server action results. */
export const actionResultSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), bets: betMapSchema, changesLeft: z.number().optional() }),
  z.object({
    ok: z.literal(false),
    error: z.enum([
      'taken',
      'closed',
      'locked',
      'not_found',
      'forbidden',
      'unreachable',
      'unknown',
    ]),
    by: z.string().optional(),
  }),
])

export type ActionResult = z.infer<typeof actionResultSchema>

export const problemIdSchema = z
  .string()
  .trim()
  .regex(/^P\d{3,4}$/, 'bad problem id')
