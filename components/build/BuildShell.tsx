import type { ReactNode } from 'react'
import { FounderCard, type FounderCardData } from '@/components/card/FounderCard'
import { Brand } from '@/components/shell/Brand'
import { levels as copy } from '@/content/copy'
import { BuildNav } from './BuildNav'

/**
 * Home, once a founder is building: Today, Plan, Stops, Messages and their
 * profile, with the card beside it on wider screens. Still no sign-out:
 * founders never get one.
 */
export function BuildShell({
  card,
  slug,
  pod = false,
  children,
}: {
  card: FounderCardData
  slug: string
  /** Mentors get a tab for the pod they look after. */
  pod?: boolean
  children: ReactNode
}) {
  return (
    <div className="min-h-dvh">
      <header className="border-line bg-ground/90 sticky top-0 z-30 border-b backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 md:flex-nowrap md:px-10">
          <Brand href="/today" />
          <div className="w-full md:w-auto">
            <BuildNav slug={slug} pod={pod} />
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 pt-8 pb-28 md:grid-cols-[minmax(0,1fr)_280px] md:px-10 md:pt-12 md:pb-24 lg:gap-16">
        <main className="min-w-0">{children}</main>
        <aside className="hidden md:block" aria-label={copy.card}>
          <div className="sticky top-24">
            <FounderCard data={card} size="md" tilt />
          </div>
        </aside>
      </div>
    </div>
  )
}
