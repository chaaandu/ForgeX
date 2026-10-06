/**
 * The one place the pipeline talks to the Anthropic API. Used by cluster.ts
 * and score.ts only when ANTHROPIC_API_KEY is set; without it those steps are
 * run by the research agent following the same prompt files.
 */

import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import type { z } from 'zod'

export const MODEL = 'claude-opus-5-5'

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

export function explainNoKey(step: string, writes: string): void {
  console.log(
    [
      `${step}: ANTHROPIC_API_KEY is not set, so this step is run by the research agent.`,
      `The agent follows the same prompt in scripts/research/prompts/ and writes ${writes},`,
      'recording the prompt version in each record. Set ANTHROPIC_API_KEY to run it here instead.',
    ].join('\n'),
  )
}

let client: Anthropic | undefined

/**
 * One structured-output call. Streams (outputs can be long), asks for JSON
 * matching `schema`, and validates the answer with the same Zod schema.
 * Server-side fallback is on, so a refusal on one model is retried on another
 * inside the same call.
 */
export async function structuredCall<T>(options: {
  system: string
  user: string
  schema: z.ZodType<T>
  maxTokens?: number
}): Promise<T> {
  client ??= new Anthropic()
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: options.maxTokens ?? 64000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high', format: betaZodOutputFormat(options.schema) },
    system: options.system,
    messages: [{ role: 'user', content: options.user }],
  })
  const message = await stream.finalMessage()
  if (message.stop_reason === 'refusal') throw new Error('The model declined this request.')
  if (message.stop_reason === 'max_tokens') {
    throw new Error('The answer was cut off at max_tokens; use smaller batches.')
  }
  const text = message.content
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('')
    .trim()
  return options.schema.parse(JSON.parse(text))
}
