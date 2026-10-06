/**
 * Lints every problem statement against docs/VOICE.md. Exits 1 if anything
 * is flagged that the allowlist (data/research/lint-allow.json, each entry
 * with a reason) does not excuse. Writes data/research/BANK_LINT.md.
 *
 *   pnpm bank:lint
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { problemSchema } from '../../lib/problem'
import { lint } from './lint-rules'

const root = process.cwd()
const problems = (JSON.parse(readFileSync(join(root, 'data/problems.json'), 'utf8')) as unknown[]).map((raw) => problemSchema.parse(raw))
const allowPath = join(root, 'data/research/lint-allow.json')
const allow: Record<string, { rules: string[]; reason: string }> = existsSync(allowPath) ? JSON.parse(readFileSync(allowPath, 'utf8')) : {}

const results = problems.map((problem) => ({ problem, flags: lint(problem, allow[problem.id]?.rules ?? []) }))
const flagged = results.filter((result) => result.flags.length)
const byRule = new Map<string, number>()
for (const result of flagged) for (const flag of result.flags) byRule.set(flag.rule, (byRule.get(flag.rule) ?? 0) + 1)

const lines = [
  '# Bank lint',
  '',
  `${problems.length} problems checked, ${flagged.length} flagged. Rules are in docs/VOICE.md; excused items are in data/research/lint-allow.json with a reason each.`,
  '',
  '| Rule | Flags |',
  '| --- | --- |',
  ...[...byRule.entries()].sort((a, b) => b[1] - a[1]).map(([rule, n]) => `| ${rule} | ${n} |`),
  '',
  ...flagged.flatMap(({ problem, flags }) => [`- **${problem.id}** ${problem.title}: ${flags.map((flag) => `${flag.rule} (${flag.detail})`).join('; ')}`]),
  '',
]
writeFileSync(join(root, 'data/research/BANK_LINT.md'), lines.join('\n'))
writeFileSync(join(root, 'data/research/bank-lint.json'), JSON.stringify(flagged.map(({ problem, flags }) => ({ id: problem.id, flags })), null, 2))
console.log(`${problems.length} problems, ${flagged.length} flagged.`)
for (const [rule, n] of [...byRule.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${rule.padEnd(20)} ${n}`)
if (flagged.length) process.exit(1)
