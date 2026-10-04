/**
 * Converts columns A to N of the Problems tab into a typed data/problems.json.
 * That file feeds mock mode and is the fallback when Apps Script can't be reached.
 *
 *   pnpm import
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as XLSX from 'xlsx'
import { PROBLEM_HEADERS, toProblem } from '../lib/parse'
import { problemsSchema } from '../lib/schema'

const SOURCE = resolve(process.cwd(), 'data/ForgeX_2.0_Problem_Bank.xlsx')
const TARGET = resolve(process.cwd(), 'data/problems.json')
const SHEET = 'Problems'

function main() {
  const book = XLSX.read(readFileSync(SOURCE), { type: 'buffer' })
  const sheet = book.Sheets[SHEET]
  if (!sheet) throw new Error(`No "${SHEET}" tab in ${SOURCE}`)

  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: '',
    raw: false,
  })

  const headers = Object.keys(rows[0] ?? {})
  const missing = PROBLEM_HEADERS.filter((header) => !headers.includes(header))
  if (missing.length) throw new Error(`Missing headers: ${missing.join(', ')}`)

  const problems = rows.map(toProblem).filter((problem) => problem !== null)

  const ids = new Set(problems.map((problem) => problem.id))
  if (ids.size !== problems.length) throw new Error('Duplicate problem IDs in the Problems tab')

  const parsed = problemsSchema.parse(problems)
  writeFileSync(TARGET, `${JSON.stringify(parsed, null, 2)}\n`)

  const byTag = parsed.reduce<Record<string, number>>((acc, problem) => {
    acc[problem.tag] = (acc[problem.tag] ?? 0) + 1
    return acc
  }, {})
  console.log(`${parsed.length} problems to data/problems.json`)
  console.log(`  tags     ${JSON.stringify(byTag)}`)
  console.log(`  clusters ${new Set(parsed.map((p) => p.cluster)).size}`)
  console.log(`  regions  ${new Set(parsed.map((p) => p.region)).size}`)
}

main()
