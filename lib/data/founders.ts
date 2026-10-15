import 'server-only'
import { ARCHETYPE_IDS, type ArchetypeId, type Scores } from '@/lib/archetype'
import { list, type Profile } from '@/lib/profile'
import { appendRows, rows, updateRow } from '@/lib/store'
import type { Header, Row } from '@/lib/sheet/tabs'
import { worldSchema, type World } from '@/lib/world'

/**
 * Founders, as the server sees them. The Hackathon 1 outcome and the H1 level
 * are the team's and never cross to a founder.
 */

export const LEVELS = {
  arrived: 1,
  archetype: 2,
  profile: 3,
  world: 4,
  picked: 5,
  sent: 6,
} as const

export type ArchetypeSource = 'h1' | 'quiz' | 'retake' | ''

export type Founder = {
  row: number
  email: string
  slug: string
  name: string
  first: string
  photo: string
  number: number | null
  wall: boolean
  level: number
  archetype: ArchetypeId | null
  archetypeSource: ArchetypeSource
  axes: Scores | null
  retakesUsed: number
  h1Archetype: string
  h1Outcome: string
  h1Level: string
  priorWork: string
  profile: Profile
  world: World | null
  lastActive: string
  /** The team has let this founder send or change their build after the hard stop. */
  reopened: boolean
}

function parseJson<T>(cell: string, guard: (value: unknown) => T | null): T | null {
  if (!cell) return null
  try {
    return guard(JSON.parse(cell))
  } catch {
    return null
  }
}

function toFounder({ row, cells }: Row<'founders'>): Founder {
  const archetype = ARCHETYPE_IDS.find((id) => id === cells.Archetype) ?? null
  const source = (['h1', 'quiz', 'retake'] as const).find((value) => value === cells['Archetype source']) ?? ''
  return {
    row,
    email: cells.Email.trim().toLowerCase(),
    slug: cells.Slug,
    name: cells.Name,
    first: cells['First name'],
    photo: cells.Photo,
    number: Number(cells.Number) || null,
    wall: cells.Wall !== 'no',
    level: Number(cells.Level) || 0,
    archetype,
    archetypeSource: source,
    axes: parseJson(cells.Axes, (value) => {
      const axes = value as Partial<Scores>
      return typeof axes?.u === 'number' && typeof axes.e === 'number' && typeof axes.s === 'number'
        ? { u: axes.u, e: axes.e, s: axes.s }
        : null
    }),
    retakesUsed: Number(cells['Retakes used']) || 0,
    h1Archetype: cells['H1 archetype'],
    h1Outcome: cells['H1 outcome'],
    h1Level: cells['H1 level'],
    priorWork: cells['Prior work'],
    profile: {
      bio: cells.Bio,
      city: cells.City,
      languages: list.read(cells.Languages),
      degree: cells.Degree,
      goodAt: list.read(cells['Good at']),
      wantToLearn: list.read(cells['Want to learn']),
      github: cells.GitHub,
      linkedin: cells.LinkedIn,
      portfolio: cells.Portfolio,
    },
    world: parseJson(cells.World, (value) => {
      const parsed = worldSchema.safeParse(value)
      return parsed.success ? parsed.data : null
    }),
    lastActive: cells['Last active'],
    reopened: cells.Reopened.trim().toLowerCase() === 'yes',
  }
}

export async function allFounders(): Promise<Founder[]> {
  return (await rows('founders')).map(toFounder)
}

export async function founderByEmail(email: string): Promise<Founder | null> {
  const key = email.trim().toLowerCase()
  return (await allFounders()).find((founder) => founder.email === key) ?? null
}

export async function founderBySlug(slug: string): Promise<Founder | null> {
  return (await allFounders()).find((founder) => founder.slug === slug) ?? null
}

export function cohortSize(founders: Founder[]): number {
  return founders.length
}

/** Writes some of a founder's cells and stamps the time. */
export async function patchFounder(
  founder: Founder,
  patch: Partial<Record<Header<'founders'>, string>>,
): Promise<void> {
  const now = new Date().toISOString()
  await updateRow('founders', founder.row, { ...patch, 'Updated at': now, 'Last active': now })
}

/** Moves the furthest level forward, never back. */
export function levelPatch(founder: Founder, level: number): Partial<Record<Header<'founders'>, string>> {
  return level > founder.level ? { Level: String(level) } : {}
}

export async function appendFounder(cells: Partial<Record<Header<'founders'>, string>>): Promise<void> {
  await appendRows('founders', [cells])
}
