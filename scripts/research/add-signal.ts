/**
 * Validates signals and appends them to a JSONL file under data/research/raw.
 * The ID is computed from the source and URL, so the same page can never be
 * counted twice.
 *
 * One signal:
 *   pnpm tsx scripts/research/add-signal.ts web-reddit.jsonl --source reddit \
 *     --url https://... --date 2026-03-14 --geo IN \
 *     --paraphrase "Kirana owners redo stock counts by hand every week" \
 *     [--industry retail] [--side business]
 *
 * Many signals, from a JSON array or a JSONL file (or `-` for stdin), each
 * shaped like a Signal without its id:
 *   pnpm tsx scripts/research/add-signal.ts web-reddit.jsonl --from batch.json
 *
 * Exits 1 if any signal was invalid; valid ones are still appended.
 */

import { readFileSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'
import { z } from 'zod'
import { RAW_DIR, appendSignals, arg, type SignalInput } from './lib'
import { SOURCES } from './schema'

const inputSchema = z.object({
  source: z.enum(SOURCES),
  url: z.string(),
  date: z.string(),
  paraphrase: z.string(),
  industryHint: z.string().optional(),
  sideHint: z.string().optional(),
  geo: z.string(),
})

function parseInputs(raw: string): unknown[] {
  const trimmed = raw.trim()
  if (trimmed.startsWith('[')) return z.array(z.unknown()).parse(JSON.parse(trimmed))
  return trimmed
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as unknown)
}

function main(): void {
  const target = process.argv[2]
  if (!target || target.startsWith('--')) {
    console.error(
      'Usage: add-signal.ts <file.jsonl> (--from <json|jsonl|-> | --source ... --url ...)',
    )
    process.exit(1)
  }
  const file = isAbsolute(target) ? target : join(RAW_DIR, target)

  let raws: unknown[]
  const from = arg('from')
  if (from) {
    raws = parseInputs(readFileSync(from === '-' ? 0 : from, 'utf8'))
  } else {
    raws = [
      {
        source: arg('source'),
        url: arg('url'),
        date: arg('date'),
        paraphrase: arg('paraphrase'),
        industryHint: arg('industry'),
        sideHint: arg('side'),
        geo: arg('geo') ?? 'global',
      },
    ]
  }

  const inputs: SignalInput[] = []
  let shapeErrors = 0
  raws.forEach((raw, index) => {
    const parsed = inputSchema.safeParse(raw)
    if (!parsed.success) {
      shapeErrors++
      console.error(`#${index}: ${parsed.error.issues.map((issue) => issue.message).join('; ')}`)
      return
    }
    // The strict checks (taxonomy IDs, date shape, word count) happen in appendSignals.
    inputs.push(parsed.data as SignalInput)
  })

  const { added, duplicates, invalid } = appendSignals(file, inputs)
  for (const { input, message } of invalid) console.error(`invalid ${input.url}: ${message}`)
  console.log(
    `${file}: ${added.length} added, ${duplicates} duplicate, ${invalid.length + shapeErrors} invalid`,
  )
  if (invalid.length + shapeErrors > 0) process.exit(1)
}

main()
