'use client'

import { useEffect } from 'react'

/** Every couple of seconds, one face on the wall warms into colour and back. */
export function Glint() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cells = Array.from(document.querySelectorAll<HTMLElement>('.wall-cell'))
    if (!cells.length) return
    let last: HTMLElement | null = null
    const timer = window.setInterval(() => {
      last?.removeAttribute('data-glint')
      const visible = cells.filter((cell) => cell.getBoundingClientRect().top < window.innerHeight * 0.45)
      const pick = visible[Math.floor(Math.random() * visible.length)]
      if (pick) {
        pick.setAttribute('data-glint', '')
        last = pick
      }
    }, 1800)
    return () => window.clearInterval(timer)
  }, [])
  return null
}
