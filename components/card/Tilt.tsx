'use client'

import { useRef, type ReactNode } from 'react'

/**
 * Tells the card's foil and glare where the light is, through --mx and --my
 * (0 to 1). The card itself never moves: the light does. Touch and reduced
 * motion leave it at rest.
 */
export function Tilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node || event.pointerType === 'touch') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = node.getBoundingClientRect()
    node.style.setProperty('--mx', ((event.clientX - box.left) / box.width).toFixed(3))
    node.style.setProperty('--my', ((event.clientY - box.top) / box.height).toFixed(3))
  }

  function leave() {
    ref.current?.style.setProperty('--mx', '0.5')
    ref.current?.style.setProperty('--my', '0.3')
  }

  return (
    <div ref={ref} className="fc-tilt" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  )
}
