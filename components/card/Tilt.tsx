'use client'

import { useRef, type ReactNode } from 'react'

/**
 * Leans the card toward the pointer, a few degrees, and tells the foil and
 * glare where the light is, through --rx, --ry (degrees) and --mx, --my (0 to
 * 1). It eases back to rest when the pointer leaves. Touch gets no lean,
 * because a card that swims under your thumb is worse than one that stays put,
 * and reduced motion keeps it still.
 */
export function Tilt({ children, max = 10 }: { children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node || event.pointerType === 'touch') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const { clientX, clientY } = event
    cancelAnimationFrame(frame.current)
    // One write per frame, however fast the pointer reports.
    frame.current = requestAnimationFrame(() => {
      const box = node.getBoundingClientRect()
      const x = Math.min(1, Math.max(0, (clientX - box.left) / box.width))
      const y = Math.min(1, Math.max(0, (clientY - box.top) / box.height))
      node.style.setProperty('--mx', x.toFixed(3))
      node.style.setProperty('--my', y.toFixed(3))
      node.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`)
      node.style.setProperty('--ry', `${((x - 0.5) * max).toFixed(2)}deg`)
      node.dataset.live = ''
    })
  }

  function leave() {
    const node = ref.current
    if (!node) return
    cancelAnimationFrame(frame.current)
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
