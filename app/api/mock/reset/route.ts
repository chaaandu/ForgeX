import { NextResponse } from 'next/server'
import { isMock } from '@/lib/backend'
import { mockReset } from '@/lib/backend/mock'
import { betMapSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic'

/**
 * Clears the in-memory store so a test run starts from a known board.
 * Only ever reachable in mock mode.
 */
export async function POST(request: Request) {
  if (!isMock()) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  let seed = {}
  try {
    const body: unknown = await request.json()
    seed = betMapSchema.parse(body)
  } catch {
    seed = {}
  }

  mockReset(seed)
  return NextResponse.json({ ok: true })
}
