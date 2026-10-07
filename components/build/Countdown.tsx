'use client'

import { useEffect, useState } from 'react'
import { plan as copy } from '@/content/copy'

function left(ms: number): string {
  const minutes = Math.max(0, Math.floor(ms / 60000))
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  if (days > 0) return `${days} ${copy.units.day} ${hours} ${copy.units.hour}`
  if (hours > 0) return `${hours} ${copy.units.hour} ${mins} ${copy.units.minute}`
  return `${mins} ${copy.units.minute}`
}

/**
 * Time to a stop, updated each minute. Counts from the server's now, so a
 * pinned day in mock mode reads the same here as on the server.
 */
export function Countdown({ closes, now }: { closes: string; now: string }) {
  const [offset] = useState(() => new Date(now).getTime() - Date.now())
  const [, tick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => tick((value) => value + 1), 60_000)
    return () => window.clearInterval(id)
  }, [])
  const ms = new Date(closes).getTime() - (Date.now() + offset)
  return <span suppressHydrationWarning>{copy.inTime(left(ms))}</span>
}
