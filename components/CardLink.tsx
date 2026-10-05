'use client'

import { prefetchProblem } from '@/lib/problem-cache'
import { useModal } from './ModalState'

/**
 * The whole card is one control. It stays a real anchor so the address is
 * copyable and middle click still opens a tab, but a plain click opens the
 * modal without touching the router.
 */
export function CardLink({
  href,
  problemId,
  label,
  accent,
  children,
}: {
  href: string
  problemId: string
  label: string
  /** The problem's tag colour, used for the hover border. */
  accent: string
  children: React.ReactNode
}) {
  const { open } = useModal()
  return (
    <a
      href={href}
      data-card-id={problemId}
      aria-label={label}
      onPointerEnter={() => prefetchProblem(problemId)}
      onFocus={() => prefetchProblem(problemId)}
      style={{ '--accent': accent } as React.CSSProperties}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        open(problemId)
      }}
      className="card-accent group border-line bg-surface relative flex h-full flex-col gap-3 rounded-[16px] border p-5 transition-[transform,border-color,background-color] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#141417] focus-visible:-translate-y-0.5 active:translate-y-0 active:duration-75"
    >
      {children}
    </a>
  )
}
