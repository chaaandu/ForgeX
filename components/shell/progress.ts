'use client'

import { useSyncExternalStore } from 'react'

/**
 * How far through the current level a founder is, 0 to 1. Levels with their
 * own questions (the quiz, your world) report here, and the one progress bar
 * at the top fills its current segment, so there is never a second bar.
 */
let value = 0
const listeners = new Set<() => void>()

export function setLevelProgress(next: number) {
  value = Math.max(0, Math.min(1, next))
  listeners.forEach((listener) => listener())
}

export function useLevelProgress(): number {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => value,
    () => 0,
  )
}
