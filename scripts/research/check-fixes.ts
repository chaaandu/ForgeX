/**
 * Checks a batch of hand-written fixes before they are merged:
 *   pnpm tsx scripts/research/check-fixes.ts /tmp/bankfix/A.json
 * Each entry is { id, title, problem, challenge, allow?: { rules, reason } }.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { problemSchema } from '../../lib/problem'
import { lint } from './lint-rules'

const file = process.argv[2]
if (!file) throw new Error('Pass the fixes file')
type Fix = { id: string; title: string; problem: string; challenge: string; allow?: { rules: string[]; reason: string } }
const fixes = JSON.parse(readFileSync(file, 'utf8')) as Fix[]
const bank = new Map(
  (JSON.parse(readFileSync(join(process.cwd(), 'data/problems.json'), 'utf8')) as unknown[]).map((raw) => {
    const problem = problemSchema.parse(raw)
    return [problem.id, problem]
  }),
)
let bad = 0
for (const fix of fixes) {
  const base = bank.get(fix.id)
  if (!base) {
    console.log(`${fix.id}: not in the bank`)
    bad++
    continue
  }
  const parsed = problemSchema.safeParse({ ...base, title: fix.title, problem: fix.problem, challenge: fix.challenge })
  if (!parsed.success) {
    console.log(`${fix.id}: schema: ${parsed.error.issues.map((issue) => issue.message).join('; ')}`)
    bad++
    continue
  }
  const flags = lint(parsed.data, fix.allow?.rules ?? [])
  if (fix.allow && !fix.allow.reason) {
    console.log(`${fix.id}: an allow entry needs a reason`)
    bad++
  }
  if (flags.length) {
    console.log(`${fix.id}: ${flags.map((flag) => `${flag.rule} (${flag.detail})`).join('; ')}`)
    bad++
  }
}
console.log(`${fixes.length} fixes, ${bad} still flagged.`)
if (bad) process.exit(1)
