import { z } from 'zod'
import { ACCESS_IDS, INDUSTRY_IDS, INTENT_IDS, LEARN_IDS, SIDE_IDS } from './taxonomy'

/**
 * A founder's Level 4 answers. Versioned, because the questions will change
 * between cohorts and an old answer must still parse as what it meant then.
 */
const other = z.string().trim().max(80)

export const accessSchema = z.object({
  kind: z.enum([...ACCESS_IDS, 'other']),
  other: other.optional(),
  /** The worlds that person is in. `elsewhere` carries free text. */
  worlds: z.array(z.enum([...INDUSTRY_IDS, 'elsewhere'])).max(3),
  elsewhere: other.optional(),
})

export const worldSchema = z.object({
  v: z.literal(1),
  industries: z.array(z.enum([...INDUSTRY_IDS, 'other'])).min(1).max(3),
  industryOther: other.optional(),
  side: z.enum([...SIDE_IDS, 'unsure']),
  access: z.array(accessSchema).max(6),
  learn: z.array(z.enum([...LEARN_IDS, 'other'])).min(1).max(3),
  learnOther: other.optional(),
  intent: z.enum(INTENT_IDS),
  comfort: z.number().int().min(1).max(5),
})

export type World = z.infer<typeof worldSchema>
export type Access = z.infer<typeof accessSchema>
