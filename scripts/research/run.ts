/**
 * Runs steps 2 to 7 in order: cluster, score, drop, balance, write, validate.
 *
 *   pnpm tsx scripts/research/run.ts
 *
 * Stops at the first step that fails. Without ANTHROPIC_API_KEY, cluster and
 * score report that the research agent runs them and check its files; the
 * deterministic steps then run on whatever candidates.json and scored.json
 * are on disk.
 */

import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const STEPS = ['cluster', 'score', 'drop', 'balance', 'write', 'validate']

for (const step of STEPS) {
  console.log(`\n== ${step} ==`)
  const result = spawnSync(
    process.execPath,
    [
      '--import',
      'tsx',
      join(process.cwd(), 'scripts', 'research', `${step}.ts`),
      ...process.argv.slice(2),
    ],
    { stdio: 'inherit' },
  )
  if (result.status !== 0) {
    console.error(`\n${step} failed (exit ${result.status ?? 'signal'}). Stopping.`)
    process.exit(result.status ?? 1)
  }
}
console.log('\nAll steps passed.')
