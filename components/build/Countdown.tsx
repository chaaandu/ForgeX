'use client'

import { useEffect, useState } from 'react'
import { home as copy } from '@/content/copy'

export function timeLeft(ms: number): string {
  const minutes = Math.max(0, Math.floor(ms / 60000))
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  if (days > 0) return `${days} ${copy.units.day} ${hours} ${copy.units.hour}`
  if (hours > 0) return `${hours} ${copy.units.hour} ${mins} ${copy.units.minute}`
  return `${mins} ${copy.units.minute}`
}

/**
 * Time to a deadline, updated every half minute. Counts from the server's
 * now, so a pinned clock in mock mode reads the same here as on the server.
 */
export function Countdown({
  closes,
  now,
  bare = false,
}: {
  closes: string
  now: string
  /** Just the time, for a caller that words the rest itself. */
  bare?: boolean
}) {
  const [offset] = useState(() => new Date(now).getTime() - Date.now())
  const [, tick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => tick((value) => value + 1), 30_000)
    return () => window.clearInterval(id)
  }, [])
  const ms = new Date(closes).getTime() - (Date.now() + offset)
  if (ms <= 0) return <span suppressHydrationWarning>{copy.closed}</span>
  return (
    <span suppressHydrationWarning>{bare ? timeLeft(ms) : copy.left(timeLeft(ms))}</span>
  )
}
