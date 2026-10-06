import type { ReactNode } from 'react'
import { levels as copy } from '@/content/copy'
import { FounderCard, type FounderCardData } from '@/components/card/FounderCard'
import { LevelBar, type LevelName } from './LevelBar'

export { LEVEL_NAMES, type LevelName } from './LevelBar'

/**
 * Every level sits in this: one progress bar, the step itself, and on wider
 * screens the founder card beside it. No logo and no sign out while a founder
 * is mid-flow: nothing on screen that is not the next step.
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
  return (
    <div className="min-h-dvh">
      <header className="mx-auto max-w-[1240px] px-5 pt-6 md:px-10 md:pt-9">
        <LevelBar level={level} />
      </header>
      <div
        className={`mx-auto grid max-w-[1240px] gap-10 px-5 pt-8 pb-24 md:px-10 md:pt-14 ${
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
