import { NextResponse } from 'next/server'
import { getBets, getChangesLeft } from '@/lib/backend'
import { betsRouteSchema } from '@/lib/schema'
import { getViewer } from '@/lib/session'
import { isClosed } from '@/lib/time'
import { visibleBets } from '@/lib/visibility'

export const dynamic = 'force-dynamic'

/** Bet state for the polling client. Students never see another student's email. */
export async function GET() {
  const viewer = await getViewer()
  if (!viewer) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { bets, degraded } = await getBets()
  const visible = visibleBets(viewer.role, viewer.email, bets)

  const body = betsRouteSchema.parse({
    bets: visible,
    closed: isClosed(),
    degraded,
    changesLeft: viewer.role === 'student' ? await getChangesLeft(viewer.email) : null,
  })
  return NextResponse.json(body, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
