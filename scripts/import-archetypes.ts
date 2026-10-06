/**
 * Builds data/archetypes.json from the Hackathon 1 classification and the
 * readiness book.
 *
 *   pnpm data:archetypes
 *
 * Two sources, joined on the forge email and falling back to the name:
 *
 *   Hackathon_Types_Archetypes.csv   archetype, the three axis scores, margin,
 *                                    technical readiness, trait tags, level
 *   Mesa_Forge_..._Evidence_Book     the five skill levels, and which outcome
 *                                    they are actually heading for
 *
 * A student with no row in the first source gets no archetype, because they
 * were not in Hackathon 1. The app gives them the trial instead, which is the
 * same seven questions scored the same way, so the two paths end in the same
 * place.
 *
 * ## What is not imported
 *
 * The same privacy line as data/profiles.json, for the same reason. Nothing
 * from the readiness book's assessment columns — segment, confidence, top
 * student, loan, readiness tier, the gap columns, Sherpa or mentor notes.
 *
 * `level` is the one borderline call and it is deliberate: it comes from the
 * source's internal tier, it is used to pitch problems at the right
 * difficulty, and it is shown to the student as a level. What is never shown,
 * and never leaves the server, is which mentor group that tier maps to.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import * as XLSX from 'xlsx'
import students from '../data/students.json'

const DATA = join(process.cwd(), 'data')
const OUT = join(DATA, 'archetypes.json')

type Student = { email: string; name: string }
const roster = students as Student[]
const byEmail = new Map(roster.map((s) => [s.email.toLowerCase(), s.email]))

function normalise(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .join(' ')
}

const byName = new Map<string, string>()
for (const student of roster) {
  const key = normalise(student.name)
  byName.set(key, student.email)
  const parts = key.split(' ')
  if (parts.length > 2) byName.set(parts.slice(0, 2).join(' '), student.email)
}

function resolve(email: string, name: string): string | null {
  const direct = byEmail.get(email.trim().toLowerCase())
  if (direct) return direct
  const key = normalise(name)
  if (!key) return null
  const exact = byName.get(key)
  if (exact) return exact
  const parts = key.split(' ')
  if (parts.length > 2) {
    const short = byName.get(parts.slice(0, 2).join(' '))
    if (short) return short
  }
  const first = parts[0]
  if (!first) return null
  const hits = roster.filter((s) => normalise(s.name).startsWith(`${first} `))
  return hits.length === 1 ? hits[0]!.email : null
}

function findFile(match: RegExp): string | null {
  for (const directory of [DATA, process.cwd()]) {
    if (!existsSync(directory)) continue
    const name = readdirSync(directory).find(
      (file) => match.test(file) && /\.(csv|xlsx|xlsm)$/i.test(file),
    )
    if (name) return join(directory, name)
  }
  return null
}

function sheetRows(path: string, wanted: string[], headerHints: string[]) {
  const raw = /\.csv$/i.test(path)
    ? XLSX.read(readFileSync(path, 'utf8'), { type: 'string' })
    : XLSX.read(readFileSync(path))
  const name = wanted.find((candidate) => raw.SheetNames.includes(candidate)) ?? raw.SheetNames[0]!
  const sheet = raw.Sheets[name]!
  // These workbooks open with a title and a note, so the header row is the
  // first one that carries a column we actually want.
  const grid = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' })
  let header = 0
  for (let row = 0; row < Math.min(grid.length, 12); row += 1) {
    const cells = (grid[row] ?? []).map((value) => String(value).trim())
    if (headerHints.some((hint) => cells.includes(hint))) {
      header = row
      break
    }
  }
  return {
    name,
    rows: XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', range: header }),
  }
}

const text = (row: Record<string, unknown>, key: string): string => String(row[key] ?? '').trim()
const num = (row: Record<string, unknown>, key: string): number => Number(row[key]) || 0

/** T1/T2/T3 to a 1-3 level. The letter never leaves this script. */
function levelOf(tier: string): number {
  const match = /([123])/.exec(tier)
  return match ? Number(match[1]) : 0
}

export type ArchetypeRecord = {
  email: string
  archetype: string
  axes: { u: number; e: number; s: number }
  margin: number
  technical: number
  tags: string[]
  /** 1 to 3. Pitches difficulty; shown as a level, never as a group. */
  level: number
  /** Five skills, 1 to 5 each. Empty when the readiness book had no row. */
  skills: Record<string, number>
  /** "Venture", "Role", "Family business"… */
  outcome: string
  fallback: string
  /** Whether this came from Hackathon 1 or from sitting the trial in the app. */
  source: 'hackathon-1'
}

function main() {
  const records = new Map<string, ArchetypeRecord>()
  const unmatched: string[] = []

  const typesPath = findFile(/hackathon.?types|archetype/i)
  if (!typesPath) {
    console.log('· no archetype export found (looked for "Hackathon Types" or "archetype")')
    console.log('  Nothing written. Students will all be offered the trial instead.')
    return
  }

  const { rows } = sheetRows(typesPath, ['Responses', 'Final'], ['Archetype', 'Internal tier'])
  let placed = 0
  for (const row of rows) {
    const archetype = text(row, 'Archetype').toLowerCase()
    if (!archetype) continue
    // The source carries staff rows too, and they are not students here.
    if (text(row, 'Role') !== 'Student') continue

    const email = resolve(text(row, 'Email'), text(row, 'Name'))
    if (!email) {
      unmatched.push(`${text(row, 'Name')} <${text(row, 'Email')}>`)
      continue
    }

    records.set(email, {
      email,
      archetype,
      axes: {
        u: num(row, 'Understands first'),
        e: num(row, 'Experiments first'),
        s: num(row, 'Structures first'),
      },
      margin: num(row, 'Margin'),
      technical: num(row, 'Technical readiness'),
      tags: text(row, 'Tags')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      level: levelOf(text(row, 'Internal tier')),
      skills: {},
      outcome: '',
      fallback: '',
      source: 'hackathon-1',
    })
    placed += 1
  }
  console.log(`· ${typesPath.split('/').pop()}: ${placed} students classified`)

  // The readiness book adds the five skills and where they are heading.
  const bookPath = findFile(/readiness|evidence.?book|16.?lpa/i)
  if (bookPath) {
    const { rows: plan } = sheetRows(bookPath, ['Student Plan'], ['Student', 'FRS: Data'])
    let joined = 0
    for (const row of plan) {
      const email = resolve(text(row, 'Email'), text(row, 'Student'))
      if (!email) continue
      const record = records.get(email)
      if (!record) continue
      record.skills = {
        problem: num(row, 'FRS: Problem solving'),
        communication: num(row, 'FRS: Communication'),
        tech: num(row, 'FRS: Tech & AI'),
        marketing: num(row, 'FRS: Marketing'),
        data: num(row, 'FRS: Data'),
      }
      record.outcome = text(row, 'Primary outcome')
      record.fallback = text(row, 'Fallback outcome')
      joined += 1
    }
    console.log(`· ${bookPath.split('/').pop()}: skills and outcome joined for ${joined}`)
  } else {
    console.log('· no readiness book found — skills and outcome left empty')
  }

  const out = [...records.values()].sort((a, b) => a.email.localeCompare(b.email))
  writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`)

  const counts: Record<string, number> = {}
  for (const record of out) counts[record.archetype] = (counts[record.archetype] ?? 0) + 1

  console.log(`\n${out.length} of ${roster.length} students have an archetype`)
  for (const [name, count] of Object.entries(counts)) console.log(`  ${name.padEnd(14)} ${count}`)
  console.log(`  ${roster.length - out.length} will sit the trial in the app`)
  if (unmatched.length) {
    console.log(`\n${unmatched.length} rows did not match the roster:`)
    for (const line of unmatched.slice(0, 10)) console.log(`  ${line}`)
  }
  console.log(`\nwrote ${OUT}`)
}

main()
