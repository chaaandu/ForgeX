/**
 * Writes docs/PROBLEMS.md: the whole bank, readable, grouped by industry, with
 * what founders see and the evidence behind each one. Run after any change to
 * data/problems.json with `pnpm bank:list`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { problemInternalSchema, problemSchema, RARITY_LABEL } from '../../lib/problem'
import { INDUSTRIES, labelOf } from '../../lib/taxonomy'

const root = process.cwd()
const problems = (JSON.parse(readFileSync(join(root, 'data/problems.json'), 'utf8')) as unknown[]).map((raw) => problemSchema.parse(raw))
const internal = new Map(
  (JSON.parse(readFileSync(join(root, 'data/problems.internal.json'), 'utf8')) as unknown[])
    .map((raw) => problemInternalSchema.parse(raw))
    .map((item) => [item.id, item]),
)

const lines: string[] = [
  '# The problem bank',
  '',
  `${problems.length} problems, grouped by the industry each is mainly about. Founders see the title, the problem and the challenge, and never the rarity, the evidence or the scores. Approve, edit or reject each one in \`/team/bank\` or in the Problems tab of the Sheet. Generated from \`data/problems.json\` by \`pnpm bank:list\`.`,
  '',
  '| Industry | Problems |',
  '| --- | --- |',
  ...INDUSTRIES.map((industry) => `| ${industry.label} | ${problems.filter((item) => item.industries[0] === industry.id).length} |`),
  '',
]

for (const industry of INDUSTRIES) {
  const group = problems.filter((item) => item.industries[0] === industry.id)
  if (!group.length) continue
  lines.push(`## ${industry.label}`, '')
  for (const item of group) {
    const extra = internal.get(item.id)
    lines.push(`### ${item.id} · ${item.title}`, '')
    lines.push(item.problem, '')
    lines.push(`**Challenge:** ${item.challenge}`, '')
    lines.push(
      `${RARITY_LABEL[item.rarity]} · for ${labelOf.side(item.side).toLowerCase()} · ${item.geo === 'IN' ? 'India' : 'global'} · teaches ${item.learn.map(labelOf.learn).join(', ')}${item.industries.length > 1 ? ` · also ${item.industries.slice(1).map(labelOf.industryShort).join(', ')}` : ''}`,
      '',
    )
    if (extra) {
      lines.push(`<details><summary>Evidence (${extra.evidence.length}) and scores (${extra.total})</summary>`, '')
      for (const signal of extra.evidence) lines.push(`- ${signal.paraphrase} [${signal.source}, ${signal.date}](${signal.url})`)
      lines.push('', `**Why now:** ${extra.whyNow}`, '')
      lines.push(Object.entries(extra.scores).map(([name, score]) => `${name} ${score.value}`).join(' · '), '', '</details>', '')
    }
  }
}

writeFileSync(join(root, 'docs/PROBLEMS.md'), `${lines.join('\n')}\n`)
console.log(`Wrote docs/PROBLEMS.md with ${problems.length} problems.`)
