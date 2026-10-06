import { z } from 'zod'

/**
 * What a founder says about themselves on Level 3. Name and photo are not
 * here: they come from Mesa and only the team can change them.
 */
const short = (max: number) => z.string().trim().max(max)

export const profileSchema = z.object({
  bio: short(120),
  city: short(60),
  languages: z.array(short(30)).max(8),
  degree: short(80),
  goodAt: z.array(short(40)).max(8),
  wantToLearn: z.array(short(40)).max(8),
  github: z.string().max(200),
  linkedin: z.string().max(200),
  portfolio: z.string().max(200),
})

export type Profile = z.infer<typeof profileSchema>

export const profilePatchSchema = profileSchema.partial()
export type ProfilePatch = z.infer<typeof profilePatchSchema>

/** Lists live in one cell, comma separated. Commas inside an item become spaces. */
export const list = {
  read: (cell: string) =>
    cell
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  write: (items: string[]) => items.map((item) => item.replace(/,/g, ' ').trim()).filter(Boolean).join(', '),
}
