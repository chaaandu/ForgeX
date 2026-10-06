/**
 * Step 4. Applies the hard drops in docs/RESEARCH.md to the scored
 * candidates and writes data/research/dropped.json, each with its reasons.
 *
 *   pnpm tsx scripts/research/drop.ts
 *
 * Signals are counted after resolving IDs against the raw files and removing
 * duplicate URLs, so an ID that no longer exists, or two IDs for one page,
 * cannot hold a problem up.
 */

import { PATHS, readAllSignals, readJson, writeJson } from './lib'
import { dropReasons, resolveSignals } from './rules'
import { scoredFileSchema, type Dropped } from './schema-steps'

function main(): void {
  const scored = readJson(PATHS.scored, scoredFileSchema)
  const { signals } = readAllSignals()
  const byId = new Map(signals.map((signal) => [signal.id, signal]))

  const dropped: Dropped[] = []
  let unknownIds = 0
  for (const record of scored) {
    const evidence = resolveSignals(record.signalIds, byId)
    unknownIds += record.signalIds.filter((id) => !byId.has(id)).length
    const reasons = dropReasons(record, evidence)
    if (reasons.length > 0) {
      dropped.push({
        key: record.key,
        title: record.title,
        total: record.total,
        signals: evidence.length,
        reasons,
      })
    }
  }

  writeJson(PATHS.dropped, dropped)
  const byReason = new Map<string, number>()
  for (const item of dropped) {
    for (const reason of item.reasons) byReason.set(reason, (byReason.get(reason) ?? 0) + 1)
  }
  console.log(
    `${scored.length} scored, ${dropped.length} dropped, ${scored.length - dropped.length} kept`,
  )
  for (const [reason, n] of [...byReason].sort((a, b) => b[1] - a[1]))
    console.log(`  ${n}  ${reason}`)
  if (unknownIds > 0) console.warn(`${unknownIds} signal IDs did not resolve to a raw signal`)
}

main()
