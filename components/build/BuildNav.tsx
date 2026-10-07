'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { plan as copy } from '@/content/copy'

/** The founder's home, once they're building. Pills, like the console's, so nothing new to learn. */
export function BuildNav({ slug, pod }: { slug: string; pod: boolean }) {
  const path = usePathname()
  const items = [
    { href: '/today', label: copy.nav.today },
    { href: '/plan', label: copy.nav.plan },
    { href: '/stops', label: copy.nav.stops },
    { href: '/messages', label: copy.nav.messages },
    ...(pod ? [{ href: '/pod', label: copy.nav.pod }] : []),
    { href: `/f/${slug}`, label: copy.nav.profile },
  ]
  return (
    <nav
      aria-label={copy.nav.label}
      className="quiet-scroll -mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:px-0"
    >
      {items.map((item) => {
        const active = path === item.href || path.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`press inline-flex min-h-9 shrink-0 items-center rounded-full px-3.5 text-[14px] no-underline ${active ? 'text-ink-1 bg-white/10' : 'text-ink-2 hover:text-ink-1'}`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
