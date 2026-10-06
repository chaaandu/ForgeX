import { founderByEmail } from '@/lib/data/founders'
import { currentPath } from '@/lib/journey'
import { getViewer } from '@/lib/session'

/**
 * Where Enter goes. The landing is static so it can be served from the edge
 * in a blink; this is the one place that looks at who you are and sends you
 * to your level, the console, or sign-in.
 *
 * The redirect is relative on purpose: an absolute one is built from the
 * server's idea of its host, which behind a proxy or on 127.0.0.1 is not
 * always the host the browser used, and the session cookie stays behind.
 */
export async function GET() {
  const viewer = await getViewer()
  const to = (path: string) => new Response(null, { status: 307, headers: { Location: path, 'Cache-Control': 'no-store' } })
  if (!viewer) return to('/login')
  if (viewer.role === 'team') return to('/team')
  const founder = await founderByEmail(viewer.email)
  return to(founder ? currentPath(founder) : '/login')
}
