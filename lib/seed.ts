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
const DEMO_RESEARCH: { forWho: string; problem: string; moment: string }[] = [
  {
    forWho: 'Home bakers who take cake orders on WhatsApp',
    problem:
      'Orders arrive on WhatsApp, Instagram and calls. Each baker writes them on paper and checks the paper the night before.',
    moment: "Saturday night, when Sunday's orders are spread across 3 apps",
  },
  {
    forWho: 'Water-can suppliers delivering to apartment blocks',
    problem:
      'Each supplier tracks cans and monthly dues in a notebook. Empty cans go missing, and dues are argued over at month end.',
    moment: 'The 1st of the month, collecting payments door to door',
  },
  {
    forWho: 'Tiffin services with monthly subscribers',
    problem:
      'Subscribers skip meals by WhatsApp message. The cook finds out at the door, and refunds are worked out from memory.',
    moment: 'Lunch packing at 11 am, with 3 skips nobody saw',
  },
  {
    forWho: 'Kirana stores that sell on credit',
    problem:
      'Regulars buy on credit written in a notebook. The owner forgets who owes what, and customers dispute the total.',
    moment: 'When a regular asks how much they owe, and nobody is sure',
  },
  {
    forWho: 'Florists taking wedding and event orders',
    problem:
      'Big orders come by phone with advance payments. Details change by WhatsApp, and the final order lives in 3 places.',
    moment: 'The morning of an event, when the order changed overnight',
  },
  {
    forWho: 'Pharmacies with regular monthly customers',
    problem:
      'Regulars refill the same medicines each month. The pharmacist remembers some of them and runs out of stock for the rest.',
    moment: 'A regular arrives for a refill that is out of stock',
  },
  {
    forWho: 'Printing shops handling college orders',
    problem:
      'Students send files and changes on WhatsApp. Jobs get printed from the wrong version, and payment is chased later.',
    moment: 'Exam week, with 40 jobs in the queue and 3 versions of each',
  },
  {
    forWho: 'Hardware stores supplying local contractors',
    problem:
      'Contractors order by phone and pay at the end of a job. The owner keeps a running tab in a ledger nobody else can read.',
    moment: 'A contractor disputes a bill 2 months later',
  },
]

const DEMO_APPS = JSON.stringify([
  { name: 'Khatabook', note: 'Owners I asked use it for credit, but not for orders.' },
  { name: 'WhatsApp Business', note: 'Orders arrive here, but nothing turns them into a list.' },
  { name: 'A paper notebook', note: 'Still the record everyone trusts, and nobody can search.' },
])

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
  const messages: Partial<Record<Header<'messages'>, string>>[] = []
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
      Moment: item.moment,
      Apps: DEMO_APPS,
      Conversations: '[]',
      Reading: '',
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
    if (index === 3 || index === 5) {
      messages.push({
        'Message ID': `M-demo-${index}`,
        Founder: email,
        From: email,
        'Step ID': 'g-card-3',
        Text: 'Vercel says the build failed. I checked the keys twice.',
        Screenshot: '',
        At: new Date(Date.now() - (index + 1) * 3600_000).toISOString(),
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
  return { research, steps, submissions, reviews, messages, pods, events }
}

/** Every tab, seeded, for mock mode. With `withDemo`, eight founders are building. */
export function seedGrids(withDemo = false): Record<TabKey, string[][]> {
  const founders = founderSeedRows()
  const problems = problemSeedRows('approved')
  const extra = withDemo
    ? demo(founders)
    : { research: [], steps: [], submissions: [], reviews: [], messages: [], pods: [], events: [] }
  return {
    founders: toGrid('founders', founders),
    problems: toGrid('problems', problems),
    internal: toGrid('internal', internalSeedRows()),
    picks: toGrid('picks', []),
    responses: toGrid('responses', []),
    events: toGrid('events', extra.events),
    research: toGrid('research', extra.research),
    steps: toGrid('steps', extra.steps),
    messages: toGrid('messages', extra.messages),
    submissions: toGrid('submissions', extra.submissions),
    reviews: toGrid('reviews', extra.reviews),
    pods: toGrid('pods', extra.pods),
  }
}

export { toGrid }
