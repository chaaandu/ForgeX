import { share as copy } from '@/content/copy'
import { previewPng } from '@/lib/card-image'
import { founderBySlug } from '@/lib/data/founders'
import { shareable } from '@/lib/share'

/**
 * The link preview for a shared card, public so WhatsApp, LinkedIn and the
 * rest can fetch it. It shows only what the landing already does.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const shared = await shareable(await founderBySlug((await params).slug))
  if (!shared) return new Response('Not found', { status: 404 })
  const png = await previewPng(shared.founder, {
    title: shared.founder.name,
    line: shared.line,
    footer: copy.footer,
  })
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    },
  })
}
