/**
 * Step 5. Selects the bank from the candidates that survived step 4, against
 * the quotas in docs/RESEARCH.md, and assigns rarity.
 *
 *   pnpm tsx scripts/research/balance.ts [--target 260]
 *
 * Greedy by total score within each quota:
 *
 * 1. Minimums first. While any minimum is unmet (a learn tag under 12, a side
 *    at or under 15%, India under 40%, fewer than 10 industries), take the
 *    highest-scoring candidate that helps the neediest one.
 * 2. Then fill to the target by total score alone.
 *
 * Throughout, no primary industry may pass 15% of the target. Rarity is then
 * assigned by ranking the selection on ambition and cutting at 25/45/24/6.
 * Everything kept but not selected goes to `reserve`, best first.
 *
 * Writes data/research/shortlist.json. Exits 1 if fewer than 200 survive or a
 * quota cannot be met, after writing, so the shortfall can be inspected.
 */

import { LEARN_IDS, RARITIES, SIDE_IDS, type Rarity } from '../../lib/taxonomy'
import { PATHS, arg, readAllSignals, readJson, writeJson } from './lib'
import {
  BANK_MAX,
  BANK_MIN,
  INDUSTRY_MIN_REPRESENTED,
  LEARN_MIN_COUNT,
  ambition,
  indiaMin,
  industryCap,
  primaryIndustry,
  quotaReport,
  rarityCounts,
  resolveSignals,
  sideMin,
} from './rules'
import { droppedFileSchema, scoredFileSchema, type Scored, type Selected } from './schema-steps'

type Need = { label: string; helps: (record: Scored) => boolean; short: number }

function main(): void {
  const scored = readJson(PATHS.scored, scoredFileSchema)
  const dropped = new Set(readJson(PATHS.dropped, droppedFileSchema).map((item) => item.key))
  const { signals } = readAllSignals()
  const byId = new Map(signals.map((signal) => [signal.id, signal]))
  const evidenceCount = (record: Scored) => resolveSignals(record.signalIds, byId).length

  const kept = scored
    .filter((record) => !dropped.has(record.key))
    .sort(
      (a, b) =>
        b.total - a.total || evidenceCount(b) - evidenceCount(a) || a.key.localeCompare(b.key),
    )

  const requested = Number(arg('target') ?? 260)
  const target = Math.min(Math.max(requested, BANK_MIN), BANK_MAX, kept.length)
  const cap = industryCap(target)

  const selected: Scored[] = []
  const chosen = new Set<string>()
  const industryCount = new Map<string, number>()
  const fits = (record: Scored) =>
    !chosen.has(record.key) && (industryCount.get(primaryIndustry(record)) ?? 0) < cap
  const take = (record: Scored) => {
    selected.push(record)
    chosen.add(record.key)
    const industry = primaryIndustry(record)
    industryCount.set(industry, (industryCount.get(industry) ?? 0) + 1)
  }

  const needs = (): Need[] => {
    const list: Need[] = []
    for (const id of LEARN_IDS) {
      const have = selected.filter((record) => record.learn.includes(id)).length
      list.push({
        label: `learn ${id}`,
        helps: (r) => r.learn.includes(id),
        short: LEARN_MIN_COUNT - have,
      })
    }
    for (const id of SIDE_IDS) {
      const have = selected.filter((record) => record.side === id).length
      list.push({ label: `side ${id}`, helps: (r) => r.side === id, short: sideMin(target) - have })
    }
    const india = selected.filter((record) => record.geo === 'IN').length
    list.push({ label: 'geo IN', helps: (r) => r.geo === 'IN', short: indiaMin(target) - india })
    const represented = new Set(selected.map(primaryIndustry))
    list.push({
      label: 'industries represented',
      helps: (r) => !represented.has(primaryIndustry(r)),
      short: INDUSTRY_MIN_REPRESENTED - represented.size,
    })
    return list.filter((need) => need.short > 0).sort((a, b) => b.short - a.short)
  }

  // 1. Minimums
  const unmet: string[] = []
  for (let guard = 0; selected.length < target && guard < target * 4; guard++) {
    const open = needs().filter((need) => !unmet.includes(need.label))
    const need = open[0]
    if (!need) break
    const pick = kept.find((record) => fits(record) && need.helps(record))
    if (pick) take(pick)
    else unmet.push(need.label)
  }

  // 2. Fill by total
  for (const record of kept) {
    if (selected.length >= target) break
    if (fits(record)) take(record)
  }

  // 3. Rarity by ambition, highest first
  const counts = rarityCounts(selected.length)
  const order: Rarity[] = [...RARITIES].reverse()
  const ranked = selected
    .map((record) => ({ record, ambition: ambition(record) }))
    .sort((a, b) => b.ambition - a.ambition || a.record.key.localeCompare(b.record.key))
  const withRarity: Selected[] = []
  let cursor = 0
  for (const rarity of order) {
    for (let i = 0; i < counts[rarity]; i++, cursor++) {
      const item = ranked[cursor]
      if (item) withRarity.push({ ...item.record, rarity, ambition: item.ambition })
    }
  }
  const rank = new Map(selected.map((record, index) => [record.key, index]))
  withRarity.sort((a, b) => (rank.get(a.key) ?? 0) - (rank.get(b.key) ?? 0))

  const reserve = kept.filter((record) => !chosen.has(record.key))
  writeJson(PATHS.shortlist, { target, selected: withRarity, reserve })

  const report = quotaReport(withRarity)
  for (const row of report) {
    console.log(
      `${row.ok ? 'ok  ' : 'MISS'} ${row.quota.padEnd(24)} ${row.actual.padEnd(14)} ${row.target}`,
    )
  }
  console.log(`${withRarity.length} selected, ${reserve.length} in reserve`)
  if (unmet.length > 0) console.error(`No candidate left to meet: ${unmet.join(', ')}`)
  if (kept.length < BANK_MIN)
    console.error(`Only ${kept.length} candidates survived; the bank needs ${BANK_MIN}.`)
  if (report.some((row) => !row.ok)) process.exit(1)
}

main()
