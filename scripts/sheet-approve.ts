/**
 * Approves every draft in the bank at once, the same as "Approve all" in the
 * console, for when the team has read the whole bank in the Sheet or in
 * docs/PROBLEMS.md. Archived (rejected) rows are left alone.
 *
 *   pnpm sheet:approve --by you@mesaschool.co           counts only, writes nothing
 *   pnpm sheet:approve --by you@mesaschool.co --write   approves
 *
 * It writes Status and logs one event naming who approved. It leaves Edited by
 * empty, because that column means a hand edit to the wording, and a row with
 * one is skipped by `pnpm sheet:sync`.
 */
import { append, batchGet, columnLetter, update } from '../lib/sheet/google'
import { TABS } from '../lib/sheet/tabs'

const write = process.argv.includes('--write')
const by = process.argv[process.argv.indexOf('--by') + 1] ?? ''

async function main() {
  if (!/@mesaschool\.co$/.test(by)) throw new Error('Say who is approving: --by name@mesaschool.co')
  const name = TABS.problems.name
  const grid = (await batchGet([name]))[name] ?? []
  const head = (grid[0] ?? []).map((cell) => cell.trim())
  const status = head.indexOf('Status')
  const id = head.indexOf('ID')
  const counts: Record<string, number> = {}
  const drafts: { row: number; id: string }[] = []
  grid.slice(1).forEach((row, offset) => {
    const value = (row[status] ?? '').trim() || '(blank)'
    counts[value] = (counts[value] ?? 0) + 1
    if (value !== 'approved' && value !== 'rejected' && (row[id] ?? '').trim()) {
      drafts.push({ row: offset + 2, id: (row[id] ?? '').trim() })
    }
  })
  console.log('· Problems by status:', counts)
  if (!write) {
    console.log(`· ${drafts.length} would be approved. Add --write to do it.`)
    return
  }
  const writes = drafts.map((draft) => ({ a1: `${columnLetter(status + 1)}${draft.row}`, values: [['approved']] }))
  for (let index = 0; index < writes.length; index += 200) await update(name, writes.slice(index, index + 200))
  if (drafts.length) {
    await append(TABS.events.name, [
      [new Date().toISOString(), by, 'bank', JSON.stringify({ approved: drafts.map((draft) => draft.id), via: 'sheet:approve' })],
    ])
  }
  console.log(`· ${drafts.length} approved by ${by}.`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
