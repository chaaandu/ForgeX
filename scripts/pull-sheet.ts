/**
 * Refreshes data/problems.json from the live Sheet, so the local snapshot that
 * mock mode and the offline fallback use matches what students actually see.
 *
 *   pnpm data:pull
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { stripClusterPrefix } from '../lib/parse'
import { problemsSchema } from '../lib/schema'

const TARGET = resolve(process.cwd(), 'data/problems.json')

function env(): Record<string, string> {
  return Object.fromEntries(
    readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
      .split('\n')
      .filter((line) => line.includes('='))
      .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
  )
}

async function main() {
  const { APPS_SCRIPT_URL, APPS_SCRIPT_SECRET } = env()
  if (!APPS_SCRIPT_URL || !APPS_SCRIPT_SECRET) throw new Error('No Apps Script credentials')

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ secret: APPS_SCRIPT_SECRET, action: 'data' }),
    redirect: 'follow',
  })
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object' || !('problems' in body)) {
    throw new Error(`Unexpected response: ${JSON.stringify(body).slice(0, 200)}`)
  }

  const problems = problemsSchema.parse(body.problems).map((problem) => ({
    ...problem,
    cluster: stripClusterPrefix(problem.cluster),
  }))

  writeFileSync(TARGET, `${JSON.stringify(problems, null, 2)}\n`)
  console.log(`${problems.length} problems pulled into data/problems.json`)
  console.log(`  clusters ${new Set(problems.map((p) => p.cluster)).size}`)
}

main()
