import { NextResponse } from 'next/server'
import { getSnapshot } from '@/lib/backend'
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

  const { problems } = await getSnapshot()
  const problem = problems.find((candidate) => candidate.id === parsed.data)
  if (!problem) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json({ problem }, { headers: { 'Cache-Control': 'private, max-age=300' } })
}
