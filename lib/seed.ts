import 'server-only'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import archetypeRows from '@/data/archetypes.json'
import profileRows from '@/data/profiles.json'
import { archetypeOf } from '@/lib/archetype'
import { bullets, problemInternalSchema, problemSchema, scopeFileSchema } from '@/lib/problem'
import { TABS, type Header, type TabKey } from '@/lib/sheet/tabs'
import { assignSlugs } from '@/lib/slug'
import { groupsSchema, type Group } from '@/lib/groups'
import { EVENT_WORDS, STATUS_WORDS } from '@/lib/status-words'
import { cohort } from '@/lib/students'

/**
 * What a new Sheet starts with. `pnpm sheet:init` writes this to Google, and
 * mock mode holds it in memory, so the two can never drift apart.
 *
 * Founders get one row each, in a fixed order, carrying what we already know:
 * name, photo, the Hackathon 1 result and their degree. Problems come
 * from the research pipeline's output, each with its 2-day version beside it.
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

/** The 2-day version of each problem that has one, as the three cells that hold it. */
export function scopeSeedCells(): Map<string, { Task: string; Expect: string; Further: string }> {
  const out = new Map<string, { Task: string; Expect: string; Further: string }>()
  for (const item of scopeFileSchema.parse(readData('problems.scope.json'))) {
    if (!item.fit) continue
    out.set(item.id, {
      Task: item.task,
      Expect: bullets.write(item.expect),
      Further: bullets.write(item.further),
    })
  }
  return out
}

/**
 * Problems as rows. Live they start as drafts until approved; mock opens them
 * all. A problem with no 2-day version starts archived either way: it is kept
 * for its evidence, and never offered.
 */
export function problemSeedRows(
  status: 'draft' | 'approved',
): Partial<Record<Header<'problems'>, string>>[] {
  const scopes = scopeSeedCells()
  return readData('problems.json').map((raw) => {
    const problem = problemSchema.parse(raw)
    return {
      ID: problem.id,
      Status: scopes.has(problem.id) ? status : 'rejected',
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
      ...(scopes.get(problem.id) ?? {}),
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

/** Each founder's group, reviewer and POC, from the team's workbook (`pnpm data:groups`). */
export function groupOf(): Map<string, Group> {
  return new Map(groupsSchema.parse(readData('groups.json')).map((item) => [item.email, item]))
}

/** One row a founder in the Hackathon tab, not started: what a new Sheet begins with. */
export function hackathonSeedRows(): Partial<Record<Header<'hackathon'>, string>>[] {
  const groups = groupOf()
  return founderSeedRows().map((founder) => {
    const group = groups.get((founder.Email ?? '').toLowerCase())
    return {
      Name: founder.Name,
      Email: founder.Email,
      Group: group?.group ?? '',
      Reviewer: group?.reviewer ?? '',
      POC: group?.poc ?? '',
      Status: STATUS_WORDS.none,
      Progress: '0%',
    }
  })
}

type HistoryRow = Partial<Record<Header<'history'>, string>>

/** A made-up but plausible own problem for the demo, numbered so each one reads differently. */
function demoProblem(index: number) {
  const places = ['Pune', 'Jaipur', 'Indore', 'Kochi', 'Nagpur', 'Surat', 'Mysuru', 'Bhopal']
  const place = places[index % places.length] ?? 'Pune'
  return {
    Industry: 'Retail',
    Title: `Weekend markets in ${place} lose their regulars`,
    Person: `Stall owners at the weekend market in ${place}, who sell the same goods every Saturday.`,
    Problem:
      'Regulars cannot tell where a stall will be next week, so sales depend on luck and the weather.',
    Promise: 'Their regulars always know where to find them, and keep coming back.',
    'Why you': `I grew up in ${place} and my aunt runs a stall at the Sunday market there.`,
    Plan: 'Spoke to 6 stall owners and 10 shoppers. Next, a page where a stall posts its next market.',
    'Primary research': `https://drive.google.com/drive/folders/demo-interviews-${index}`,
    'Secondary research': `https://docs.google.com/document/d/demo-reading-${index}`,
  }
}

/** One row a founder in the Profiles tab, with the links their profile already has. */
export function profilesSeedRows(): Partial<Record<Header<'profiles'>, string>>[] {
  const groups = groupOf()
  return founderSeedRows().map((founder) => ({
    Name: founder.Name,
    Email: founder.Email,
    Group: groups.get((founder.Email ?? '').toLowerCase())?.group ?? '',
    GitHub: founder.GitHub ?? '',
    LinkedIn: founder.LinkedIn ?? '',
    Portfolio: founder.Portfolio ?? '',
  }))
}

/** One row a founder in the Submissions tab, empty until they hand something in. */
export function submissionsSeedRows(): Partial<Record<Header<'submissions'>, string>>[] {
  return hackathonSeedRows().map((row) => ({ Name: row.Name, Email: row.Email, Group: row.Group }))
}

/**
 * Mock mode only: a cohort part-way through the hackathon, so a demo has a
 * populated landing and console, and every state can be seen. Of the founders
 * who already have an archetype, 10 in each reviewer's group have done
 * something, one in each of these states:
 *
 *   0   approved, and every stage submitted
 *   1   approved, up to the launch
 *   2   approved, up to the prototype
 *   3   approved, no MVP scope yet
 *   4   approved with changes, MVP scope in
 *   5   waiting for review
 *   6   rejected once, sent again, waiting
 *   7   rejected
 *   8   picked from the bank, with research, MVP scope and prototype
 *   9   picked from the bank, nothing yet
 *
 * Never written to a real Sheet.
 */
function demo(
  founders: Partial<Record<Header<'founders'>, string>>[],
  hackathon: Partial<Record<Header<'hackathon'>, string>>[],
  problems: Partial<Record<Header<'problems'>, string>>[],
) {
  const open = problems.filter((row) => row.Expect)
  const rowOf = new Map(hackathon.map((row) => [row.Email, row]))
  // Taken in turn from each reviewer's group, so every reviewer has some of each state.
  const reviewerOf = new Map(hackathon.map((row) => [row.Email, row.Reviewer ?? '']))
  const pool = founders.filter((row) => row.Archetype && !PERSONAS.has(row.Email ?? ''))
  const byReviewer = [...new Set(pool.map((row) => reviewerOf.get(row.Email) ?? ''))].map((name) =>
    pool.filter((row) => (reviewerOf.get(row.Email) ?? '') === name),
  )
  const chosen = Array.from({ length: 10 * byReviewer.length }, (_, index) => {
    const group = byReviewer[index % byReviewer.length] ?? []
    return group[Math.floor(index / byReviewer.length)]
  }).filter((row): row is (typeof pool)[number] => Boolean(row))
  const events: Partial<Record<Header<'events'>, string>>[] = []
  const history: HistoryRow[] = []
  const minute = (day: number, at: number) =>
    `2026-10-${String(day).padStart(2, '0')} ${String(9 + Math.floor(at / 60)).padStart(2, '0')}:${String(at % 60).padStart(2, '0')}`

  chosen.forEach((row, index) => {
    const entry = rowOf.get(row.Email)
    if (!entry) return
    const handle = (row.Slug ?? `founder-${index}`).replace(/[^a-z0-9-]/g, '')
    // Which of the 10 states this founder shows; each reviewer gets one of each.
    const slot = Math.floor(index / Math.max(1, byReviewer.length))
    const bank = slot >= 8
    Object.assign(row, {
      Level: slot === 0 ? '6' : '5',
      Number: String(index + 1),
      'Last active': new Date(Date.UTC(2026, 9, 17, 6, index * 7)).toISOString(),
      ...(bank
        ? {
            World: JSON.stringify({
              v: 2,
              industries: ['retail', 'food'],
              side: 'business',
              learn: ['agents', 'web'],
            }),
          }
        : {}),
    })
    events.push({
      At: new Date(Date.UTC(2026, 9, 15, 13, index)).toISOString(),
      Email: row.Email,
      Kind: 'arrived',
      Data: '{}',
    })

    if (bank) {
      const problem = open[(index * 11) % open.length]
      Object.assign(entry, {
        Problem: problem?.Task ?? '',
        'Problem no.': problem?.ID ?? '',
        Status: STATUS_WORDS.bank,
        Progress: '10%',
        ...(slot === 8
          ? {
              'Primary research': `https://drive.google.com/drive/folders/demo-bank-${index}`,
              'Secondary research': `https://docs.google.com/document/d/demo-bank-${index}`,
              'MVP scope': `https://docs.google.com/document/d/demo-scope-${index}`,
              'Scope at': '2026-10-21 18:10',
              GitHub: `https://github.com/${handle}/hackathon`,
              Prototype: `https://${handle}.vercel.app`,
              'Proof of progress': `https://drive.google.com/drive/folders/demo-proof-${index}`,
              'Prototype at': '2026-10-22 11:40',
              Status: STATUS_WORDS.prototype,
              Progress: '55%',
            }
          : {}),
      })
      return
    }

    const base = { Name: row.Name, Email: row.Email }
    const sent = (version: number, day: number, at: number, extra: Partial<HistoryRow> = {}) =>
      history.push({
        ...base,
        Time: minute(day, at),
        Version: String(version),
        Event: EVENT_WORDS.submitted,
        By: row.Name,
        ...demoProblem(index),
        ...extra,
      })
    const answer = (version: number, day: number, at: number, event: string, notes: string) =>
      history.push({
        ...base,
        Time: minute(day, at),
        Version: String(version),
        Event: event,
        By: entry.Reviewer,
        Notes: notes,
      })

    const ownTitle = demoProblem(index).Title
    if (slot === 6) {
      sent(1, 16, 30)
      answer(
        1,
        16,
        200,
        EVENT_WORDS.rejected,
        'This is a solution, not a problem yet. Talk to 5 stall owners first and bring what they said.',
      )
      sent(2, 18, 60, {
        Title: `${ownTitle}, again`,
        Plan: 'Spoke to 6 stall owners since. Notes are in the folder.',
      })
    } else {
      sent(1, 16, index * 9)
    }
    const word =
      slot <= 3
        ? EVENT_WORDS.approved
        : slot === 4
          ? EVENT_WORDS.changes
          : slot === 7
            ? EVENT_WORDS.rejected
            : ''
    if (word)
      answer(
        1,
        17,
        index * 11,
        word,
        word === EVENT_WORDS.approved
          ? ''
          : word === EVENT_WORDS.changes
            ? 'Good problem. Narrow it to one market, and interview 3 regulars before you build.'
            : 'Too broad, and the research is one article. Pick one person and talk to them.',
      )

    const state =
      slot <= 3 ? 'approved' : slot === 4 ? 'changes' : slot === 7 ? 'rejected' : 'waiting'
    Object.assign(entry, {
      Problem: slot === 6 ? `${ownTitle}, again` : ownTitle,
      'Primary research': demoProblem(index)['Primary research'],
      'Secondary research': demoProblem(index)['Secondary research'],
      Status: STATUS_WORDS[state],
      Progress: state === 'approved' || state === 'changes' ? '20%' : '10%',
    })
    // The MVP scope is in for everyone building past it, and for the one approved with changes.
    if (slot <= 2 || slot === 4) {
      Object.assign(entry, {
        'MVP scope': `https://docs.google.com/document/d/demo-scope-${index}`,
        'Scope at': `2026-10-21 ${String(15 + (index % 5)).padStart(2, '0')}:30`,
        Status: STATUS_WORDS.scope,
        Progress: '30%',
      })
    }
    if (slot <= 2) {
      Object.assign(entry, {
        GitHub: `https://github.com/${handle}/hackathon`,
        Prototype: `https://${handle}.vercel.app`,
        'Proof of progress': `https://drive.google.com/drive/folders/demo-proof-${index}`,
        'Prototype at': `2026-10-22 ${String(10 + (index % 3)).padStart(2, '0')}:15`,
        Status: STATUS_WORDS.prototype,
        Progress: '55%',
      })
    }
    if (slot <= 1) {
      Object.assign(entry, {
        'LinkedIn post': `https://www.linkedin.com/posts/${handle}_forgex-activity-71${index}`,
        'Live link': `https://${handle}.vercel.app`,
        Documentation: `https://docs.google.com/document/d/demo-docs-${index}`,
        'Launch at': '2026-10-22 19:20',
        Status: STATUS_WORDS.launch,
        Progress: '80%',
      })
    }
    if (slot === 0) {
      Object.assign(entry, {
        'Pitch deck': `https://docs.google.com/presentation/d/demo${index}/edit`,
        Loom: `https://www.loom.com/share/demo${index}`,
        'Pitch at': '2026-10-23 11:05',
        Status: STATUS_WORDS.pitch,
        Progress: '100%',
      })
    }
  })
  return { events, history }
}

/** Every tab, seeded, for mock mode. With `withDemo`, part of the cohort is already building. */
export function seedGrids(withDemo = false): Record<TabKey, string[][]> {
  const founders = founderSeedRows()
  const problems = problemSeedRows('approved')
  const hackathon = hackathonSeedRows()
  const extra = withDemo ? demo(founders, hackathon, problems) : { events: [], history: [] }
  return {
    founders: toGrid('founders', founders),
    problems: toGrid('problems', problems),
    internal: toGrid('internal', internalSeedRows()),
    hackathon: toGrid('hackathon', hackathon),
    // The demo writes every cell on one object; each tab keeps its own columns.
    submissions: toGrid(
      'submissions',
      hackathon as Partial<Record<Header<'submissions'>, string>>[],
    ),
    profiles: toGrid('profiles', profilesSeedRows()),
    history: toGrid('history', extra.history),
    events: toGrid('events', extra.events),
  }
}

export { toGrid }
