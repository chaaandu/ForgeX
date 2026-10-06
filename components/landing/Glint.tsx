'use client'

import { useEffect } from 'react'

/** Every couple of seconds, one face on the wall warms into colour and back. */
export function Glint() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cells = Array.from(document.querySelectorAll<HTMLElement>('.wall-cell'))
    if (!cells.length) return
    let last: HTMLElement | null = null
    let timer = 0
    // Start after the page has settled, so it never competes with the first paint.
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        last?.removeAttribute('data-glint')
        const visible = cells.filter(
          (cell) => cell.getBoundingClientRect().top < window.innerHeight * 0.45,
        )
        const pick = visible[Math.floor(Math.random() * visible.length)]
        if (pick) {
          pick.setAttribute('data-glint', '')
          last = pick
        }
      }, 1800)
    }, 2500)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer)
    }
  }, [])
  return null
}
