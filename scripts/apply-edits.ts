/**
 * Applies data/edits-*.json to the live Sheet through the Apps Script.
 *
 *   pnpm edits:check    validate and show what would change, writes nothing
 *   pnpm edits:apply    back the tab up, then write
 *
 * Nothing is ever deleted. A problem is taken off the board by setting its
 * Status to "cut"; the row and all its text stay in the Sheet.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { z } from 'zod'
import problemsJson from '../data/problems.json'
import type { Problem } from '../lib/types'

const MECHANICS = [
  'Document reconciliation',
  'WhatsApp workflow',
  'Compliance mapper',
  'Voice agent',
  'Risk ranking',
  'Evidence pack',
  'Marketplace or directory',
  'Practice coach',
  'Public records research',
  'Visual search',
  'Pricing or payback model',
  'Scheduling or routing',
  'Agent safety and testing',
  'Field data capture',
] as const

const editSchema = z.object({
  id: z.string().regex(/^P\d{3}$/),
  status: z.enum(['keep', 'cut']),
  mechanic: z.enum(MECHANICS),
  northStar: z.string().min(10).nullable().optional(),
  buildExpectation: z.string().min(10).nullable().optional(),
  problem: z.string().min(20).nullable().optional(),
  constraints: z.string().min(10).nullable().optional(),
  note: z.string(),
})

type Edit = z.infer<typeof editSchema>

/** Sheet header for each editable field. */
const COLUMN: Record<string, string> = {
  northStar: 'North star metric',
  buildExpectation: 'Build expectation',
  problem: 'Problem',
  constraints: 'Constraints',
}

function env(): Record<string, string> {
  return Object.fromEntries(
    readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
      .split('\n')
      .filter((line) => line.includes('='))
      .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
  )
}

async function call(action: string, payload: Record<string, unknown> = {}) {
  const { APPS_SCRIPT_URL, APPS_SCRIPT_SECRET } = env()
  if (!APPS_SCRIPT_URL || !APPS_SCRIPT_SECRET) throw new Error('No Apps Script credentials')
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ secret: APPS_SCRIPT_SECRET, action, ...payload }),
    redirect: 'follow',
  })
  const text = await response.text()
  if (!text.trimStart().startsWith('{')) {
    throw new Error(`Apps Script did not answer with JSON. First 160 chars: ${text.slice(0, 160)}`)
  }
  return JSON.parse(text) as Record<string, unknown>
}

function load(): Edit[] {
  const dir = resolve(process.cwd(), 'data')
  const files = readdirSync(dir).filter((name) => /^edits-\d+\.json$/.test(name)).sort()
  if (!files.length) throw new Error('No data/edits-*.json files found')

  const seen = new Set<string>()
  const edits: Edit[] = []
  for (const file of files) {
    const parsed = z.array(editSchema).parse(JSON.parse(readFileSync(resolve(dir, file), 'utf8')))
    for (const edit of parsed) {
      if (seen.has(edit.id)) throw new Error(`${edit.id} appears in more than one edits file`)
      seen.add(edit.id)
      edits.push(edit)
    }
    console.log(`  ${file}: ${parsed.length} edits`)
  }
  return edits.sort((a, b) => a.id.localeCompare(b.id))
}

function main() {
  const problems = problemsJson as Problem[]
  const byId = new Map(problems.map((problem) => [problem.id, problem]))

  console.log('reading edits')
  const edits = load()

  const unknown = edits.filter((edit) => !byId.has(edit.id)).map((edit) => edit.id)
  if (unknown.length) throw new Error(`Unknown problem ids: ${unknown.join(', ')}`)

  const cut = edits.filter((edit) => edit.status === 'cut')
  const keep = edits.filter((edit) => edit.status === 'keep')
  const missing = problems.filter((problem) => !edits.some((edit) => edit.id === problem.id))

  const fieldCounts: Record<string, number> = {}
  for (const edit of edits) {
    for (const key of Object.keys(COLUMN)) {
      if (edit[key as keyof Edit]) fieldCounts[key] = (fieldCounts[key] ?? 0) + 1
    }
  }

  const byMechanic: Record<string, number> = {}
  for (const edit of keep) byMechanic[edit.mechanic] = (byMechanic[edit.mechanic] ?? 0) + 1

  console.log(`\n${edits.length} edits covering ${problems.length} problems`)
  console.log(`  keep ${keep.length}, cut ${cut.length}, untouched ${missing.length}`)
  console.log(`  rewrites: ${JSON.stringify(fieldCounts)}`)
  console.log('\n  build types on the board after the cut:')
  for (const [mechanic, count] of Object.entries(byMechanic).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(count).padStart(3)}  ${mechanic}`)
  }

  // A report the owner can read next to the Sheet.
  const rows = [
    ['ID', 'Title', 'Status', 'Mechanic', 'Old north star', 'New north star', 'Note'],
    ...edits.map((edit) => [
      edit.id,
      byId.get(edit.id)?.title ?? '',
      edit.status,
      edit.mechanic,
      byId.get(edit.id)?.northStar ?? '',
      edit.northStar ?? '',
      edit.note,
    ]),
  ]
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  writeFileSync(resolve(process.cwd(), 'data/edit-report.csv'), `${csv}\n`)
  console.log('\n  wrote data/edit-report.csv')

  if (!process.argv.includes('--apply')) {
    console.log('\ndry run. nothing written. re-run with --apply to write to the Sheet.')
    return
  }

  void write(edits)
}

async function write(edits: Edit[]) {
  console.log('\nbacking up the Problems tab')
  const backup = await call('backup')
  if (!backup.ok) throw new Error(`Backup failed: ${JSON.stringify(backup)}`)
  console.log(`  copy saved as "${String(backup.backup)}" (hidden tab)`)

  const payload = edits.map((edit) => {
    const values: Record<string, string> = {
      Status: edit.status,
      Mechanic: edit.mechanic,
    }
    for (const [key, header] of Object.entries(COLUMN)) {
      const value = edit[key as keyof Edit]
      if (typeof value === 'string' && value.length) values[header] = value
    }
    return { id: edit.id, values }
  })

  const BATCH = 40
  let applied = 0
  for (let at = 0; at < payload.length; at += BATCH) {
    const slice = payload.slice(at, at + BATCH)
    const result = await call('edit', { edits: slice })
    if (!result.ok) throw new Error(`Batch at ${at} failed: ${JSON.stringify(result)}`)
    applied += Number(result.applied ?? 0)
    console.log(`  ${Math.min(at + BATCH, payload.length)}/${payload.length} rows`)
  }
  console.log(`\n${applied} cells written.`)
}

main()
