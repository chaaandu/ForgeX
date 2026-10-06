/**
 * Checks `lib/archetype.ts` against the people it was derived from.
 *
 *   pnpm test:archetype
 *
 * The trial exists so a student who was not in Hackathon 1 can be placed the
 * same way the cohort was. That claim is only worth anything while the scoring
 * in the app still reproduces the scoring in the source, so this re-derives
 * every classified student's axis scores and class from their stored answers
 * and fails loudly on the first one that does not match.
 *
 * Needs the Hackathon Types export in data/. Skips with a note if it is absent,
 * because the source files are deliberately not committed.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as XLSX from 'xlsx'
import { AXES, TRIAL, classify, keyForSource, marginOf, scoreTrial, type Scores } from '../lib/archetype'

/** The export, as a workbook or a csv, in data/ or wherever it was dropped. */
function findSource(): string | null {
  for (const directory of [join(process.cwd(), 'data'), process.cwd()]) {
    if (!existsSync(directory)) continue
    const name = readdirSync(directory).find(
      (file) => /hackathon.?types|archetype/i.test(file) && /\.(csv|xlsx|xlsm)$/i.test(file),
    )
    if (name) return join(directory, name)
  }
  return null
}

/** Source column per axis. */
const AXIS_COLUMN = {
  u: 'Understands first',
  e: 'Experiments first',
  s: 'Structures first',
} as const

/**
 * The source column each trial question came from. The wording drifts between
 * the two sheets it lives in, so match on a fragment rather than the whole.
 */
const QUESTION_SOURCE: Record<string, string> = {
  'new-city': 'three days in a city',
  'new-tool': 'learned a new app',
  'first-prompt': 'big, messy task',
  'in-a-team': 'team of four',
  'bad-instructions': 'step-by-step instructions',
  'it-broke': 'worked yesterday',
  'better-way': 'better way',
}

type Row = Record<string, string>

function main() {
  const source = findSource()
  if (!source) {
    console.log('· no Hackathon Types export in data/, so there is nothing to check against.')
    console.log('  That file is gitignored on purpose. Put it back to re-run this.')
    return
  }

  const book = /\.csv$/i.test(source)
    ? XLSX.read(readFileSync(source, 'utf8'), { type: 'string' })
    : XLSX.read(readFileSync(source))
  const sheetName = book.SheetNames.find((name) => name === 'Responses') ?? book.SheetNames[0]!
  const sheet = book.Sheets[sheetName]!
  const rows = XLSX.utils.sheet_to_json<Row>(sheet, { defval: '' }).filter((row) => row.Archetype)

  const headers = Object.keys(rows[0] ?? {})
  const columnFor = new Map<string, string>()
  for (const [id, fragment] of Object.entries(QUESTION_SOURCE)) {
    const header = headers.find((name) => name.includes(fragment))
    if (!header) throw new Error(`no source column matching "${fragment}" for question ${id}`)
    columnFor.set(id, header)
  }

  let axesOk = 0
  let classOk = 0
  let marginOk = 0
  const failures: string[] = []

  for (const row of rows) {
    const answers: Record<string, string> = {}
    for (const question of TRIAL) {
      answers[question.id] =
        keyForSource(question.id, String(row[columnFor.get(question.id)!] ?? '')) ?? ''
    }

    const scores = scoreTrial(answers)
    const expected: Scores = {
      u: Number(row[AXIS_COLUMN.u]) || 0,
      e: Number(row[AXIS_COLUMN.e]) || 0,
      s: Number(row[AXIS_COLUMN.s]) || 0,
    }

    const sameAxes = AXES.every((axis) => scores[axis] === expected[axis])
    const sameClass = classify(scores) === row.Archetype
    if (sameAxes) axesOk += 1
    if (sameClass) classOk += 1
    if (marginOf(scores) === Number(row.Margin)) marginOk += 1

    if (!sameAxes || !sameClass) {
      failures.push(
        `${row.Name}: got ${AXES.map((a) => `${a}${scores[a]}`).join('/')} ` +
          `${classify(scores)}, source says ${AXES.map((a) => `${a}${expected[a]}`).join('/')} ` +
          `${row.Archetype}`,
      )
    }
  }

  const total = rows.length
  console.log(`axis scores  ${axesOk}/${total}`)
  console.log(`archetype    ${classOk}/${total}`)
  console.log(`margin       ${marginOk}/${total}`)

  if (failures.length) {
    console.error(`\n${failures.length} did not reproduce:`)
    for (const line of failures.slice(0, 10)) console.error(`  ${line}`)
    console.error('\nlib/archetype.ts no longer matches the cohort it was derived from.')
    process.exit(1)
  }

  console.log('\nThe trial places people exactly the way Hackathon 1 did.')
}

main()
