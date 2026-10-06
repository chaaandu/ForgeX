'use client'

import { useRef, type ReactNode } from 'react'

/** Tracks the pointer over a region as --px / --py in pixels, for a light that follows it. */
export function Pointer({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(event) => {
        const node = ref.current
        if (!node) return
        const box = node.getBoundingClientRect()
        node.style.setProperty('--px', `${event.clientX - box.left}px`)
        node.style.setProperty('--py', `${event.clientY - box.top}px`)
      }}
    >
      {children}
    </div>
  )
}
