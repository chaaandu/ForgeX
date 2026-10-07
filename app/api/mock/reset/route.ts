import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { memory } from '@/lib/store/memory'
import { isMock } from '@/lib/store/mode'

/**
 * Puts the in-memory Sheet back to its seed. Exists only in mock mode.
 * `?demo=1` brings back the eight demo founders who already have a go.
 */
export async function POST(request: Request) {
  if (!isMock()) return new NextResponse('Not found', { status: 404 })
  memory().reset(new URL(request.url).searchParams.get('demo') === '1')
  revalidatePath('/')
  return NextResponse.json({ ok: true })
}
