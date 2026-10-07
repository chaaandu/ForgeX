'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { consoleCopy as copy } from '@/content/copy'

export function TeamNav({ waiting, drafts }: { waiting: number; drafts: number }) {
  const path = usePathname()
  const items = [
    { href: '/team', label: copy.nav.founders, count: null },
    { href: '/team/queue', label: copy.nav.queue, count: waiting },
    { href: '/team/bank', label: copy.nav.bank, count: drafts },
    { href: '/team/setup', label: copy.nav.setup, count: null },
  ]
  return (
    <nav aria-label={copy.nav.label} className="flex gap-1">
      {items.map((item) => {
        const active = item.href === '/team' ? path === '/team' : path.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`press inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 text-[14px] ${active ? 'text-ink-1 bg-white/10' : 'text-ink-2 hover:text-ink-1'}`}
          >
            {item.label}
            {item.count ? (
              <span className="bg-violet text-on-violet rounded-full px-1.5 font-mono text-[11px] leading-[18px]">
                {item.count}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
