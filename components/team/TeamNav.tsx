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
  ]
  return (
    <nav aria-label="Console" className="flex gap-1">
      {items.map((item) => {
        const active = item.href === '/team' ? path === '/team' : path.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`press inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 text-[14px] ${active ? 'bg-white/10 text-ink-1' : 'text-ink-2 hover:text-ink-1'}`}
          >
            {item.label}
            {item.count ? <span className="rounded-full bg-pink px-1.5 font-mono text-[11px] leading-[18px] text-on-pink">{item.count}</span> : null}
          </Link>
        )
      })}
    </nav>
  )
}
