import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { pinClock } from '@/lib/hackathon'
import { memory } from '@/lib/store/memory'
import { isMock } from '@/lib/store/mode'

/**
 * Puts the in-memory Sheet back to its seed. Exists only in mock mode.
 * `?demo=1` brings back the demo founders who are already building.
 * `?now=2026-10-23T13:05:00+05:30` moves the clock instead, keeping the data,
 * to stand before launch, after picks lock or past the hard stop.
 */
export async function POST(request: Request) {
  if (!isMock()) return new NextResponse('Not found', { status: 404 })
  const params = new URL(request.url).searchParams
  const now = params.get('now')
  if (now) {
    pinClock(now)
    return NextResponse.json({ ok: true, now })
  }
  pinClock(null)
  memory().reset(params.get('demo') === '1')
  revalidatePath('/')
  return NextResponse.json({ ok: true })
}
