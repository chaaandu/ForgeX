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

/** Mock only: who each demo founder is building for, and what they found. */
const DEMO_RESEARCH: { forWho: string; problem: string }[] = [
  {
    forWho: 'Kirana owners near new dark stores in Jayanagar',
    problem:
      'Regulars still drop in for milk, but the monthly list now goes to an app. The owner only notices when they stop coming.',
  },
  {
    forWho: 'Kiranas in housing societies in Wakad, Pune',
    problem:
      'Families order in the evening rush and the shop is full. The ones who cannot get through order on their phones instead.',
  },
  {
    forWho: 'Two-person kiranas in Indiranagar',
    problem:
      'The owner is at the counter all day and cannot answer the phone. Calls go unanswered, and those households try an app.',
  },
  {
    forWho: 'Kiranas that sell to students in hostels',
    problem:
      'Students want late-night snacks fast. The shop closes at 10 pm, and the apps never do.',
  },
  {
    forWho: 'Old kiranas in Mylapore with elderly regulars',
    problem:
      'Their regulars trust the shop but cannot read small app screens. Their children now order for them on apps.',
  },
  {
    forWho: 'Kiranas next to a new Zepto store in Gurugram',
    problem:
      'Prices on the app are lower on the items families compare. The owner loses the whole basket over 2 or 3 items.',
  },
  {
    forWho: 'Kiranas in small towns outside Mysuru',
    problem:
      'Dark stores have not arrived yet, but the big monthly list already goes to online sales. The owner wants to keep it.',
  },
  {
    forWho: 'Kiranas run by second-generation owners in Lucknow',
    problem:
      'The son wants to bring the shop online, the father trusts the notebook. Regulars drift while they argue.',
  },
]

/**
 * Mock mode only: eight founders who have sent their research and started
 * building, spread across the three families, so a demo has a populated
 * landing and console: ticks, a stop 1 or two, ratings, a waiting message
 * and two pods. Never written to a real Sheet.
 */
function demo(founders: Partial<Record<Header<'founders'>, string>>[]) {
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
  const research: Partial<Record<Header<'research'>, string>>[] = []
  const steps: Partial<Record<Header<'steps'>, string>>[] = []
  const submissions: Partial<Record<Header<'submissions'>, string>>[] = []
  const reviews: Partial<Record<Header<'reviews'>, string>>[] = []
  const pods: Partial<Record<Header<'pods'>, string>>[] = []
  const events: Partial<Record<Header<'events'>, string>>[] = []
  chosen.forEach((row, index) => {
    const at = new Date(Date.UTC(2026, 9, 10, 5, index * 7)).toISOString()
    const email = row.Email ?? ''
    const item = DEMO_RESEARCH[index % DEMO_RESEARCH.length]!
    Object.assign(row, { Level: '5', Number: String(index + 1), 'Last active': at })
    events.push({ At: at, Email: email, Kind: 'arrived', Data: '{}' })
    research.push({
      At: at,
      Email: email,
      Status: 'sent',
      For: item.forWho,
      Problem: item.problem,
      Doc: 'https://docs.google.com/document/d/demo-research',
      Mentor: 'yes',
    })
    const slug = (row.Slug ?? `demo-${index}`).replace(/[^a-z0-9-]/g, '')
    const repo = `https://github.com/${slug}/shop-orders`
    const live = `https://${slug}-orders.vercel.app`
    steps.push(
      { At: at, Email: email, 'Step ID': 'sketch', Done: 'yes', Value: '' },
      { At: at, Email: email, 'Step ID': 'g-card-1', Done: 'yes', Value: repo },
      { At: at, Email: email, 'Step ID': 's-repo', Done: 'yes', Value: repo },
      { At: at, Email: email, 'Step ID': 'a-repo', Done: 'yes', Value: repo },
    )
    // Half have sent stop 1; two of those are rated, one live link goes green at stop 2.
    if (index < 4) {
      submissions.push({
        'Submission ID': `S-demo-${index + 1}`,
        Email: email,
        Stop: '1',
        Status: 'sent',
        Fields: JSON.stringify({
          repo,
          live,
          firstScreen: 'The order list, because orders get lost first.',
        }),
        'Saved at': at,
      })
    }
    if (index < 2) {
      reviews.push({
        'Review ID': `R-demo-${index + 1}`,
        Email: email,
        Stop: '1',
        Rating: index === 0 ? 'green' : 'amber',
        Notes:
          index === 0 ? 'Clear flow, and it works on a phone.' : 'Good start. Two things first.',
        Fixes:
          index === 0
            ? ''
            : 'Sign-in fails on the live link\nThe order list is empty on first load',
        Author: 'team@mesaschool.co',
        At: at,
      })
    }
    if (index === 0) {
      submissions.push({
        'Submission ID': 'S-demo-live',
        Email: email,
        Stop: '2',
        Status: 'sent',
        Fields: JSON.stringify({
          live,
          signin: 'yes',
          realData: 'yes',
          does: 'Take orders and see today.',
        }),
        'Saved at': at,
      })
      reviews.push({
        'Review ID': 'R-demo-live',
        Email: email,
        Stop: '2',
        Rating: 'green',
        Notes: 'Live and working.',
        Fixes: '',
        Author: 'team@mesaschool.co',
        At: at,
      })
    }
  })
  // Two pods with members, from whichever guided founders the seed has.
  const guided = founders.filter((row) => row.Track === 'guided' && !PERSONAS.has(row.Email ?? ''))
  guided.slice(0, 6).forEach((row, index) => {
    pods.push({
      At: new Date(Date.UTC(2026, 9, 9)).toISOString(),
      Email: row.Email,
      Pod: String((index % 2) + 1),
      Role: 'member',
      'Set by': 'team@mesaschool.co',
    })
  })
  return { research, steps, submissions, reviews, pods, events }
}

/** Every tab, seeded, for mock mode. With `withDemo`, eight founders are building. */
export function seedGrids(withDemo = false): Record<TabKey, string[][]> {
  const founders = founderSeedRows()
  const problems = problemSeedRows('approved')
  const extra = withDemo
    ? demo(founders)
    : { research: [], steps: [], submissions: [], reviews: [], pods: [], events: [] }
  return {
    founders: toGrid('founders', founders),
    problems: toGrid('problems', problems),
    internal: toGrid('internal', internalSeedRows()),
    picks: toGrid('picks', []),
    responses: toGrid('responses', []),
    events: toGrid('events', extra.events),
    research: toGrid('research', extra.research),
    steps: toGrid('steps', extra.steps),
    submissions: toGrid('submissions', extra.submissions),
    reviews: toGrid('reviews', extra.reviews),
    pods: toGrid('pods', extra.pods),
  }
}

export { toGrid }
