'use client'

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
  children,
}: {
  href: string
  problemId: string
  label: string
  children: React.ReactNode
}) {
  const { open } = useModal()
  return (
    <a
      href={href}
      data-card-id={problemId}
      aria-label={label}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        open(problemId)
      }}
      className="group border-line bg-surface relative flex h-full flex-col gap-3 rounded-[16px] border p-5 transition-[transform,border-color,background-color] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-white/15 hover:bg-[#141417] focus-visible:-translate-y-0.5"
    >
      {children}
    </a>
  )
}
