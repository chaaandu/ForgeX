'use client'

import { useEffect } from 'react'
import { levels as copy } from '@/content/copy'
import { setLevelProgress, useLevelProgress } from './progress'

export const LEVEL_NAMES = ['arrive', 'archetype', 'profile', 'challenge'] as const
export type LevelName = (typeof LEVEL_NAMES)[number]

/** One bar for the whole journey. The current level's segment fills as its questions are answered. */
export function LevelBar({ level, label }: { level: LevelName; label?: string }) {
  const index = LEVEL_NAMES.indexOf(level)
  const within = useLevelProgress()

  useEffect(() => {
    setLevelProgress(0)
    return () => setLevelProgress(0)
  }, [level])

  return (
    <div className="grid gap-3">
      <p
        className="m-0 flex items-baseline gap-3"
        aria-label={copy.of(index + 1, LEVEL_NAMES.length, label ?? copy.names[level])}
      >
        <span className="text-violet-ink font-mono text-[12px]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-ink-1 text-[14px] font-medium">{label ?? copy.names[level]}</span>
        <span className="text-ink-3 font-mono text-[12px]" aria-hidden="true">
          / {String(LEVEL_NAMES.length).padStart(2, '0')}
        </span>
      </p>
      <ol className="m-0 flex list-none gap-1.5 p-0" aria-hidden="true">
        {LEVEL_NAMES.map((name, position) => (
          <li key={name} className="bg-s3 relative h-[3px] flex-1 overflow-hidden rounded-full">
            <span
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-out"
              style={{
                width:
                  position < index
                    ? '100%'
                    : position === index
                      ? `${Math.max(12, within * 100)}%`
                      : '0%',
                background: position < index ? 'var(--color-ink-1)' : 'var(--color-violet)',
              }}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
