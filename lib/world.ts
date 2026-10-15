import { z } from 'zod'
import { BUILD_WITH_IDS, INDUSTRY_IDS, SIDE_IDS } from './taxonomy'

/**
 * A founder's three answers before the problems. Versioned, because the
 * questions change between events and an old answer must not be read as a new
 * one: anything that is not this version reads as not answered yet.
 */
const other = z.string().trim().max(80)

export const worldSchema = z.object({
  v: z.literal(2),
  industries: z.array(z.enum([...INDUSTRY_IDS, 'other'])).min(1).max(3),
  industryOther: other.optional(),
  side: z.enum([...SIDE_IDS, 'unsure']),
  learn: z.array(z.enum(BUILD_WITH_IDS)).min(1).max(3),
})

export type World = z.infer<typeof worldSchema>
