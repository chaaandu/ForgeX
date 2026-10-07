import 'server-only'
import { ARCHETYPE_IDS, type ArchetypeId, type Scores } from '@/lib/archetype'
import { list, type Profile } from '@/lib/profile'
import { appendRows, rows, updateRow } from '@/lib/store'
import type { Header, Row } from '@/lib/sheet/tabs'

/**
 * Founders, as the server sees them. `track`, the Hackathon 1 outcome and the
 * H1 level are the team's and never cross to a founder; see `selfView`.
 */

/**
 * The furthest onboarding step a founder has finished. Research sent is 5,
 * and from there the plan takes over. Rows from the old bank flow may hold 5
 * or 6 without any research; `/today` checks for sent research itself, so
 * they land on the research step rather than skipping it.
 */
export const LEVELS = {
  arrived: 1,
  archetype: 2,
  profile: 3,
  challenge: 4,
  research: 5,
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
  track: string
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
  lastActive: string
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
  const source =
    (['h1', 'quiz', 'retake'] as const).find((value) => value === cells['Archetype source']) ?? ''
  return {
    row,
    email: cells.Email.trim().toLowerCase(),
    slug: cells.Slug,
    name: cells.Name,
    first: cells['First name'],
    photo: cells.Photo,
    number: Number(cells.Number) || null,
    track: cells.Track,
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
    lastActive: cells['Last active'],
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
export function levelPatch(
  founder: Founder,
  level: number,
): Partial<Record<Header<'founders'>, string>> {
  return level > founder.level ? { Level: String(level) } : {}
}

export async function appendFounder(
  cells: Partial<Record<Header<'founders'>, string>>,
): Promise<void> {
  await appendRows('founders', [cells])
}
