/**
 * Builds data/profiles.json — what the cohort sheets already know about each
 * student — from whatever source files are sitting in data/.
 *
 *   pnpm data:profiles
 *
 * Drop the exports in data/ and run it. Nothing is fetched and no file is
 * written except data/profiles.json, so this is safe to run as often as you
 * like, and the sources stay read-only.
 *
 * ## What this deliberately does not import
 *
 * The segmentation workbook also carries staff assessment: `Segmentation`,
 * `Confidence`, `Top student`, `In priority pool`, `16 LPA readiness tier`,
 * `Biggest gap to close`, Sherpa columns, mentor notes, and a loan flag. None
 * of it is read, and `BANNED` below fails the run if a mapping ever reaches
 * for one.
 *
 * The reason is simple: everything in profiles.json is shown to the student it
 * describes, on their own profile screen. Facts they gave us and their own
 * words are theirs to see. A judgement somebody made about them is not ours to
 * hand over, and certainly not as a side effect of a hackathon sign-up.
 *
 * Bank details, phone numbers and passwords are not imported either, for the
 * ordinary reason.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import * as XLSX from 'xlsx'
import students from '../data/students.json'
/** What the cohort sheets may tell us about a founder: facts and their own words only. */
type ProfileSeed = {
  email: string
  familyBusiness: string
  familyIntent: string
  priorWork: string
  degree: string
  targetIndustry: string
  strengths: string
}

const EMPTY_SEED: Omit<ProfileSeed, 'email'> = {
  familyBusiness: '',
  familyIntent: '',
  priorWork: '',
  degree: '',
  targetIndustry: '',
  strengths: '',
}

const DATA = join(process.cwd(), 'data')
const OUT = join(DATA, 'profiles.json')
/** Sources are looked for in data/ first, then wherever they were dropped. */
const LOOK_IN = [DATA, process.cwd()]

/** A header whose presence in a mapping is a bug. Matched case-insensitively. */
const BANNED = [
  'segmentation',
  'confidence',
  'top student',
  'priority pool',
  'readiness tier',
  'biggest gap',
  'sherpa',
  'mentor note',
  'loan',
  'account',
  'ifsc',
  'bank',
  'phone',
  'mobile',
  'password',
]

/** Where each seed field comes from, by header name. First non-empty wins. */
type Mapping = Partial<Record<keyof Omit<ProfileSeed, 'email'>, string[]>>

type Source = {
  /** Matched against filenames in data/, case-insensitively. */
  match: RegExp
  /** Sheet names to try, in order. */
  sheets: string[]
  /** Header holding the student's forge email, if the sheet has one. */
  emailHeader?: string[]
  /** Header holding the student's name, used when there is no email. */
  nameHeader?: string[]
  mapping: Mapping
}

const SOURCES: Source[] = [
  {
    match: /segmentation/i,
    sheets: ['All Students'],
    emailHeader: ['Mesa Email', 'Email', 'Email ID'],
    nameHeader: ['Student', 'Student Name', 'Name'],
    mapping: {
      familyBusiness: ['Family business background detail', 'Family business (detail)'],
      familyIntent: ['Intent to join family business', 'Return intent'],
      priorWork: ['Prev work category', 'Prior work'],
      degree: ['UG Degree Category', 'UG degree'],
      targetIndustry: ['Target industry (wants to build in)', 'Target industry'],
    },
  },
  {
    match: /readiness|evidence.?book|16.?lpa/i,
    sheets: ['Student Plan'],
    nameHeader: ['Student', 'Name'],
    mapping: {
      priorWork: ['Prior work'],
      degree: ['UG degree'],
      targetIndustry: ['Target industry'],
      familyBusiness: ['Family biz background'],
      familyIntent: ['FB return intent'],
    },
  },
  {
    match: /curation|experience/i,
    sheets: ['Form Responses 1', 'Form responses 1'],
    nameHeader: ["What's your full name?", 'Full name', 'Name'],
    mapping: {
      strengths: [
        'What are your strengths and advantages as a future venture builder? Where do you think you can excel?',
        'What are your strengths and advantages as a future venture builder?',
      ],
    },
  },
]

/* --------------------------------------------------------------- the roster */

type Student = { email: string; name: string }
const roster = students as Student[]

const byEmail = new Map(roster.map((student) => [student.email.toLowerCase(), student.email]))

/** "Sinchan Rai B" and "sinchan rai" have to land on the same student. */
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
  byName.set(normalise(student.name), student.email)
  // A trailing initial is common in these sheets and is not part of the name.
  const parts = normalise(student.name).split(' ')
  if (parts.length > 2) byName.set(parts.slice(0, 2).join(' '), student.email)
}

/** The roster email for a row, or null when we cannot place it. */
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
  // A single first name is only safe when exactly one student answers to it.
  const first = parts[0]
  if (!first) return null
  const candidates = roster.filter((student) => normalise(student.name).startsWith(`${first} `))
  return candidates.length === 1 ? candidates[0]!.email : null
}

/* ----------------------------------------------------------------- reading */

type Row = Record<string, unknown>

/** Placeholders these sheets use for "we do not know". None are content. */
const BLANKS = new Set(['', '-', '--', 'na', 'n/a', 'none', 'nil', 'unknown', 'not recorded', 'tbd'])

/**
 * Fields that have to read as a sentence on a student's profile. The same
 * column name means a description in one workbook and a yes/no flag in
 * another — the readiness book's `Family biz background` is `Y`/`N`, while the
 * segmentation workbook's `Family business background detail` is "Pipes
 * manufacturing". A `Y` is true but it is not an answer, and a profile that
 * says "Family business: Y" is worse than one that says nothing, so a bare
 * flag is dropped and the student is invited to fill it in instead.
 */
const DESCRIPTIVE = new Set<keyof Omit<ProfileSeed, 'email'>>(['familyBusiness', 'strengths'])
const FLAGS = new Set(['y', 'n', 'yes', 'no', 'true', 'false', '0', '1'])

function cell(
  row: Row,
  headers: string[] | undefined,
  field?: keyof Omit<ProfileSeed, 'email'>,
): string {
  if (!headers) return ''
  for (const header of headers) {
    const value = row[header]
    if (value === undefined || value === null) continue
    const text = String(value).trim()
    const lower = text.toLowerCase()
    if (BLANKS.has(lower)) continue
    if (field && DESCRIPTIVE.has(field) && FLAGS.has(lower)) continue
    if (text) return text
  }
  return ''
}

function assertNotBanned(source: Source) {
  const used = Object.values(source.mapping)
    .flat()
    .filter((header): header is string => Boolean(header))
  for (const header of used) {
    const lower = header.toLowerCase()
    const hit = BANNED.find((banned) => lower.includes(banned))
    if (hit) {
      throw new Error(
        `mapping for ${source.match} reads "${header}", which looks like assessment or ` +
          `personal data ("${hit}"). That must not reach a student's profile.`,
      )
    }
  }
}

function filesIn(directory: string): string[] {
  return existsSync(directory) ? readdirSync(directory) : []
}

/** The first file in any of the search directories that matches. */
function findSource(match: RegExp): string | null {
  for (const directory of LOOK_IN) {
    const name = filesIn(directory).find(
      (file) => match.test(file) && /\.(xlsx|xlsm|csv)$/i.test(file),
    )
    if (name) return join(directory, name)
  }
  return null
}

/**
 * These workbooks are made to be read by people, so a sheet often opens with a
 * title and a note before the table starts. The header row is the first one
 * that actually carries a column we are looking for.
 */
function headerRowOf(sheet: XLSX.WorkSheet, wanted: string[]): number {
  const grid = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' })
  const limit = Math.min(grid.length, 12)
  for (let row = 0; row < limit; row += 1) {
    const cells = (grid[row] ?? []).map((value) => String(value).trim())
    if (wanted.some((header) => cells.includes(header))) return row
  }
  return 0
}

function main() {
  const seeds = new Map<string, ProfileSeed>()
  const unmatched: string[] = []
  let sourcesRead = 0

  for (const source of SOURCES) {
    assertNotBanned(source)

    const path = findSource(source.match)
    if (!path) {
      console.log(`· no file matching ${source.match} — skipped`)
      continue
    }
    const file = path.split('/').pop() ?? path

    const book = XLSX.read(readFileSync(path))
    const sheetName = source.sheets.find((name) => book.SheetNames.includes(name))
    if (!sheetName) {
      console.log(`· ${file}: none of [${source.sheets.join(', ')}] — skipped`)
      continue
    }

    const sheet = book.Sheets[sheetName]!
    const wanted = [
      ...(source.emailHeader ?? []),
      ...(source.nameHeader ?? []),
      ...Object.values(source.mapping)
        .flat()
        .filter((header): header is string => Boolean(header)),
    ]
    const rows = XLSX.utils.sheet_to_json<Row>(sheet, {
      defval: '',
      range: headerRowOf(sheet, wanted),
    })
    sourcesRead += 1
    let placed = 0

    for (const row of rows) {
      const email = resolve(cell(row, source.emailHeader), cell(row, source.nameHeader))
      if (!email) {
        const label = cell(row, source.nameHeader) || cell(row, source.emailHeader)
        if (label) unmatched.push(`${file}: ${label}`)
        continue
      }

      const seed = seeds.get(email) ?? { email, ...EMPTY_SEED }
      for (const [field, headers] of Object.entries(source.mapping)) {
        const key = field as keyof Omit<ProfileSeed, 'email'>
        // First source to say something wins, so SOURCES is in trust order.
        if (seed[key]) continue
        seed[key] = cell(row, headers, key)
      }
      seeds.set(email, seed)
      placed += 1
    }

    console.log(`· ${file} → ${sheetName}: ${placed} of ${rows.length} rows placed`)
  }

  if (sourcesRead === 0) {
    console.log('\nNo source files found. Put the cohort exports in data/ and run this again.')
    console.log('Expected something matching: segmentation, readiness/evidence book, curation form.')
  console.log(`Looked in: ${LOOK_IN.join(', ')}`)
    return
  }

  const out = [...seeds.values()]
    .filter((seed) => Object.values({ ...seed, email: '' }).some((value) => value !== ''))
    .sort((a, b) => a.email.localeCompare(b.email))

  writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`)

  const withFamily = out.filter((seed) => seed.familyBusiness).length
  const withStrengths = out.filter((seed) => seed.strengths).length
  console.log(`\n${out.length} of ${roster.length} students have a seed`)
  console.log(`  family business: ${withFamily}`)
  console.log(`  own words:       ${withStrengths}`)
  if (unmatched.length) {
    console.log(`\n${unmatched.length} rows could not be matched to the roster:`)
    for (const line of unmatched.slice(0, 20)) console.log(`  ${line}`)
    if (unmatched.length > 20) console.log(`  …and ${unmatched.length - 20} more`)
    console.log('Add the alias to data/students.json, or fix the name in the source.')
  }
  console.log(`\nwrote ${OUT}`)
}

main()
