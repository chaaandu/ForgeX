/**
 * Renumbers the Problems tab to a clean P001..PNNN in sheet order, closing the
 * gaps left by the problems that were cut.
 *
 * Only safe while nobody has bet and no link has been shared: an ID is what a
 * deep link, a screenshot and the Bet log all point at. Once betting opens,
 * these are frozen.
 *
 * Writes data/id-crosswalk.csv so the old numbering stays traceable.
 *
 *   node scripts/renumber-ids.mjs            dry run
 *   node scripts/renumber-ids.mjs --apply
 */
import { readFileSync, writeFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
)

async function call(action, extra = {}) {
  const response = await fetch(env.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ secret: env.APPS_SCRIPT_SECRET, action, ...extra }),
    redirect: 'follow',
  })
  const text = await response.text()
  if (!text.trimStart().startsWith('{')) throw new Error(text.slice(0, 160))
  return JSON.parse(text)
}

const data = await call('data')
const live = data.problems

if (Object.keys(data.bets).length > 0) {
  throw new Error('Somebody has already bet. Renumbering now would break their link.')
}

const id = (n) => `P${String(n).padStart(3, '0')}`
const plan = live.map((problem, index) => ({
  from: problem.id,
  to: id(index + 1),
  title: problem.title,
}))
const moved = plan.filter((row) => row.from !== row.to)

console.log(`${live.length} problems in sheet order`)
console.log(`  ${moved.length} get a new number, ${plan.length - moved.length} stay`)
console.log(`  range becomes ${plan[0].to} to ${plan[plan.length - 1].to}, no gaps`)
console.log('\n  first few moves:')
for (const row of moved.slice(0, 6)) console.log(`    ${row.from} -> ${row.to}   ${row.title.slice(0, 44)}`)

const csv = [
  ['New ID', 'Old ID', 'Title'],
  ...plan.map((row) => [row.to, row.from, row.title]),
]
  .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  .join('\n')
writeFileSync(new URL('../data/id-crosswalk.csv', import.meta.url), `${csv}\n`)
console.log('\n  wrote data/id-crosswalk.csv')

if (!process.argv.includes('--apply')) {
  console.log('\ndry run. nothing written.')
  process.exit(0)
}

const backup = await call('backup')
console.log(`\nbacked up as "${backup.backup}"`)

// One call: rows are addressed by their current ID, which only holds while none
// of them has moved yet.
const result = await call('edit', {
  edits: moved.map((row) => ({ id: row.from, values: { ID: row.to } })),
})
console.log(`${result.applied} cells written, ${result.missing.length} rows not found`)
