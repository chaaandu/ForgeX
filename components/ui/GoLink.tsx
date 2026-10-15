'use client'

import Link, { useLinkStatus } from 'next/link'
import type { ReactNode } from 'react'

function Label({ children, pending }: { children: ReactNode; pending: string }) {
  const status = useLinkStatus()
  return (
    <span aria-live="polite" className={status.pending ? 'animate-pulse' : undefined}>
      {status.pending ? pending : children}
    </span>
  )
}

/**
 * A primary link that says so while the next page loads, so a tap on a slow
 * connection never looks like nothing happened.
 */
export function GoLink({
  href,
  className,
  pending,
  children,
}: {
  href: string
  className: string
  /** What it reads while the page is on its way. */
  pending: string
  children: ReactNode
}) {
  return (
    <Link href={href} className={className}>
      <Label pending={pending}>{children}</Label>
    </Link>
  )
}
