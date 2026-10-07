import 'server-only'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import archetypeRows from '@/data/archetypes.json'
import profileRows from '@/data/profiles.json'
import { ARCHETYPES, archetypeOf, type ArchetypeId } from '@/lib/archetype'
import { problemInternalSchema, problemSchema } from '@/lib/problem'
import { TABS, type Header, type TabKey } from '@/lib/sheet/tabs'
import { assignSlugs } from '@/lib/slug'
import { cohort } from '@/lib/students'

/**
 * What a new Sheet starts with. `pnpm sheet:init` writes this to Google, and
 * mock mode holds it in memory, so the two can never drift apart.
 *
 * Founders get one row each, in a fixed order, carrying what we already know:
 * name, photo, track, the Hackathon 1 result and their degree. Problems come
 * from the research pipeline's output.
 */

/** The bank is read from disk rather than bundled: it is large and only seeds. */
function readData(name: string): unknown[] {
  return JSON.parse(readFileSync(join(process.cwd(), 'data', name), 'utf8')) as unknown[]
}

type H1 = {
  email: string
  archetype: string
  axes: { u: number; e: number; s: number }
  level: number
  outcome: string
}

type Seed = { email: string; degree: string; priorWork: string }

export function founderSeedRows(): Partial<Record<Header<'founders'>, string>>[] {
  const slugs = assignSlugs(cohort)
  const h1 = new Map((archetypeRows as H1[]).map((row) => [row.email, row]))
  const seed = new Map((profileRows as Seed[]).map((row) => [row.email, row]))
  return [...cohort]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((student) => {
      const past = h1.get(student.email)
      const profile = seed.get(student.email)
      return {
        Email: student.email,
        Slug: slugs.get(student.email) ?? '',
        Name: student.name,
        'First name': student.firstName,
        Photo: student.photo ?? '',
        Track: student.track,
        Wall: 'yes',
        Level: '0',
        Archetype: past ? archetypeOf(past.axes) : '',
        'Archetype source': past ? 'h1' : '',
        Axes: past ? JSON.stringify(past.axes) : '',
        'Retakes used': '0',
        'H1 archetype': past?.archetype ?? '',
        'H1 outcome': past?.outcome ?? '',
        'H1 level': past ? String(past.level) : '',
        'Prior work': profile?.priorWork ?? '',
        Degree: profile?.degree ?? '',
      }
    })
}

/** Problems as rows. Live they start as drafts until approved; mock opens them all. */
export function problemSeedRows(
  status: 'draft' | 'approved',
): Partial<Record<Header<'problems'>, string>>[] {
  return readData('problems.json').map((raw) => {
    const problem = problemSchema.parse(raw)
    return {
      ID: problem.id,
      Status: status,
      Title: problem.title,
      Problem: problem.problem,
      Challenge: problem.challenge,
      Difficulty: problem.difficulty,
      Industries: problem.industries.join(', '),
      Side: problem.side,
      Learn: problem.learn.join(', '),
      Geo: problem.geo,
      'Signal count': String(problem.signal.count),
      'Signal strength': String(problem.signal.strength),
      'Signal line': problem.signal.line,
    }
  })
}

export function internalSeedRows(): Partial<Record<Header<'internal'>, string>>[] {
  return readData('problems.internal.json').map((raw) => {
    const item = problemInternalSchema.parse(raw)
    return {
      ID: item.id,
      Evidence: JSON.stringify(item.evidence),
      Sources: JSON.stringify(item.sources),
      'Why now': item.whyNow,
      Players: JSON.stringify(item.players),
      Scores: JSON.stringify(item.scores),
      Total: String(item.total),
    }
  })
}

function toGrid<K extends TabKey>(key: K, rows: Partial<Record<Header<K>, string>>[]): string[][] {
  const head = [...TABS[key].headers] as string[]
  return [
    head,
    ...rows.map((cells) => head.map((name) => (cells as Record<string, string>)[name] ?? '')),
  ]
}

/** The mock sign-in personas start clean, so every flow can still be walked from the top. */
const PERSONAS = new Set([
  'aarav_shrivastava@forge27.mesaschool.co',
  'diya_agrawal@forge27.mesaschool.co',
  'aadishwar_r@forge27.mesaschool.co',
])

const DEMO_WHY = {
  'Why problem':
    'I have watched this happen up close, and nobody I asked had a way around it that did not cost them hours every week.',
  'Why user':
    'The people stuck with it today, because they already lose time and money to it and have told me so.',
  'Why pay':
    'They already pay for worse workarounds, so a fix that saves them a few hours a week is worth a monthly fee.',
}

/**
 * Mock mode only: eight founders who have already walked the whole way and
 * been told go, spread across the three families, so a demo has a populated
 * landing and console. Never written to a real Sheet.
 */
function demo(founders: Partial<Record<Header<'founders'>, string>>[], problemIds: string[]) {
  const perFamily = new Map<string, number>()
  const chosen = founders
    .filter((row) => {
      const archetype = row.Archetype as ArchetypeId | ''
      if (!archetype || PERSONAS.has(row.Email ?? '')) return false
      const family = ARCHETYPES[archetype].family
      const taken = perFamily.get(family) ?? 0
      if (taken >= 3) return false
      perFamily.set(family, taken + 1)
      return true
    })
    .slice(0, 8)
  const picks: Partial<Record<Header<'picks'>, string>>[] = []
  const responses: Partial<Record<Header<'responses'>, string>>[] = []
  const events: Partial<Record<Header<'events'>, string>>[] = []
  chosen.forEach((row, index) => {
    const at = new Date(Date.UTC(2026, 9, 6, 5, index * 7)).toISOString()
    const pickId = `K-demo-${index + 1}`
    const type = index % 3 === 2 ? 'tweak' : 'go'
    Object.assign(row, {
      Level: '6',
      Number: String(index + 1),
      'Pick ID': pickId,
      Status: type,
      'Last active': at,
    })
    events.push({ At: at, Email: row.Email, Kind: 'arrived', Data: '{}' })
    picks.push({
      'Pick ID': pickId,
      Email: row.Email,
      'Problem ID': problemIds[(index * 29) % problemIds.length],
      ...DEMO_WHY,
      'Submitted at': at,
    })
    responses.push({
      'Response ID': `R-demo-${index + 1}`,
      'Pick ID': pickId,
      Author: 'team@mesaschool.co',
      Type: type,
      Note: type === 'tweak' ? 'Narrow it to one city before you build anything.' : '',
      'Sent at': at,
    })
  })
  return { picks, responses, events }
}

/** Every tab, seeded, for mock mode. With `withDemo`, eight founders already have a go. */
export function seedGrids(withDemo = false): Record<TabKey, string[][]> {
  const founders = founderSeedRows()
  const problems = problemSeedRows('approved')
  const extra = withDemo
    ? demo(
        founders,
        problems.map((row) => row.ID ?? ''),
      )
    : { picks: [], responses: [], events: [] }
  return {
    founders: toGrid('founders', founders),
    problems: toGrid('problems', problems),
    internal: toGrid('internal', internalSeedRows()),
    picks: toGrid('picks', extra.picks),
    responses: toGrid('responses', extra.responses),
    events: toGrid('events', extra.events),
  }
}

export { toGrid }
