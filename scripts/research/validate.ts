/**
 * Step 7. Checks the bank and writes data/research/REPORT.md.
 *
 *   pnpm tsx scripts/research/validate.ts
 *
 * Fails (exit 1) if data/problems.json does not parse against problemSchema,
 * data/problems.internal.json against problemInternalSchema, the two files
 * disagree on IDs, the IDs are not P001 onward without gaps, any writing rule
 * is broken, or any balance quota is missed. The report is written either way,
 * with the violations at the top, so a failed run can be read.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { z } from 'zod'
import {
  problemInternalSchema,
  problemSchema,
  type Problem,
  type ProblemInternal,
} from '../../lib/problem'
import { PATHS, ensureDir, readAllSignals } from './lib'
import { brandsFromPlayers, lint, quotaReport } from './rules'
import { SOURCES } from './schema'
import { SCORE_KEYS, droppedFileSchema, scoredFileSchema } from './schema-steps'

function parseArray<T>(
  file: string,
  schema: z.ZodType<T>,
  label: string,
  violations: string[],
): T[] {
  if (!existsSync(file)) {
    violations.push(`${label}: ${file} is missing`)
    return []
  }
  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    violations.push(`${label}: not valid JSON`)
    return []
  }
  if (!Array.isArray(raw)) {
    violations.push(`${label}: must be an array`)
    return []
  }
  const out: T[] = []
  raw.forEach((item: unknown, index) => {
    const parsed = schema.safeParse(item)
    if (parsed.success) out.push(parsed.data)
    else {
      const id = typeof item === 'object' && item && 'id' in item ? String(item.id) : `#${index}`
      for (const issue of parsed.error.issues) {
        violations.push(`${label} ${id}: ${issue.path.join('.') || '(root)'} ${issue.message}`)
      }
    }
  })
  return out
}

function table(header: string[], rows: (string | number)[][]): string {
  const line = (cells: (string | number)[]) => `| ${cells.map(String).join(' | ')} |`
  return [line(header), line(header.map(() => '---')), ...rows.map(line)].join('\n')
}

function main(): void {
  const violations: string[] = []
  const problems = parseArray(PATHS.problems, problemSchema, 'problems.json', violations)
  const internal = parseArray(
    PATHS.internal,
    problemInternalSchema,
    'problems.internal.json',
    violations,
  )

  // Cross-file and ID checks
  const ids = problems.map((problem) => problem.id)
  ids.forEach((id, index) => {
    const expected = `P${String(index + 1).padStart(3, '0')}`
    if (id !== expected)
      violations.push(`problems.json: position ${index + 1} is ${id}, expected ${expected}`)
  })
  if (new Set(ids).size !== ids.length) violations.push('problems.json: duplicate IDs')
  const internalIds = internal.map((item) => item.id)
  if (ids.join() !== internalIds.join()) {
    violations.push(
      'problems.json and problems.internal.json do not list the same IDs in the same order',
    )
  }
  const byId = new Map<string, ProblemInternal>(internal.map((item) => [item.id, item]))
  for (const problem of problems) {
    const detail = byId.get(problem.id)
    if (detail && detail.evidence.length !== problem.signal.count) {
      violations.push(
        `${problem.id}: signal.count ${problem.signal.count} but ${detail.evidence.length} evidence rows`,
      )
    }
    if (detail) {
      const total = SCORE_KEYS.reduce((sum, key) => sum + detail.scores[key].value, 0)
      if (total !== detail.total)
        violations.push(`${problem.id}: total ${detail.total} is not the sum ${total}`)
    }
  }

  // Writing rules and quotas
  const brands = brandsFromPlayers(
    internal.flatMap((item) => item.players.map((player) => player.name)),
  )
  for (const problem of problems) {
    for (const issue of lint(problem, brands))
      violations.push(`${problem.id} ${issue.field}: ${issue.message}`)
  }
  const quotas = quotaReport(problems)
  for (const row of quotas)
    if (!row.ok) violations.push(`quota ${row.quota}: ${row.actual}, needs ${row.target}`)

  writeReport(problems, internal, quotas, violations)
  if (violations.length > 0) {
    console.error(`${violations.length} violation(s). See ${PATHS.report}.`)
    for (const line of violations.slice(0, 40)) console.error(`  ${line}`)
    process.exit(1)
  }
  console.log(`${problems.length} problems valid. Report at ${PATHS.report}`)
}

function writeReport(
  problems: Problem[],
  internal: ProblemInternal[],
  quotas: ReturnType<typeof quotaReport>,
  violations: string[],
): void {
  const out: string[] = ['# Problem bank research report', '']
  out.push(
    `${problems.length} problems. ${violations.length === 0 ? 'All checks pass.' : `${violations.length} violation(s).`}`,
    '',
  )

  if (violations.length > 0) {
    out.push('## Violations', '', ...violations.map((line) => `- ${line}`), '')
  }

  // Source mix
  const { signals } = readAllSignals()
  const cited = new Set(internal.flatMap((item) => item.evidence.map((row) => row.url)))
  const years = [...new Set(signals.map((signal) => signal.date.slice(0, 4)))].sort()
  const rows: (string | number)[][] = SOURCES.filter((source) =>
    signals.some((signal) => signal.source === source),
  ).map((source) => {
    const mine = signals.filter((signal) => signal.source === source)
    return [
      source,
      ...years.map((year) => mine.filter((signal) => signal.date.startsWith(year)).length),
      mine.length,
      mine.filter((signal) => cited.has(signal.url)).length,
    ]
  })
  rows.push([
    '**all**',
    ...years.map((year) => signals.filter((signal) => signal.date.startsWith(year)).length),
    signals.length,
    signals.filter((signal) => cited.has(signal.url)).length,
  ])
  out.push(
    '## Source mix',
    '',
    'Every raw signal, by source and year, and how many are cited by the bank.',
    '',
  )
  out.push(table(['Source', ...years, 'Total', 'Cited'], rows), '')

  // Coverage
  out.push(
    '## Coverage',
    '',
    table(
      ['Quota', 'Actual', 'Target', ''],
      quotas.map((row) => [row.quota, row.actual, row.target, row.ok ? 'ok' : '**miss**']),
    ),
    '',
  )

  // Scores
  const scoreRows = SCORE_KEYS.map((key) => {
    const values = internal.map((item) => item.scores[key].value)
    const counts = [1, 2, 3, 4, 5].map((value) => values.filter((v) => v === value).length)
    const mean = values.length
      ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
      : '-'
    return [key, ...counts, mean]
  })
  const totals = internal.map((item) => item.total).sort((a, b) => a - b)
  const median = totals.length ? totals[Math.floor(totals.length / 2)] : undefined
  out.push('## Scores', '', table(['Score', '1', '2', '3', '4', '5', 'Mean'], scoreRows), '')
  out.push(
    `Total (7 to 35): min ${totals[0] ?? '-'}, median ${median ?? '-'}, max ${totals[totals.length - 1] ?? '-'}.`,
    '',
  )

  // Strongest and weakest
  const titleOf = new Map(problems.map((problem) => [problem.id, problem.title]))
  const ranked = [...internal].sort(
    (a, b) => b.total - a.total || b.evidence.length - a.evidence.length,
  )
  const rankRow = (item: ProblemInternal) => [
    item.id,
    titleOf.get(item.id) ?? '',
    item.total,
    ...SCORE_KEYS.map((key) => item.scores[key].value),
    item.evidence.length,
  ]
  const header = [
    'ID',
    'Title',
    'Total',
    'Pain',
    'Freq',
    'WTP',
    'Build',
    'Learn',
    'Novel',
    'Open',
    'Evidence',
  ]
  out.push('## Strongest 20', '', table(header, ranked.slice(0, 20).map(rankRow)), '')
  out.push('## Weakest 20', '', table(header, ranked.slice(-20).reverse().map(rankRow)), '')

  // Drops
  out.push('## Drops', '')
  if (existsSync(PATHS.dropped)) {
    const dropped = droppedFileSchema.parse(JSON.parse(readFileSync(PATHS.dropped, 'utf8')))
    const scoredCount = existsSync(PATHS.scored)
      ? scoredFileSchema.parse(JSON.parse(readFileSync(PATHS.scored, 'utf8'))).length
      : undefined
    out.push(
      `${dropped.length} of ${scoredCount ?? '?'} scored candidates were dropped. A candidate can fail more than one rule.`,
      '',
    )
    const reasons = [...new Set(dropped.flatMap((item) => item.reasons))]
    for (const reason of reasons) {
      const hit = dropped.filter((item) => item.reasons.includes(reason))
      out.push(
        `### ${reason} (${hit.length})`,
        '',
        ...hit.map(
          (item) => `- ${item.key} ${item.title} (total ${item.total}, ${item.signals} signals)`,
        ),
        '',
      )
    }
  } else {
    out.push('No dropped.json yet.', '')
  }

  ensureDir(PATHS.report)
  writeFileSync(PATHS.report, out.join('\n'))
}

main()
