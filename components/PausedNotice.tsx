'use client'

import { copy } from '@/lib/copy'
import { useBets } from './BetsProvider'

export function PausedNotice() {
  const { degraded } = useBets()
  if (!degraded) return null
  return <p className="text-muted mx-auto mb-4 max-w-[1600px] text-[13px]">{copy.backendDown}</p>
}
