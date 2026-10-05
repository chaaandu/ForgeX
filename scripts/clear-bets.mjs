/**
 * Clears every Bet by cell, freeing all problems.
 *
 * This does not reset how many changes students have used: that is counted from
 * the Bet log. To reset those too, rename the "Bet log" tab in the Sheet; the
 * script creates a fresh empty one on the next call and the old one stays as
 * the record of what happened.
 *
 *   node scripts/clear-bets.mjs            dry run
 *   node scripts/clear-bets.mjs --apply
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
const held = Object.entries(data.bets ?? {})

console.log(`${held.length} problems are held right now`)
for (const [id, bet] of held) console.log(`  ${id}  ${bet.name}  ${bet.email ?? ''}  ${bet.at ?? ''}`)

// Keep the record outside the Sheet as well, before anything is cleared.
const rows = [
  ['Problem ID', 'Title', 'Name', 'Email', 'Bet at'],
  ...held.map(([id, bet]) => [
    id,
    data.problems.find((p) => p.id === id)?.title ?? '',
    bet.name,
    bet.email ?? '',
    bet.at ?? '',
  ]),
]
const csv = rows
  .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  .join('\n')
writeFileSync(new URL('../data/bets-before-reset.csv', import.meta.url), `${csv}\n`)
console.log('\nwrote data/bets-before-reset.csv')

if (!process.argv.includes('--apply')) {
  console.log('\ndry run. nothing cleared.')
  process.exit(0)
}

const backup = await call('backup')
console.log(`\nbacked up the Problems tab as "${backup.backup}"`)

const result = await call('edit', {
  edits: held.map(([id]) => ({ id, values: { 'Bet by': '' } })),
})
console.log(`${result.applied} cells cleared`)

const after = await call('data')
console.log(`problems held now: ${Object.keys(after.bets ?? {}).length}`)
