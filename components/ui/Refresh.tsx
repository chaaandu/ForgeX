'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/** Keeps a page that is left on a wall up to date, without anyone touching it. */
export function Refresh({ every = 20_000 }: { every?: number }) {
  const router = useRouter()
  useEffect(() => {
    const id = window.setInterval(() => router.refresh(), every)
    return () => window.clearInterval(id)
  }, [every, router])
  return null
}
