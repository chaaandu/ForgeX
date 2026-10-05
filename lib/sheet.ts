import 'server-only'
import {
  dataResponseSchema,
  errorResponseSchema,
  sheetResponseSchema,
  writeResponseSchema,
  type ActionResult,
} from './schema'
import type { BetMap, Problem } from './types'

const TIMEOUT_MS = 10_000

export class SheetUnreachable extends Error {
  constructor(cause?: unknown) {
    super('apps script unreachable')
    this.name = 'SheetUnreachable'
    this.cause = cause
  }
}

type Payload = Record<string, string>

/**
 * One POST to the Apps Script web app. Apps Script answers with a 302 to
 * script.googleusercontent.com, so redirects are followed. Ten second timeout,
 * one retry, and every response parsed through Zod before it goes anywhere.
 */
async function post(action: string, payload: Payload = {}): Promise<unknown> {
  const url = process.env.APPS_SCRIPT_URL
  const secret = process.env.APPS_SCRIPT_SECRET
  if (!url || !secret) throw new SheetUnreachable('APPS_SCRIPT_URL or APPS_SCRIPT_SECRET is unset')

  const body = JSON.stringify({ secret, action, ...payload })

  let lastError: unknown
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const response = await fetch(url, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow',
        cache: 'no-store',
        signal: controller.signal,
      })
      if (!response.ok) throw new Error(`apps script responded ${response.status}`)
      return sheetResponseSchema.parse(await response.json())
    } catch (error) {
      lastError = error
    } finally {
      clearTimeout(timer)
    }
  }
  throw new SheetUnreachable(lastError)
}

/** Everything the grid needs in one call. Throws SheetUnreachable so callers can fall back. */
export async function fetchData(): Promise<{ problems: Problem[]; bets: BetMap }> {
  const raw = await post('data')
  const failure = errorResponseSchema.safeParse(raw)
  if (failure.success) throw new SheetUnreachable(failure.data.error)
  const parsed = dataResponseSchema.parse(raw)
  return { problems: parsed.problems, bets: parsed.bets }
}

function toActionResult(raw: unknown): ActionResult {
  const failure = errorResponseSchema.safeParse(raw)
  if (failure.success) {
    const known = ['taken', 'closed', 'not_found', 'forbidden'] as const
    const error = known.find((value) => value === failure.data.error) ?? 'unknown'
    return { ok: false, error, by: failure.data.by }
  }
  const ok = writeResponseSchema.parse(raw)
  return { ok: true, bets: ok.bets ?? {} }
}

/** The Sheet only needs to know who, so the photo stays out of it. */
export async function sheetBet(input: {
  email: string
  name: string
  problemId: string
}): Promise<ActionResult> {
  return toActionResult(await post('bet', input))
}

export async function sheetRelease(input: {
  email: string
  problemId: string
}): Promise<ActionResult> {
  return toActionResult(await post('release', input))
}
