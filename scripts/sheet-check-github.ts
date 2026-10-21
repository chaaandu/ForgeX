/**
 * Checks every GitHub link in the Profiles tab against GitHub, and colours
 * that cell: red when the link does not open (no such account or repo, or
 * not a GitHub link), yellow when the account has no public repositories or
 * the repo is empty. Every other GitHub cell is left with no colour, so a
 * second run shows the state at that moment.
 *
 *   pnpm sheet:check-github          checks and colours
 *   pnpm sheet:check-github --dry    checks and prints, colours nothing
 *
 * Uses the GitHub CLI (gh) for the lookups, so it needs `gh auth login`.
 */
import { execFileSync } from 'node:child_process'
import { batchGet, sheetsMeta, structure } from '../lib/sheet/google'
import { TABS } from '../lib/sheet/tabs'

const dry = process.argv.includes('--dry')
type Verdict = 'ok' | 'error' | 'empty' | 'blank'

const RED = { red: 0.957, green: 0.8, blue: 0.8 }
const YELLOW = { red: 1, green: 0.949, blue: 0.8 }

function gh(path: string): Record<string, unknown> | null {
  try {
    return JSON.parse(
      execFileSync('gh', ['api', path], { stdio: ['ignore', 'pipe', 'ignore'] }).toString(),
    )
  } catch {
    return null
  }
}

function check(raw: string): { verdict: Verdict; why: string } {
  const value = raw.trim()
  if (!value) return { verdict: 'blank', why: '' }
  let url: URL
  try {
    url = new URL(/^https?:\/\//.test(value) ? value : `https://${value}`)
  } catch {
    return { verdict: 'error', why: 'not a link' }
  }
  if (!/(^|\.)github\.com$/i.test(url.hostname))
    return { verdict: 'error', why: 'not a GitHub link' }
  const [owner, repo] = url.pathname.split('/').filter(Boolean)
  if (!owner) return { verdict: 'error', why: 'no account in the link' }
  if (repo) {
    const found = gh(`repos/${owner}/${repo.replace(/\.git$/, '')}`)
    if (!found) return { verdict: 'error', why: 'no such repo' }
    return Number(found.size) === 0
      ? { verdict: 'empty', why: 'repo is empty' }
      : { verdict: 'ok', why: '' }
  }
  const user = gh(`users/${owner}`)
  if (!user) return { verdict: 'error', why: 'no such account' }
  return Number(user.public_repos) === 0
    ? { verdict: 'empty', why: 'no public repositories' }
    : { verdict: 'ok', why: '' }
}

async function main() {
  const name = TABS.profiles.name
  const grid = (await batchGet([name]))[name] ?? []
  const head = (grid[0] ?? []).map((cell) => cell.trim())
  const column = head.indexOf('GitHub')
  const nameCol = head.indexOf('Name')
  if (column < 0) throw new Error('Profiles has no GitHub column')
  const sheet = (await sheetsMeta()).find((item) => item.properties.title === name)
  if (!sheet) throw new Error('No Profiles tab')

  const counts: Record<Verdict, number> = { ok: 0, error: 0, empty: 0, blank: 0 }
  const requests: object[] = []
  grid.slice(1).forEach((row, offset) => {
    const { verdict, why } = check(row[column] ?? '')
    counts[verdict] += 1
    if (verdict === 'error' || verdict === 'empty')
      console.log(
        `  ${verdict === 'error' ? 'red   ' : 'yellow'} ${row[nameCol]}: ${row[column]} (${why})`,
      )
    const colour = verdict === 'error' ? RED : verdict === 'empty' ? YELLOW : null
    requests.push({
      repeatCell: {
        range: {
          sheetId: sheet.properties.sheetId,
          startRowIndex: offset + 1,
          endRowIndex: offset + 2,
          startColumnIndex: column,
          endColumnIndex: column + 1,
        },
        cell: { userEnteredFormat: { backgroundColor: colour ?? { red: 1, green: 1, blue: 1 } } },
        fields: 'userEnteredFormat.backgroundColor',
      },
    })
  })
  console.log(
    `· ${counts.ok} fine, ${counts.error} red, ${counts.empty} yellow, ${counts.blank} not added yet`,
  )
  if (dry) return console.log('Dry run: nothing coloured.')
  for (let index = 0; index < requests.length; index += 100)
    await structure(requests.slice(index, index + 100))
  console.log('· Coloured.')
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
