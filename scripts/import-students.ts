/**
 * Builds data/students.json and public/students/*.webp from the roster sheet
 * and the-117-c1 portrait repo.
 *
 * The app only ever needs this to put a face on a stamp when Google hands us an
 * account with no profile photo, and to drive mock mode's sign-in picker.
 *
 *   pnpm data:students
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as XLSX from 'xlsx'
import { STUDENT_DOMAIN } from '../lib/roles'
import { studentsSchema, type Student } from '../lib/students'

const ROSTER = resolve(process.cwd(), 'data/Emails.xlsx')
const FOUNDERS = resolve(process.cwd(), 'data/the-117-c1')
const PHOTO_OUT = resolve(process.cwd(), 'public/students')
const TARGET = resolve(process.cwd(), 'data/students.json')

/** The roster sheet holds three name/email column pairs side by side. */
const TRACKS = [
  { name: 'A', email: 'B', track: 'autonomous' },
  { name: 'D', email: 'E', track: 'structured' },
  { name: 'G', email: 'H', track: 'guided' },
] as const

/** Portrait slugs that no name or email rule can reach. */
const SLUG_ALIASES: Record<string, string> = {
  ajitesh_senthilkumar: 'ajitwsh-s',
  praval_goud: 'praval-goud-madduri',
}

/**
 * Corrections to the roster workbook, confirmed by the owner on 2026-10-06.
 * The workbook carries a typo and a personal address for these two.
 */
const EMAIL_FIXES: Record<string, string> = {
  'aditya_peyet@forge28.mesaschool.co': 'aditya_peter@forge27.mesaschool.co',
  'madymaheshwari12@gmail.com': 'madhuresh_binzani@forge27.mesaschool.co',
}

/** Names the workbook got wrong. One row carries an email address where the name should be. */
const NAME_FIXES: Record<string, string> = {
  'ujjwal_sitlani@forge27.mesaschool.co': 'Ujjwal Sitlani',
}

/** Track corrections from the owner's lists (6 Oct), where the workbook is out of date. */
const TRACK_FIXES: Record<string, string> = {
  'tanishq_lomte@forge27.mesaschool.co': 'autonomous',
}

type Founder = { slug: string; name: string; photo: string }

const letters = (value: string) => value.toLowerCase().replace(/[^a-z]/g, '')

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(
      /(^|[\s'-])(\p{L})/gu,
      (_match, lead: string, char: string) => lead + char.toUpperCase(),
    )
}

/** First token worth greeting somebody by, so `K NAVEEN` gives `Naveen`. */
function firstNameOf(name: string): string {
  const tokens = name.split(/\s+/).filter(Boolean)
  const pick = tokens.find((token) => letters(token).length > 1) ?? tokens[0] ?? name
  return titleCase(pick)
}

function readRoster() {
  const book = XLSX.read(readFileSync(ROSTER), { type: 'buffer' })
  const sheet = book.Sheets[book.SheetNames[0] ?? '']
  if (!sheet) throw new Error('No sheet in the roster workbook')
  const cell = (ref: string) => (sheet[ref]?.w ?? sheet[ref]?.v ?? '').toString().trim()

  const out: { name: string; email: string; track: string }[] = []
  for (const column of TRACKS) {
    for (let row = 2; row < 500; row += 1) {
      const name = cell(`${column.name}${row}`)
      const raw = cell(`${column.email}${row}`).toLowerCase()
      const email = EMAIL_FIXES[raw] ?? raw
      if (!name || !email.includes('@')) continue
      out.push({
        name: NAME_FIXES[email] ?? name,
        email,
        track: TRACK_FIXES[email] ?? column.track,
      })
    }
  }
  return out
}

function main() {
  const roster = readRoster()
  const founders: Founder[] = JSON.parse(readFileSync(resolve(FOUNDERS, 'founders.json'), 'utf8'))
  const bySlug = new Map(founders.map((founder) => [founder.slug, founder]))
  const byName = new Map(founders.map((founder) => [letters(founder.name), founder]))

  mkdirSync(PHOTO_OUT, { recursive: true })

  const claimed = new Set<string>()
  const warnings: string[] = []
  const students: Student[] = []

  for (const person of roster) {
    const local = person.email.split('@')[0] ?? ''
    const tokens = person.name.split(/\s+/).filter(Boolean)
    const candidates = [
      SLUG_ALIASES[local],
      local.replace(/_/g, '-'),
      letters(person.name),
      tokens.length > 1 ? letters(`${tokens[0]}${tokens[tokens.length - 1]}`) : '',
      local.split('_')[0],
    ].filter((value): value is string => Boolean(value))

    let match: Founder | undefined
    for (const candidate of candidates) {
      const hit = bySlug.get(candidate) ?? byName.get(candidate)
      if (hit && !claimed.has(hit.slug)) {
        match = hit
        break
      }
    }

    let photo: string | null = null
    if (match) {
      claimed.add(match.slug)
      const source = resolve(FOUNDERS, match.photo)
      if (existsSync(source)) {
        copyFileSync(source, resolve(PHOTO_OUT, `${match.slug}.webp`))
        photo = `/students/${match.slug}.webp`
      }
    } else {
      warnings.push(`no portrait for ${person.name} <${person.email}>`)
    }

    if (!person.email.endsWith(STUDENT_DOMAIN)) {
      warnings.push(`${person.email} is outside ${STUDENT_DOMAIN} and cannot sign in`)
    }

    students.push({
      email: person.email,
      name: titleCase(person.name),
      firstName: firstNameOf(person.name),
      photo,
      track: person.track,
    })
  }

  students.sort((a, b) => a.name.localeCompare(b.name))
  const parsed = studentsSchema.parse(students)
  writeFileSync(TARGET, `${JSON.stringify(parsed, null, 2)}\n`)

  console.log(`${parsed.length} students to data/students.json`)
  console.log(`  portraits ${parsed.filter((s) => s.photo).length} copied to public/students`)
  for (const warning of warnings) console.log(`  ! ${warning}`)
}

main()
