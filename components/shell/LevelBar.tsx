'use client'

import { useEffect } from 'react'
import { levels as copy } from '@/content/copy'
import { setLevelProgress, useLevelProgress } from './progress'

export const LEVEL_NAMES = ['arrive', 'archetype', 'profile', 'world', 'matches', 'why'] as const
export type LevelName = (typeof LEVEL_NAMES)[number]

/** One bar for the whole journey. The current level's segment fills as its questions are answered. */
export function LevelBar({ level }: { level: LevelName }) {
  const index = LEVEL_NAMES.indexOf(level)
  const within = useLevelProgress()

  useEffect(() => {
    setLevelProgress(0)
    return () => setLevelProgress(0)
  }, [level])

  return (
    <div className="grid gap-3">
      <p className="m-0 flex items-baseline gap-3" aria-label={copy.of(index + 1, LEVEL_NAMES.length, copy.names[level])}>
        <span className="font-mono text-[12px] text-pink-ink">{String(index + 1).padStart(2, '0')}</span>
        <span className="text-[14px] font-medium text-ink-1">{copy.names[level]}</span>
        <span className="font-mono text-[12px] text-ink-3" aria-hidden="true">
          / {String(LEVEL_NAMES.length).padStart(2, '0')}
        </span>
      </p>
      <ol className="m-0 flex list-none gap-1.5 p-0" aria-hidden="true">
        {LEVEL_NAMES.map((name, position) => (
          <li key={name} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-s3">
            <span
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-out"
              style={{
                width: position < index ? '100%' : position === index ? `${Math.max(12, within * 100)}%` : '0%',
                background: position < index ? 'var(--color-ink-1)' : 'var(--color-pink)',
              }}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
