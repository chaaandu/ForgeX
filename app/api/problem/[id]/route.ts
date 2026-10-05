import { NextResponse } from 'next/server'
import { getProblem } from '@/lib/backend'
import { problemIdSchema } from '@/lib/schema'
import { getViewer } from '@/lib/session'

export const dynamic = 'force-dynamic'

/** One problem in full, for the modal. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const viewer = await getViewer()
  if (!viewer) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { id } = await context.params
  const parsed = problemIdSchema.safeParse(id)
  if (!parsed.success) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  // Straight from memory, so opening a card never waits on the Sheet.
  const problem = getProblem(parsed.data)
  if (!problem) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json({ problem }, { headers: { 'Cache-Control': 'private, max-age=300' } })
}
