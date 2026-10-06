/**
 * Step 2. Groups the raw signals into candidate problems.
 *
 *   pnpm tsx scripts/research/cluster.ts [--batch 300]
 *
 * With ANTHROPIC_API_KEY set, sends the signals to the model in batches by
 * industry hint, following prompts/cluster.md, and writes
 * data/research/candidates.json. Without it, says so, checks any
 * candidates.json the research agent has already written, and exits 0.
 */

import { existsSync } from 'node:fs'
import { INDUSTRIES, LEARN, SIDES } from '../../lib/taxonomy'
import { PATHS, arg, readAllSignals, readJson, readPrompt, writeJson } from './lib'
import { explainNoKey, hasApiKey, structuredCall } from './llm'
import type { Signal } from './schema'
import {
  candidateSchema,
  candidatesFileSchema,
  clusterOutputSchema,
  type Candidate,
} from './schema-steps'

function vocabulary(): string {
  return [
    `Industries: ${INDUSTRIES.map((item) => `${item.id} (${item.label})`).join(', ')}`,
    `Sides: ${SIDES.map((item) => `${item.id} (${item.label})`).join(', ')}`,
    `Learn: ${LEARN.map((item) => `${item.id} (${item.label})`).join(', ')}`,
  ].join('\n')
}

function batches(signals: Signal[], size: number): Signal[][] {
  const groups = new Map<string, Signal[]>()
  for (const signal of signals) {
    const key = signal.industryHint ?? 'unhinted'
    groups.set(key, [...(groups.get(key) ?? []), signal])
  }
  const out: Signal[][] = []
  for (const group of groups.values()) {
    for (let i = 0; i < group.length; i += size) out.push(group.slice(i, i + size))
  }
  return out
}

function checkExisting(): void {
  if (!existsSync(PATHS.candidates)) {
    console.log(`No ${PATHS.candidates} yet.`)
    return
  }
  const candidates = readJson(PATHS.candidates, candidatesFileSchema)
  console.log(`${PATHS.candidates}: ${candidates.length} candidates, schema OK.`)
}

async function main(): Promise<void> {
  if (!hasApiKey()) {
    explainNoKey('cluster', 'data/research/candidates.json')
    checkExisting()
    return
  }

  const prompt = readPrompt('cluster.md')
  const { signals, errors } = readAllSignals()
  if (errors.length > 0) console.warn(`${errors.length} invalid signal lines skipped`)
  const known = new Set(signals.map((signal) => signal.id))
  const size = Number(arg('batch') ?? 300)

  const candidates: Candidate[] = []
  const groups = batches(signals, size)
  for (const [index, group] of groups.entries()) {
    console.log(`batch ${index + 1}/${groups.length}: ${group.length} signals`)
    const lines = group.map((signal) =>
      JSON.stringify({
        id: signal.id,
        source: signal.source,
        date: signal.date,
        geo: signal.geo,
        industryHint: signal.industryHint,
        sideHint: signal.sideHint,
        paraphrase: signal.paraphrase,
      }),
    )
    const output = await structuredCall({
      system: prompt.text,
      user: `${vocabulary()}\n\nSignals, one JSON object per line:\n${lines.join('\n')}`,
      schema: clusterOutputSchema,
    })
    for (const draft of output.candidates) {
      const record = {
        ...draft,
        key: `C${String(candidates.length + 1).padStart(3, '0')}`,
        signalIds: [...new Set(draft.signalIds.filter((id) => known.has(id)))],
        promptVersion: prompt.version,
        engine: 'api' as const,
      }
      const parsed = candidateSchema.safeParse(record)
      if (parsed.success) candidates.push(parsed.data)
      else
        console.warn(`dropped malformed draft "${draft.title}": ${parsed.error.issues[0]?.message}`)
    }
  }

  writeJson(PATHS.candidates, candidates)
  console.log(`Wrote ${candidates.length} candidates to ${PATHS.candidates}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
