'use client'

import { problemSchema } from './schema'
import type { Problem } from './types'

/**
 * Problem detail, fetched once and kept for the session. Cards warm this on
 * hover and focus, so by the time a card is clicked the modal usually has its
 * content already and never shows a skeleton.
 */

const cache = new Map<string, Problem>()
const inFlight = new Map<string, Promise<Problem | null>>()

export function cached(problemId: string): Problem | undefined {
  return cache.get(problemId)
}

export function fetchProblem(problemId: string): Promise<Problem | null> {
  const have = cache.get(problemId)
  if (have) return Promise.resolve(have)

  const running = inFlight.get(problemId)
  if (running) return running

  const request = fetch(`/api/problem/${problemId}`)
    .then((response) => (response.ok ? response.json() : null))
    .then((body: unknown) => {
      if (!body || typeof body !== 'object') return null
      const parsed = problemSchema.safeParse((body as { problem: unknown }).problem)
      if (!parsed.success) return null
      cache.set(parsed.data.id, parsed.data)
      return parsed.data
    })
    .catch(() => null)
    .finally(() => inFlight.delete(problemId))

  inFlight.set(problemId, request)
  return request
}

/** Called from hover and focus. Failures are silent on purpose. */
export function prefetchProblem(problemId: string): void {
  if (cache.has(problemId) || inFlight.has(problemId)) return
  void fetchProblem(problemId)
}
