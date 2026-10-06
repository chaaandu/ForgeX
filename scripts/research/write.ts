/**
 * Step 6. Writes the bank: data/problems.json (what founders see) and
 * data/problems.internal.json (what only the team sees).
 *
 *   pnpm tsx scripts/research/write.ts
 *
 * - Lints every title, problem and challenge against the writing rules in
 *   docs/RESEARCH.md and fails, writing nothing, on any violation.
 * - Assigns IDs P001 onward in balanced order: round-robin across primary
 *   industries, each industry best-first, so neighbouring IDs differ and no
 *   one industry owns the front of the list.
 * - Builds the signal line and strength meter from resolved evidence.
 * - Checks every record against lib/problem.ts before writing.
 */

import {
  problemInternalSchema,
  problemSchema,
  type Problem,
  type ProblemInternal,
} from '../../lib/problem'
import { PATHS, readAllSignals, readJson, writeJson } from './lib'
import {
  brandsFromPlayers,
  lint,
  primaryIndustry,
  resolveSignals,
  signalLine,
  signalStrength,
} from './rules'
import { shortlistSchema, type Selected } from './schema-steps'

function balancedOrder(selected: Selected[]): Selected[] {
  const byIndustry = new Map<string, Selected[]>()
  for (const record of selected) {
    const key = primaryIndustry(record)
    byIndustry.set(key, [...(byIndustry.get(key) ?? []), record])
  }
  const queues = [...byIndustry.values()]
    .map((queue) => [...queue].sort((a, b) => b.total - a.total || a.key.localeCompare(b.key)))
    .sort((a, b) => (b[0]?.total ?? 0) - (a[0]?.total ?? 0) || b.length - a.length)
  const out: Selected[] = []
  while (queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift()
      if (next) out.push(next)
    }
  }
  return out
}

function main(): void {
  const shortlist = readJson(PATHS.shortlist, shortlistSchema)
  const { signals } = readAllSignals()
  const byId = new Map(signals.map((signal) => [signal.id, signal]))
  const brands = brandsFromPlayers(
    [...shortlist.selected, ...shortlist.reserve].flatMap((record) =>
      record.players.map((p) => p.name),
    ),
  )

  const violations: string[] = []
  for (const record of shortlist.selected) {
    for (const issue of lint(record, brands)) {
      violations.push(`${record.key} ${issue.field}: ${issue.message}  ("${record.title}")`)
    }
  }
  if (violations.length > 0) {
    console.error(`Writing rules failed for ${violations.length} field(s):`)
    for (const line of violations) console.error(`  ${line}`)
    process.exit(1)
  }

  const problems: Problem[] = []
  const internal: ProblemInternal[] = []
  const errors: string[] = []
  balancedOrder(shortlist.selected).forEach((record, index) => {
    const id = `P${String(index + 1).padStart(3, '0')}`
    const evidence = resolveSignals(record.signalIds, byId).sort((a, b) =>
      b.date.localeCompare(a.date),
    )
    const sources: Record<string, number> = {}
    for (const signal of evidence) sources[signal.source] = (sources[signal.source] ?? 0) + 1

    const problem = problemSchema.safeParse({
      id,
      title: record.title.trim(),
      problem: record.problem.trim(),
      challenge: record.challenge.trim(),
      rarity: record.rarity,
      industries: record.industries,
      side: record.side,
      learn: record.learn,
      geo: record.geo,
      signal: {
        count: evidence.length,
        strength: signalStrength(evidence),
        line: signalLine(evidence),
      },
    })
    const detail = problemInternalSchema.safeParse({
      id,
      evidence: evidence.map((signal) => ({
        source: signal.source,
        url: signal.url,
        date: signal.date,
        paraphrase: signal.paraphrase,
      })),
      sources,
      whyNow: record.whyNow,
      players: record.players,
      scores: record.scores,
      total: record.total,
    })
    if (problem.success) problems.push(problem.data)
    else
      errors.push(
        `${id} (${record.key}) problems.json: ${problem.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`,
      )
    if (detail.success) internal.push(detail.data)
    else
      errors.push(
        `${id} (${record.key}) internal: ${detail.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`,
      )
  })

  if (errors.length > 0) {
    console.error(`${errors.length} record(s) do not match lib/problem.ts:`)
    for (const line of errors) console.error(`  ${line}`)
    process.exit(1)
  }

  writeJson(PATHS.problems, problems)
  writeJson(PATHS.internal, internal)
  console.log(`Wrote ${problems.length} problems to ${PATHS.problems} and ${PATHS.internal}`)
}

main()
