/**
 * Copies every founder's GitHub, LinkedIn and portfolio from the Founders tab
 * to the Profiles tab, on cells that differ. The site keeps them in step from
 * then on; run this once after the tab is made, or to bring it back in line.
 *
 *   pnpm sheet:profiles          writes
 *   pnpm sheet:profiles --dry    prints what it would write
 */
import { batchGet, columnLetter, update } from '../lib/sheet/google'
import { TABS } from '../lib/sheet/tabs'

const dry = process.argv.includes('--dry')
const FIELDS = ['GitHub', 'LinkedIn', 'Portfolio'] as const

async function main() {
  const grids = await batchGet([TABS.founders.name, TABS.profiles.name])
  const read = (name: string) => {
    const grid = grids[name] ?? []
    const head = (grid[0] ?? []).map((cell) => cell.trim())
    return { rows: grid.slice(1), col: (header: string) => head.indexOf(header) }
  }
  const founders = read(TABS.founders.name)
  const profiles = read(TABS.profiles.name)
  const links = new Map(
    founders.rows.map((row) => [
      (row[founders.col('Email')] ?? '').trim().toLowerCase(),
      Object.fromEntries(FIELDS.map((field) => [field, (row[founders.col(field)] ?? '').trim()])),
    ]),
  )
  const writes: { a1: string; values: string[][] }[] = []
  profiles.rows.forEach((row, offset) => {
    const want = links.get((row[profiles.col('Email')] ?? '').trim().toLowerCase())
    if (!want) return
    for (const field of FIELDS) {
      const column = profiles.col(field)
      if (column < 0 || (row[column] ?? '').trim() === want[field]) continue
      writes.push({ a1: `${columnLetter(column + 1)}${offset + 2}`, values: [[want[field] ?? '']] })
    }
  })
  const filled = (field: string) => [...links.values()].filter((item) => item[field]).length
  console.log(
    `· ${writes.length} cell(s) ${dry ? 'to write' : 'written'} · GitHub ${filled('GitHub')}, LinkedIn ${filled('LinkedIn')} of ${links.size}`,
  )
  if (dry) return
  for (let index = 0; index < writes.length; index += 200)
    await update(TABS.profiles.name, writes.slice(index, index + 200))
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
