import { cardPng } from '@/lib/card-image'
import { founderBySlug } from '@/lib/data/founders'
import { getViewer } from '@/lib/session'

/**
 * The founder card as a PNG, to download or attach. The founder can fetch
 * their own; the team can fetch anyone's. The public preview is /api/og.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const viewer = await getViewer()
  if (!viewer) return new Response('Sign in first', { status: 401 })
  const { slug } = await params
  const founder = await founderBySlug(slug)
  if (!founder || (viewer.role !== 'team' && viewer.email !== founder.email)) {
    return new Response('Not found', { status: 404 })
  }
  const png = await cardPng(founder)
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'private, max-age=60' },
  })
}
