/**
 * Step 3. Scores each candidate on the seven-score rubric in docs/RESEARCH.md
 * and records the judgement calls the hard drops depend on.
 *
 *   pnpm tsx scripts/research/score.ts [--batch 15]
 *
 * With ANTHROPIC_API_KEY set, follows prompts/score.md and writes
 * data/research/scored.json. Without it, says so, checks any scored.json the
 * research agent has already written, and exits 0.
 */

import { existsSync } from 'node:fs'
import { PATHS, arg, readAllSignals, readJson, readPrompt, writeJson } from './lib'
import { explainNoKey, hasApiKey, structuredCall } from './llm'
import {
  candidatesFileSchema,
  scoreOutputSchema,
  scoredFileSchema,
  scoredSchema,
  totalOf,
  type Scored,
} from './schema-steps'

function checkExisting(): void {
  if (!existsSync(PATHS.scored)) {
    console.log(`No ${PATHS.scored} yet.`)
    return
  }
  const scored = readJson(PATHS.scored, scoredFileSchema)
  const wrong = scored.filter((record) => record.total !== totalOf(record.scores))
  console.log(`${PATHS.scored}: ${scored.length} scored, schema OK.`)
  if (wrong.length > 0) {
    console.error(`${wrong.length} records have a total that is not the sum of their scores`)
    process.exit(1)
  }
}

async function main(): Promise<void> {
  if (!hasApiKey()) {
    explainNoKey('score', 'data/research/scored.json')
    checkExisting()
    return
  }

  const prompt = readPrompt('score.md')
  const candidates = readJson(PATHS.candidates, candidatesFileSchema)
  const { signals } = readAllSignals()
  const byId = new Map(signals.map((signal) => [signal.id, signal]))
  const size = Number(arg('batch') ?? 15)

  const scored: Scored[] = []
  for (let i = 0; i < candidates.length; i += size) {
    const batch = candidates.slice(i, i + size)
    console.log(`batch ${i / size + 1}/${Math.ceil(candidates.length / size)}`)
    const payload = batch.map((candidate) => ({
      key: candidate.key,
      title: candidate.title,
      problem: candidate.problem,
      challenge: candidate.challenge,
      industries: candidate.industries,
      side: candidate.side,
      learn: candidate.learn,
      geo: candidate.geo,
      evidence: candidate.signalIds.flatMap((id) => {
        const signal = byId.get(id)
        return signal
          ? [
              {
                source: signal.source,
                date: signal.date,
                geo: signal.geo,
                paraphrase: signal.paraphrase,
              },
            ]
          : []
      }),
    }))
    const output = await structuredCall({
      system: prompt.text,
      user: `Candidates:\n${JSON.stringify(payload, null, 1)}`,
      schema: scoreOutputSchema,
    })
    const drafts = new Map(output.scored.map((draft) => [draft.key, draft]))
    for (const candidate of batch) {
      const draft = drafts.get(candidate.key)
      if (!draft) {
        console.warn(`no score returned for ${candidate.key}`)
        continue
      }
      const parsed = scoredSchema.safeParse({
        ...candidate,
        scores: draft.scores,
        flags: draft.flags,
        whyNow: draft.whyNow,
        players: draft.players,
        total: totalOf(draft.scores),
        scorePromptVersion: prompt.version,
      })
      if (parsed.success) scored.push(parsed.data)
      else console.warn(`invalid score for ${candidate.key}: ${parsed.error.issues[0]?.message}`)
    }
  }

  writeJson(PATHS.scored, scored)
  console.log(`Wrote ${scored.length} scored candidates to ${PATHS.scored}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
