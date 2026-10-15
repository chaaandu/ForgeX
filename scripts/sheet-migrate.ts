/**
 * One-off, safe to re-run. Brings a Sheet set up before the tracks change in
 * line with the code:
 *
 *   - Problems: the `Rarity` column becomes `Difficulty`, each row taking the
 *     difficulty data/problems.json gives that ID (or the old rarity, mapped,
 *     for a row the file does not know).
 *   - Founders: any `Track` that differs from data/students.json is corrected,
 *     and each one is printed.
 *   - Hackathon: a tab laid out before problem reviews and stages is laid out
 *     again in the new column order, every cell moving with its header. It
 *     refuses if a column that no longer exists still holds anything.
 *
 *   pnpm sheet:migrate          then pnpm sheet:init, which formats it again
 *   pnpm sheet:migrate --dry    prints what it would do, writes nothing
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { batchGet, columnLetter, sheetsMeta, structure, update } from '../lib/sheet/google'
import { TABS } from '../lib/sheet/tabs'
import { DIFFICULTY_OF_RARITY, RARITIES, type Difficulty } from '../lib/taxonomy'

const dry = process.argv.includes('--dry')

const read = <T>(file: string): T => JSON.parse(readFileSync(join(process.cwd(), 'data', file), 'utf8')) as T

async function problems() {
  const name = TABS.problems.name
  const grid = (await batchGet([name]))[name] ?? []
  const head = (grid[0] ?? []).map((cell) => cell.trim())
  const known = new Map(read<{ id: string; difficulty: Difficulty }[]>('problems.json').map((item) => [item.id, item.difficulty]))
  let col = head.indexOf('Difficulty')
  const old = head.indexOf('Rarity')
  const writes: { a1: string; values: string[][] }[] = []
  if (col < 0) {
    if (old < 0) throw new Error('Problems has neither Rarity nor Difficulty')
    col = old
    writes.push({ a1: `${columnLetter(col + 1)}1`, values: [['Difficulty']] })
  }
  const id = head.indexOf('ID')
  grid.slice(1).forEach((row, offset) => {
    const key = (row[id] ?? '').trim()
    if (!key) return
    const current = (row[col] ?? '').trim().toLowerCase()
    const rarity = RARITIES.find((value) => value === current)
    const next = known.get(key) ?? (rarity ? DIFFICULTY_OF_RARITY[rarity] : current)
    if (next && next !== current) writes.push({ a1: `${columnLetter(col + 1)}${offset + 2}`, values: [[next]] })
  })
  if (!dry)
    for (let index = 0; index < writes.length; index += 200) await update(name, writes.slice(index, index + 200))
  console.log(`· Problems: ${writes.length} cell(s) ${dry ? 'to write' : 'written'}`)
}

async function tracks() {
  const name = TABS.founders.name
  const grid = (await batchGet([name]))[name] ?? []
  const head = (grid[0] ?? []).map((cell) => cell.trim())
  const email = head.indexOf('Email')
  const track = head.indexOf('Track')
  const roster = new Map(read<{ email: string; track: string }[]>('students.json').map((item) => [item.email.toLowerCase(), item.track]))
  const writes: { a1: string; values: string[][] }[] = []
  grid.slice(1).forEach((row, offset) => {
    const who = (row[email] ?? '').trim().toLowerCase()
    const want = roster.get(who)
    if (!want || (row[track] ?? '').trim() === want) return
    console.log(`  ${who}: ${row[track] || '(blank)'} → ${want}`)
    writes.push({ a1: `${columnLetter(track + 1)}${offset + 2}`, values: [[want]] })
  })
  if (writes.length && !dry) await update(name, writes)
  console.log(`· Founders: ${writes.length} track(s) ${dry ? 'to correct' : 'corrected'}`)
}

async function hackathon() {
  const tab = TABS.hackathon
  const grid = (await batchGet([tab.name]))[tab.name] ?? []
  const head = (grid[0] ?? []).map((cell) => cell.trim())
  const want: readonly string[] = tab.headers
  if (head.length === want.length && head.every((name, index) => name === want[index])) {
    console.log('· Hackathon: already in the new layout')
    return
  }
  const rows = grid.slice(1)
  const dropped = head.filter(
    (name, index) => name && !want.includes(name) && rows.some((row) => (row[index] ?? '').trim()),
  )
  if (dropped.length)
    throw new Error(`Hackathon: these columns still hold something, move it first: ${dropped.join(', ')}`)
  const width = Math.max(head.length, want.length)
  const pad = (cells: string[]) => [...cells, ...Array<string>(width - cells.length).fill('')]
  const values = [
    pad([...want]),
    ...rows.map((row) => pad(want.map((name) => (head.includes(name) ? (row[head.indexOf(name)] ?? '') : '')))),
  ]
  console.log(`· Hackathon: ${rows.length} row(s) laid out as ${want.join(', ')}`)
  if (dry) return
  // The old dropdown may sit on a column that moves. sheet:init sets it again.
  const sheet = (await sheetsMeta()).find((item) => item.properties.title === tab.name)
  if (sheet) await structure([{ setDataValidation: { range: { sheetId: sheet.properties.sheetId, startRowIndex: 1 } } }])
  await update(tab.name, [{ a1: `A1:${columnLetter(width)}${values.length}`, values }])
}

async function main() {
  await problems()
  await tracks()
  await hackathon()
  console.log(dry ? 'Nothing written.' : 'Sheet migrated. Now run pnpm sheet:init.')
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
