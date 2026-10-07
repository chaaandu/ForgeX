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
    if (field === 'portfolio')
      return parsed.hostname.replace(/^www\./, '') + parsed.pathname.replace(/\/$/, '')
    const last = parsed.pathname.split('/').filter(Boolean).pop() ?? ''
    return last ? `@${last.replace(/^@/, '')}` : parsed.hostname
  } catch {
    return url
  }
}

/**
 * Links to a founder's work: a repo, a live app, a design, a video, a doc, a
 * screenshot. Each kind is checked for the place it should live, so a GitHub
 * profile can't stand in for a repo, or a private file for a video.
 */
export const WORK_LINK_KINDS = ['github', 'live', 'design', 'video', 'doc', 'screenshot'] as const
export type WorkLinkKind = (typeof WORK_LINK_KINDS)[number]

const DRIVE = ['drive.google.com', 'docs.google.com']

const WORK_HOSTS: Record<WorkLinkKind, string[] | null> = {
  github: ['github.com'],
  live: null,
  design: ['figma.com', ...DRIVE],
  video: ['youtube.com', 'youtu.be', 'loom.com', ...DRIVE],
  doc: null,
  screenshot: DRIVE,
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
  // A repo is github.com/owner/name, not a profile.
  if (kind === 'github' && url.pathname.split('/').filter(Boolean).length < 2) return null
  url.hash = ''
  // Keep the query for videos and Drive (it can carry the file), drop it elsewhere.
  if (kind === 'github' || kind === 'live') url.search = ''
  return url.toString().replace(/\/$/, '')
}

/** How a work link reads on a page: the host and path, without the scheme. */
export function workLabel(url: string): string {
  try {
    const parsed = new URL(url)
    const path = parsed.pathname.replace(/\/$/, '')
    const label = parsed.hostname.replace(/^www\./, '') + path
    return label.length > 48 ? `${label.slice(0, 47)}…` : label
  } catch {
    return url
  }
}
