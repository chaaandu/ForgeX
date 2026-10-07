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
  // And four more still waiting on the team, so the queue has something in it.
  const taken = new Set(chosen.map((row) => row.Email))
  const waiting = founders
    .filter((row) => row.Archetype && !taken.has(row.Email) && !PERSONAS.has(row.Email ?? ''))
    .slice(0, DEMO_WAITING.length)
  waiting.forEach((row, index) => {
    const demo = DEMO_WAITING[index]!
    const at = new Date(Date.now() - (index + 1) * 5 * 3600_000).toISOString()
    const pickId = `K-wait-${index + 1}`
    Object.assign(row, {
      Level: '6',
      Number: String(chosen.length + index + 1),
      World: JSON.stringify(demo.world),
      'Pick ID': pickId,
      Status: 'waiting',
      'Last active': at,
    })
    events.push({ At: at, Email: row.Email, Kind: 'arrived', Data: '{}' })
    picks.push({
      'Pick ID': pickId,
      Email: row.Email,
      'Problem ID': demo.problemId ?? '',
      ...(demo.custom
        ? {
            'Custom title': demo.custom.title,
            'Custom problem': demo.custom.problem,
            'Custom challenge': demo.custom.challenge,
            'Custom industry': demo.custom.industry,
            'Custom side': demo.custom.side,
          }
        : {}),
      'Why problem': demo.why[0],
      'Why user': demo.why[1],
      'Why pay': demo.why[2],
      Contact: demo.contact,
      'Submitted at': at,
    })
  })
  return { picks, responses, events }
}

/** Mock only: whys waiting for a reply, one of them a problem the founder wrote. */
const DEMO_WAITING: {
  problemId?: string
  custom?: { title: string; problem: string; challenge: string; industry: string; side: string }
  world: object
  why: [string, string, string]
  contact: string
}[] = [
  {
    problemId: 'P045',
    world: { v: 1, industries: ['retail', 'food'], side: 'business', access: [{ kind: 'family', worlds: ['retail'] }], learn: ['data', 'payments'], intent: 'company', comfort: 3 },
    why: [
      'My father runs a kirana in Nagpur and two shops on our street shut last year. He says the quick-commerce apps took the regulars who used to buy on credit.',
      'Owners like him, who know every customer by name but cannot match the apps on price or delivery time.',
      'He already pays for a billing app and a delivery boy. Keeping ten regulars a month is worth far more than a small fee.',
    ],
    contact: 'My father and the two owners next to his shop, this weekend.',
  },
  {
    problemId: 'P012',
    world: { v: 1, industries: ['agri'], side: 'creator', access: [{ kind: 'relatives', worlds: ['agri'] }], learn: ['vision', 'mobile'], intent: 'both', comfort: 2 },
    why: [
      'My uncle lost most of a soybean crop to seed that never came up. The packet looked exactly like the real brand.',
      'Small farmers who buy from the nearest agro shop and have no way to check a packet before they sow it.',
      'One failed sowing costs a season. A farmer would pay a little per packet, or the honest dealers would pay to prove they are honest.',
    ],
    contact: 'My uncle and three farmers in his village, on a call this week.',
  },
  {
    problemId: 'P101',
    world: { v: 1, industries: ['creators'], side: 'creator', access: [{ kind: 'community', worlds: ['creators'] }], learn: ['agents', 'web'], intent: 'career', comfort: 4 },
    why: [
      'I write a food blog and my search traffic halved this year, though the posts did not change.',
      'Small writers who earn from their blogs and now get found less, even when what they write is better.',
      'They already pay for hosting and SEO tools that no longer work, so they would pay for something that does.',
    ],
    contact: 'Five writers from a bloggers group I am in.',
  },
  {
    custom: {
      title: 'Hostel food complaints that go nowhere',
      problem: 'Students in private hostels complain about the mess every week, in WhatsApp groups and to the warden. Nothing is written down, so the same problems come back each month and the owner never sees a pattern.',
      challenge: 'Help a hostel owner see what students keep complaining about, and fix it.',
      industry: 'food',
      side: 'business',
    },
    world: { v: 1, industries: ['food', 'homes'], side: 'business', access: [{ kind: 'other', other: 'My hostel', worlds: ['food'] }], learn: ['automation', 'data'], intent: 'exploring', comfort: 3 },
    why: [
      'I have lived in two hostels and the same complaints about the mess came up every single week in our group.',
      'Hostel owners, who lose students at the end of each term and do not know why.',
      'An owner with 200 beds loses lakhs when 10 students leave. A small monthly fee to keep them is easy to justify.',
    ],
    contact: 'The owner of my hostel and 20 students in our WhatsApp group.',
  },
]

/** Every tab, seeded, for mock mode. With `withDemo`, eight founders have a go and four are waiting. */
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
