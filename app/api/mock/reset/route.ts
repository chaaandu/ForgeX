import { NextResponse } from 'next/server'
import { memory } from '@/lib/store/memory'
import { isMock } from '@/lib/store/mode'

/** Puts the in-memory Sheet back to its seed. Exists only in mock mode. */
export async function POST() {
  if (!isMock()) return new NextResponse('Not found', { status: 404 })
  memory().reset()
  return NextResponse.json({ ok: true })
}
