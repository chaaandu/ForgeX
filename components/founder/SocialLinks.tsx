import { AppWindow, Globe } from 'lucide-react'
import { page } from '@/content/copy'

const copy = page.social

/** GitHub's mark. Lucide no longer ships brand icons, so the two marks are drawn here. */
function GitHubMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

/** LinkedIn's mark. */
function LinkedInMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

/**
 * Where to find a founder, as a row of round icons beside their name, the
 * way a social profile shows them: GitHub, LinkedIn, the app they built, and
 * their own site. Only the ones they have added appear.
 */
export function SocialLinks({
  name,
  github,
  linkedin,
  live,
  site,
}: {
  name: string
  github: string
  linkedin: string
  live: string
  site: string
}) {
  const links = [
    { href: github, label: copy.github(name), tip: copy.tips.github, icon: <GitHubMark /> },
    { href: linkedin, label: copy.linkedin(name), tip: copy.tips.linkedin, icon: <LinkedInMark /> },
    {
      href: live,
      label: copy.live(name),
      tip: copy.tips.live,
      icon: <AppWindow size={18} strokeWidth={1.5} aria-hidden="true" />,
    },
    {
      href: site,
      label: copy.site(name),
      tip: copy.tips.site,
      icon: <Globe size={18} strokeWidth={1.5} aria-hidden="true" />,
    },
  ].filter((link) => link.href)
  if (!links.length) return null
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label={copy.label(name)}>
      {links.map((link) => (
        <li key={link.label} className="group relative">
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className="press text-ink-1 hover:text-violet-ink grid size-10 place-items-center rounded-full bg-white/[0.06] shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:bg-white/10"
          >
            {link.icon}
          </a>
          {/* A small label above the icon on hover or keyboard focus, as social apps show it. */}
          <span
            aria-hidden="true"
            className="bg-s3 text-ink-1 pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 rounded-md px-2 py-1 text-[12px] font-medium whitespace-nowrap opacity-0 shadow-[0_0_0_1px_var(--color-line-2)] transition duration-150 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
          >
            {link.tip}
          </span>
        </li>
      ))}
    </ul>
  )
}
