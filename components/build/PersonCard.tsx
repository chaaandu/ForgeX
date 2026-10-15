import type { ReactNode } from 'react'
import { home as copy } from '@/content/copy'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')

/**
 * A person a founder can go to, drawn as a person: a round badge with their
 * initials, what they are to the founder, their name, and a line under it.
 */
export function PersonCard({
  name,
  kicker = copy.pocKicker,
  children,
}: {
  /** Empty while there is no one to name yet. */
  name: string
  kicker?: string
  children?: ReactNode
}) {
  return (
    <section className="panel grid gap-3 p-5" aria-label={kicker}>
      <div className="flex items-center gap-3.5">
        <span
          aria-hidden="true"
          className="bg-violet/20 text-violet-ink grid size-11 shrink-0 place-items-center rounded-full font-mono text-[14px] font-medium shadow-[inset_0_0_0_1px_rgb(124_77_204/0.45)]"
        >
          {name ? initials(name) : '?'}
        </span>
        <div className="grid min-w-0 gap-0.5">
          <span className="meta text-[11px]">{kicker}</span>
          <span className="display user-text text-[22px] leading-tight">
            {name || copy.pocUnknown}
          </span>
        </div>
      </div>
      {children ? <div className="text-ink-2 text-[14px] leading-relaxed">{children}</div> : null}
    </section>
  )
}
