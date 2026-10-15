import { z } from 'zod'

/**
 * Each founder's group, their POC at Mesa and who reviews their problem, from
 * the team's workbook (`pnpm data:groups`). The Hackathon tab is the record
 * once it is filled; this file only fills it, and gives mock mode real names.
 */
export const groupSchema = z.object({
  email: z.string().email(),
  group: z.string(),
  poc: z.string(),
  reviewer: z.string(),
})
export const groupsSchema = z.array(groupSchema)
export type Group = z.infer<typeof groupSchema>
