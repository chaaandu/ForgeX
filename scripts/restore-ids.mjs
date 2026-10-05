/**
 * Puts every problem back on the ID it had before the parked rows were deleted
 * and the ID column was re-sequenced, so a problem keeps its identity and the
 * gaps fall where problems were cut.
 *
 * Matching is by title, which is unique across all 212 originals. The whole
 * batch goes in one call: addressing rows by their current ID only works while
 * no ID has moved yet, so a second call would read a half-renumbered sheet.
 *
 *   node scripts/restore-ids.mjs --apply
 */
import { readFileSync } from 'node:fs'

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

function parseCsv(text) {
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const out = []
      let cur = ''
      let quoted = false
      for (let i = 0; i < line.length; i += 1) {
        const char = line[i]
        if (quoted) {
          if (char === '"') {
            if (line[i + 1] === '"') { cur += '"'; i += 1 } else quoted = false
          } else cur += char
        } else if (char === '"') quoted = true
        else if (char === ',') { out.push(cur); cur = '' }
        else cur += char
      }
      out.push(cur)
      return out
    })
}

const rows = parseCsv(readFileSync(new URL('../data/edit-report.csv', import.meta.url), 'utf8'))
rows.shift()
const original = rows.map((row) => ({ id: row[0], title: row[1] }))

const norm = (title) => title.replace(/\s+/g, ' ').trim().toLowerCase()
const byTitle = new Map(original.map((item) => [norm(item.title), item]))

const live = (await call('data')).problems
const edits = []
const claimed = new Set()

for (const problem of live) {
  const match = byTitle.get(norm(problem.title))
  if (!match) throw new Error(`No original ID for "${problem.title}"`)
  if (claimed.has(match.id)) throw new Error(`Two problems both map to ${match.id}`)
  claimed.add(match.id)
  if (match.id !== problem.id) edits.push({ id: problem.id, values: { ID: match.id } })
}

console.log(`${live.length} problems, ${edits.length} IDs to put back`)

if (!process.argv.includes('--apply')) {
  console.log('dry run. nothing written.')
  process.exit(0)
}

const backup = await call('backup')
console.log(`backed up as "${backup.backup}"`)

const result = await call('edit', { edits })
console.log(`${result.applied} cells written, ${result.missing.length} rows not found`)
