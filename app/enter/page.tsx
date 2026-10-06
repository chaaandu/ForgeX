import { redirect } from 'next/navigation'
import { founderByEmail } from '@/lib/data/founders'
import { currentPath } from '@/lib/journey'
import { getViewer } from '@/lib/session'

/**
 * Where Enter and sign-in go. The landing is static so it can be served from
 * the edge in a blink; this is the one place that looks at who you are and
 * sends you to the furthest level you reached, the console, or sign-in. A
 * page rather than a route handler, so it redirects the same way whether it
 * is reached by a full load or by the client router after signing in.
 */
export const dynamic = 'force-dynamic'

export default async function Enter() {
  const viewer = await getViewer()
  if (!viewer) redirect('/login')
  if (viewer.role === 'team') redirect('/team')
  const founder = await founderByEmail(viewer.email)
  redirect(founder ? currentPath(founder) : '/login')
}
