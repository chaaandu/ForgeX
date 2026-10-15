/**
 * Builds data/groups.json from the Mentor groups tab of the hackathon
 * workbook: each founder's group, their POC at Mesa, and who reviews their
 * problem (the PS evaluator). The Mentor and Pitch evaluator columns are not
 * read.
 *
 *   pnpm data:groups "/path/to/AI Hackathon 2.xlsx"
 *
 * Then `pnpm sheet:groups` writes them into the Hackathon tab, on empty cells.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as XLSX from 'xlsx'
import { groupsSchema, type Group } from '../lib/groups'
import { REVIEWERS } from '../lib/staff'
import { cohort } from '../lib/students'

const SOURCE = process.argv[2]
const TAB = 'Mentor groups'
const TARGET = resolve(process.cwd(), 'data/groups.json')

/** The same corrections the roster needed, confirmed by the owner on 2026-10-06. */
const EMAIL_FIXES: Record<string, string> = {
  'aditya_peyet@forge28.mesaschool.co': 'aditya_peter@forge27.mesaschool.co',
  'madymaheshwari12@gmail.com': 'madhuresh_binzani@forge27.mesaschool.co',
}


if (!SOURCE) {
  console.error('Usage: pnpm data:groups "/path/to/AI Hackathon 2.xlsx"')
  process.exit(1)
}

const book = XLSX.read(readFileSync(SOURCE))
const sheet = book.Sheets[TAB]
if (!sheet) throw new Error(`No "${TAB}" tab in ${SOURCE}`)
const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
const cell = (row: Record<string, unknown>, key: string) => String(row[key] ?? '').trim()

const reviewerOf = (raw: string): string => {
  const key = raw.toLowerCase()
  const name = REVIEWERS.find((item) => item.name.toLowerCase() === key)?.name
  if (!name) throw new Error(`Unknown reviewer "${raw}". Add them to lib/staff.ts first.`)
  return name
}

const known = new Set(cohort.map((student) => student.email))
const groups: Group[] = []
const problems: string[] = []
for (const row of rows) {
  const raw = cell(row, 'Email').toLowerCase()
  if (!raw) continue
  const email = EMAIL_FIXES[raw] ?? raw
  if (!known.has(email)) {
    problems.push(`${cell(row, 'Student name')} <${raw}> is not in the cohort`)
    continue
  }
  groups.push({
    email,
    group: cell(row, 'Group'),
    poc: cell(row, 'Mesa POC'),
    reviewer: reviewerOf(cell(row, 'PS evaluator')),
  })
}
const missing = cohort.filter((student) => !groups.some((item) => item.email === student.email))
for (const student of missing) problems.push(`${student.name} <${student.email}> has no group`)

groups.sort((a, b) => a.email.localeCompare(b.email))
writeFileSync(TARGET, `${JSON.stringify(groupsSchema.parse(groups), null, 2)}\n`)
console.log(`${groups.length} founders written to data/groups.json`)
if (problems.length) console.log(`Check these:\n  ${problems.join('\n  ')}`)
