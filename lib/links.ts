/**
 * Where a founder can be found. Normalised on the server, never on the client.
 *
 * Founders paste all of: a full URL, a bare handle, an @handle, a profile path
 * with tracking on the end. All of them should work, and none of them should
 * be able to put a `javascript:` anywhere near an href.
 */
export const LINK_FIELDS = ['github', 'linkedin', 'portfolio'] as const

export type LinkField = (typeof LINK_FIELDS)[number]

export const LINK_KINDS: Record<LinkField, { host: string; prefix: string }> = {
  github: { host: 'github.com', prefix: 'https://github.com/' },
  linkedin: { host: 'linkedin.com', prefix: 'https://www.linkedin.com/in/' },
  portfolio: { host: '', prefix: 'https://' },
}

/** A bare handle has to look like one, or anything gets pasted onto a profile URL. */
const HANDLE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,38}$/

export function normaliseLink(field: LinkField, raw: string): string | null {
  const value = raw.trim().replace(/^@/, '')
  if (!value) return null

  const kind = LINK_KINDS[field]
  const handle = value.replace(/^\/+/, '').replace(/\/+$/, '')

  const withScheme = /^https?:\/\//i.test(value)
    ? value
    : /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(value)
      ? `https://${value}`
      : field !== 'portfolio' && HANDLE.test(handle)
        ? `${kind.prefix}${handle}`
        : ''

  if (!withScheme) return null

  let url: URL
  try {
    url = new URL(withScheme)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  const host = url.hostname.toLowerCase()
  if (kind.host && host !== kind.host && !host.endsWith(`.${kind.host}`)) return null
  if (!kind.host && !host.includes('.')) return null

  url.search = ''
  url.hash = ''
  return url.toString().replace(/\/$/, '')
}

/** How a saved link reads: `@handle` for profiles, the bare host for a portfolio. */
export function linkLabel(field: LinkField, url: string): string {
  try {
    const parsed = new URL(url)
    if (field === 'portfolio') return parsed.hostname.replace(/^www\./, '') + parsed.pathname.replace(/\/$/, '')
    const last = parsed.pathname.split('/').filter(Boolean).pop() ?? ''
    return last ? `@${last.replace(/^@/, '')}` : parsed.hostname
  } catch {
    return url
  }
}

/**
 * Links to what a founder built: the repo, the live app, the pitch deck, the
 * post about it and the demo video. Each kind is checked for the place it
 * should live, so a GitHub profile cannot stand in for a repo, or a file on
 * someone's laptop for a deck the judges can open.
 */
export const WORK_LINK_KINDS = [
  'github',
  'live',
  'deck',
  'doc',
  'post',
  'video',
  'proof',
  'research',
] as const
export type WorkLinkKind = (typeof WORK_LINK_KINDS)[number]

const WORK_HOSTS: Record<WorkLinkKind, string[] | null> = {
  github: ['github.com'],
  live: null,
  // Google Docs, Slides or a Drive file: one format, so every deck opens the same way.
  deck: ['docs.google.com', 'drive.google.com'],
  // Documentation: a Google Doc or a Drive file or folder, open to anyone with the link.
  doc: ['docs.google.com', 'drive.google.com'],
  post: ['linkedin.com', 'lnkd.in'],
  // The demo is a Loom: one place for the team to watch all 117.
  video: ['loom.com'],
  // Proof of a prototype: a live link, a Drive folder of screenshots, a screen recording.
  proof: null,
  // Research: interview recordings and notes, wherever they live.
  research: null,
}

const onHost = (host: string, allowed: string) => host === allowed || host.endsWith(`.${allowed}`)

export function normaliseWorkLink(kind: WorkLinkKind, raw: string): string | null {
  const value = raw.trim()
  if (!value) return null
  const withScheme = /^https?:\/\//i.test(value)
    ? value
    : /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(value)
      ? `https://${value}`
      : ''
  if (!withScheme) return null
  let url: URL
  try {
    url = new URL(withScheme)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  const host = url.hostname.toLowerCase()
  if (!host.includes('.')) return null
  const allowed = WORK_HOSTS[kind]
  if (allowed && !allowed.some((item) => onHost(host, item))) return null
  const parts = url.pathname.split('/').filter(Boolean)
  // A repo is github.com/owner/name, not a profile.
  if (kind === 'github' && parts.length < 2) return null
  // The live link is the product, not its code or a file about it.
  if (kind === 'live' && ['github.com', 'docs.google.com', 'drive.google.com', 'loom.com'].some((item) => onHost(host, item))) return null
  // A post, not a profile or the home feed.
  if (kind === 'post' && onHost(host, 'linkedin.com') && (parts[0] === 'in' || parts.length < 2)) return null
  if ((kind === 'deck' || kind === 'doc' || kind === 'video') && parts.length < 2) return null
  url.hash = ''
  // Keep the query for decks and videos (it can carry the file), drop it elsewhere.
  if (kind === 'github' || kind === 'live' || kind === 'post') url.search = ''
  return url.toString().replace(/\/$/, '')
}

/** How a work link reads on a page: the host and path, without the scheme. */
export function workLabel(url: string): string {
  try {
    const parsed = new URL(url)
    const path = parsed.pathname.replace(/\/$/, '')
    const label = parsed.hostname.replace(/^www\./, '') + path
    return label.length > 44 ? `${label.slice(0, 43)}…` : label
  } catch {
    return url
  }
}
