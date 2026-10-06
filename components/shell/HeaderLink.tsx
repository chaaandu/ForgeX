import Link from 'next/link'
import type { ReactNode } from 'react'

/** A secondary button for a page header: icon always, words from a tablet up. */
export function HeaderLink({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="btn btn-secondary press min-h-10 gap-2 px-3 text-[13px] sm:px-4"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )
}
