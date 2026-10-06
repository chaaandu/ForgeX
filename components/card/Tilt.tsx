'use client'

import { useRef, type ReactNode } from 'react'

/**
 * Leans its child toward the pointer and tells the foil where the light is,
 * through --rx, --ry (degrees) and --mx, --my (0 to 1). Never moves under
 * reduced motion; touch gets no tilt, because a card that swims under your
 * thumb is worse than one that stays put.
 */
export function Tilt({ children, max = 12 }: { children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node || event.pointerType === 'touch') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = node.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    node.style.setProperty('--mx', x.toFixed(3))
    node.style.setProperty('--my', y.toFixed(3))
    node.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`)
    node.style.setProperty('--ry', `${((x - 0.5) * max).toFixed(2)}deg`)
    node.dataset.live = ''
  }

  function leave() {
    const node = ref.current
    if (!node) return
    for (const [name, value] of [
      ['--rx', '0deg'],
      ['--ry', '0deg'],
      ['--mx', '0.5'],
      ['--my', '0.3'],
    ] as const) {
      node.style.setProperty(name, value)
    }
    delete node.dataset.live
  }

  return (
    <div ref={ref} className="fc-tilt" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  )
}
