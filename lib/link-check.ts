import 'server-only'
import { isMock } from '@/lib/store/mode'

/**
 * Whether a link opens for someone who is not signed in: a judge, a classmate,
 * the team. Asked once when a founder saves a link, and only ever a warning:
 * a site that is slow today must never stop a founder from submitting.
 */
export type LinkHealth = 'open' | 'private' | 'broken' | 'unknown'

const onHost = (host: string, allowed: string) => host === allowed || host.endsWith(`.${allowed}`)

/** Hosts that refuse anyone who is not a browser, so their answer means nothing. */
const UNCHECKABLE = ['linkedin.com', 'lnkd.in']

/**
 * The verdict from what came back. Google sends anyone without access to its
 * sign-in page; GitHub answers a private repo with a 404, as it does a missing one.
 */
export function classify(url: string, status: number, finalUrl: string): LinkHealth {
  let host = ''
  let landed = ''
  try {
    host = new URL(url).hostname.toLowerCase()
    landed = new URL(finalUrl || url).hostname.toLowerCase()
  } catch {
    return 'broken'
  }
  if (onHost(landed, 'accounts.google.com') || /servicelogin|\/signin|\/login/i.test(finalUrl))
    return 'private'
  if (onHost(host, 'github.com') && status === 404) return 'private'
  if (status === 401 || status === 403) return 'private'
  if (status >= 200 && status < 400) return 'open'
  if (status === 404 || status === 410 || status >= 500) return 'broken'
  return 'unknown'
}

export async function checkLink(url: string): Promise<LinkHealth> {
  // Tests and the local demo use made-up links; asking the internet about them proves nothing.
  if (isMock() && process.env.CHECK_LINKS !== 'true') return 'unknown'
  let host = ''
  try {
    host = new URL(url).hostname.toLowerCase()
  } catch {
    return 'broken'
  }
  if (UNCHECKABLE.some((item) => onHost(host, item))) return 'unknown'
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(4000),
      headers: { 'user-agent': 'Mozilla/5.0 (ForgeX link check)' },
      cache: 'no-store',
    })
    return classify(url, response.status, response.url)
  } catch (error) {
    // A name that does not resolve is a broken link; a slow site is only unknown.
    return error instanceof Error && error.name === 'TimeoutError' ? 'unknown' : 'broken'
  }
}

/** Several links at once, keyed as given. Only the ones worth a warning come back. */
export async function linkWarnings<K extends string>(
  links: Partial<Record<K, string>>,
): Promise<Partial<Record<K, LinkHealth>>> {
  const pairs = await Promise.all(
    (Object.entries(links) as [K, string | undefined][])
      .filter((pair): pair is [K, string] => Boolean(pair[1]))
      .flatMap(([key, value]) => value.split('\n').map((url) => [key, url] as const))
      .map(async ([key, url]) => [key, await checkLink(url)] as const),
  )
  const out: Partial<Record<K, LinkHealth>> = {}
  for (const [key, health] of pairs) {
    if (health === 'private' || health === 'broken') out[key] = health
  }
  return out
}
