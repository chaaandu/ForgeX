'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { home as copy } from '@/content/copy'

/** Home, their own problem (unless it came from the bank), and their profile. */
export function BuildNav({ slug, ownProblem }: { slug: string; ownProblem: boolean }) {
  const path = usePathname()
  const items = [
    { href: '/build', label: copy.nav.home },
    ...(ownProblem ? [{ href: '/problem', label: copy.nav.problem }] : []),
    { href: `/f/${slug}`, label: copy.nav.profile },
  ]
  return (
    <nav aria-label={copy.nav.label} className="flex gap-1">
      {items.map((item) => {
        const active = path === item.href || (item.href === '/build' && path.startsWith('/submit'))
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`press inline-flex min-h-9 items-center rounded-full px-3.5 text-[14px] no-underline ${active ? 'text-ink-1 bg-white/10' : 'text-ink-2 hover:text-ink-1'}`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
