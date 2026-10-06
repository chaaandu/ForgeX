'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * A card that leans toward the pointer and tells its foil where the light is.
 * Writes --rx, --ry (degrees) and --mx, --my (0 to 1) on itself. Under
 * reduced motion it never moves and the foil sits at rest.
 */
export function TiltCard({
  children,
  className,
  max = 10,
  style,
}: {
  children: ReactNode
  className?: string
  max?: number
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = node.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    node.style.setProperty('--mx', x.toFixed(3))
    node.style.setProperty('--my', y.toFixed(3))
    node.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`)
    node.style.setProperty('--ry', `${((x - 0.5) * max).toFixed(2)}deg`)
    node.dataset.live = 'true'
  }

  function leave() {
    const node = ref.current
    if (!node) return
    node.style.setProperty('--rx', '0deg')
    node.style.setProperty('--ry', '0deg')
    node.style.setProperty('--mx', '0.5')
    node.style.setProperty('--my', '0.5')
    delete node.dataset.live
  }

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ ['--rx' as string]: '0deg', ['--ry' as string]: '0deg', ['--mx' as string]: 0.5, ['--my' as string]: 0.5, ...style }}
    >
      {children}
    </div>
  )
}
