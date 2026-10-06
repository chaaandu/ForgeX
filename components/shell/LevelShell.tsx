import type { ReactNode } from 'react'
import { levels as copy } from '@/content/copy'
import { FounderCard, type FounderCardData } from '@/components/card/FounderCard'
import { Brand } from './Brand'
import { SignOut } from './SignOut'

export const LEVEL_NAMES = ['arrive', 'archetype', 'profile', 'world', 'matches', 'why'] as const
export type LevelName = (typeof LEVEL_NAMES)[number]

/**
 * Every level sits in this: the brand, where you are, the step itself, and the
 * founder card beside it. On a phone the card shrinks into the corner; it is
 * never hidden, because it is the progress bar.
 */
export function LevelShell({
  level,
  card,
  children,
  wide = false,
}: {
  level: LevelName
  card: FounderCardData
  children: ReactNode
  wide?: boolean
}) {
  const index = LEVEL_NAMES.indexOf(level)
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 pt-5 md:px-10 md:pt-7">
        <Brand />
        <div className="flex items-center gap-4">
          <p className="meta m-0" aria-label={copy.of(index + 1, LEVEL_NAMES.length, copy.names[level])}>
            <span className="text-ink-1">{String(index + 1).padStart(2, '0')}</span>
            <span aria-hidden="true"> / {String(LEVEL_NAMES.length).padStart(2, '0')}</span>
            <span className="hidden sm:inline"> · {copy.names[level]}</span>
          </p>
          {wide ? null : (
            <div className="w-12 md:hidden" aria-hidden="true">
              <FounderCard data={card} size="sm" />
            </div>
          )}
          <SignOut />
        </div>
      </header>
      <ol className="mx-auto mt-4 flex max-w-[1240px] gap-1.5 px-5 md:px-10" aria-hidden="true">
        {LEVEL_NAMES.map((name, position) => (
          <li
            key={name}
            className="h-[3px] flex-1 rounded-full"
            style={{
              background:
                position < index
                  ? 'var(--color-ink-1)'
                  : position === index
                    ? 'var(--color-pink)'
                    : 'var(--color-s3)',
            }}
          />
        ))}
      </ol>
      <div
        className={`mx-auto grid max-w-[1240px] gap-10 px-5 pt-10 pb-24 md:px-10 md:pt-14 ${
          wide ? '' : 'md:grid-cols-[minmax(0,1fr)_280px] lg:gap-16'
        }`}
      >
        <main className="min-w-0">{children}</main>
        {wide ? null : (
          <aside className="hidden md:block" aria-label={copy.card}>
            <div className="sticky top-10">
              <FounderCard data={card} size="md" tilt />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
