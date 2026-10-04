import problemsJson from '@/data/problems.json'
import type { ActionResult } from '@/lib/schema'
import { isClosed } from '@/lib/time'
import type { BetMap, Problem } from '@/lib/types'

/**
 * The in-memory stand-in for the Sheet. It enforces exactly the rules the Apps
 * Script enforces, so the whole UI can be built and tested without Google.
 */

const problems = problemsJson as Problem[]
const byId = new Map(problems.map((problem) => [problem.id, problem]))

/** Survives hot reloads so a bet placed in dev does not vanish on save. */
const store: { bets: BetMap } = ((
  globalThis as { __forgexMock?: { bets: BetMap } }
).__forgexMock ??= { bets: {} })

function clone(): BetMap {
  return JSON.parse(JSON.stringify(store.bets)) as BetMap
}

function heldBy(email: string): string | undefined {
  return Object.keys(store.bets).find((id) => store.bets[id]?.email === email)
}

export function mockProblems(): Problem[] {
  return problems
}

export function mockBets(): BetMap {
  return clone()
}

export function mockReset(seed: BetMap = {}): void {
  store.bets = JSON.parse(JSON.stringify(seed)) as BetMap
}

export function mockBet(input: {
  email: string
  name: string
  photo: string
  problemId: string
}): ActionResult {
  if (isClosed()) return { ok: false, error: 'closed' }
  if (!byId.has(input.problemId)) return { ok: false, error: 'not_found' }

  const holder = store.bets[input.problemId]
  if (holder) {
    if (holder.email === input.email) return { ok: true, bets: clone() }
    return { ok: false, error: 'taken', by: holder.name }
  }

  const previous = heldBy(input.email)
  if (previous) delete store.bets[previous]

  store.bets[input.problemId] = {
    name: input.name,
    email: input.email,
    photo: input.photo,
    at: new Date().toISOString(),
  }
  return { ok: true, bets: clone() }
}

export function mockRelease(input: { email: string; problemId: string }): ActionResult {
  if (isClosed()) return { ok: false, error: 'closed' }
  const holder = store.bets[input.problemId]
  if (holder && holder.email === input.email) delete store.bets[input.problemId]
  return { ok: true, bets: clone() }
}
