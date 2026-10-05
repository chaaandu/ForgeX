import 'server-only'
import fallbackProblems from '@/data/problems.json'
import type { ActionResult } from '@/lib/schema'
import { fetchData, sheetBet, sheetRelease, SheetUnreachable } from '@/lib/sheet'
import { studentByEmail, studentByName } from '@/lib/students'
import type { BetMap, Problem } from '@/lib/types'
import { mockBet, mockBets, mockProblems, mockRelease } from './mock'

/**
 * The only module the app talks to. It picks mock mode or the Sheet, keeps the
 * problems list cached for five minutes and bet state for ten seconds, and
 * degrades to data/problems.json when Apps Script cannot be reached.
 */

export function isMock(): boolean {
  return process.env.MOCK_BACKEND === 'true'
}

/**
 * The Sheet stores the bettor's name and nothing else, so the email and the
 * face are filled in here from the roster. A bet placed by hand in the Sheet,
 * with no matching log row, still gets both.
 */
function enrich(bets: BetMap): BetMap {
  const out: BetMap = {}
  for (const [id, bet] of Object.entries(bets)) {
    const student = bet.email ? studentByEmail(bet.email) : studentByName(bet.name)
    out[id] = {
      name: bet.name,
      email: bet.email || student?.email || '',
      photo: bet.photo || student?.photo || '',
      at: bet.at,
    }
  }
  return out
}

const PROBLEMS_TTL_MS = 5 * 60_000
const BETS_TTL_MS = 10_000

type Cache = {
  problems: { value: Problem[]; at: number } | null
  bets: { value: BetMap; at: number } | null
}

const cache: Cache = ((globalThis as { __forgexCache?: Cache }).__forgexCache ??= {
  problems: null,
  bets: null,
})

function invalidateBets() {
  cache.bets = null
}

export type Snapshot = {
  problems: Problem[]
  bets: BetMap
  /** True when we are serving the local snapshot because the Sheet is unreachable. */
  degraded: boolean
}

async function refresh(): Promise<Snapshot> {
  const { problems, bets: raw } = await fetchData()
  const bets = enrich(raw)
  const now = Date.now()
  cache.problems = { value: problems, at: now }
  cache.bets = { value: bets, at: now }
  return { problems, bets, degraded: false }
}

export async function getSnapshot(): Promise<Snapshot> {
  if (isMock()) return { problems: mockProblems(), bets: mockBets(), degraded: false }

  const now = Date.now()
  const problems = cache.problems
  const bets = cache.bets
  if (problems && bets && now - problems.at < PROBLEMS_TTL_MS && now - bets.at < BETS_TTL_MS) {
    return { problems: problems.value, bets: bets.value, degraded: false }
  }

  try {
    return await refresh()
  } catch (error) {
    if (!(error instanceof SheetUnreachable)) throw error
    return {
      problems: cache.problems?.value ?? (fallbackProblems as Problem[]),
      bets: cache.bets?.value ?? {},
      degraded: true,
    }
  }
}

/** Bet state only, never older than ten seconds. */
export async function getBets(): Promise<{ bets: BetMap; degraded: boolean }> {
  if (isMock()) return { bets: mockBets(), degraded: false }
  const snapshot = await getSnapshot()
  return { bets: snapshot.bets, degraded: snapshot.degraded }
}

export async function placeBetOnBackend(input: {
  email: string
  name: string
  photo: string
  problemId: string
}): Promise<ActionResult> {
  if (isMock()) return mockBet(input)
  try {
    const result = await sheetBet({
      email: input.email,
      name: input.name,
      problemId: input.problemId,
    })
    invalidateBets()
    return result.ok ? { ok: true, bets: enrich(result.bets) } : result
  } catch (error) {
    if (error instanceof SheetUnreachable) return { ok: false, error: 'unreachable' }
    throw error
  }
}

export async function releaseBetOnBackend(input: {
  email: string
  problemId: string
}): Promise<ActionResult> {
  if (isMock()) return mockRelease(input)
  try {
    const result = await sheetRelease(input)
    invalidateBets()
    return result.ok ? { ok: true, bets: enrich(result.bets) } : result
  } catch (error) {
    if (error instanceof SheetUnreachable) return { ok: false, error: 'unreachable' }
    throw error
  }
}
