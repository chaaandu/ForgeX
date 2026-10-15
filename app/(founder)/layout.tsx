import type { ReactNode } from 'react'
import { Lines } from '@/components/ui/Lines'
import { Refresh } from '@/components/ui/Refresh'
import { gate as copy } from '@/content/copy'
import { dayLabel } from '@/lib/dates'
import { clock, HACKATHON, phaseAt } from '@/lib/hackathon'
import { requireFounder } from '@/lib/session'

/**
 * The door to everything a founder does. Before the announcement it shows
 * when ForgeX opens and nothing else, so all 117 start at the same moment;
 * the page opens by itself when the time comes. The actions refuse before it
 * too, so this is a courtesy and not the lock.
 */
export default async function FounderLayout({ children }: { children: ReactNode }) {
  if (phaseAt(clock()).open) return children
  const { founder } = await requireFounder()
  return (
    <main className="mx-auto grid min-h-dvh max-w-[760px] content-center gap-4 px-5 py-16 md:px-10">
      <Refresh />
      <p className="meta m-0">{founder.first}</p>
      <h1 className="page-title m-0">{copy.title}</h1>
      <p className="text-lead text-ink-2 m-0">
        <Lines text={copy.lead(dayLabel(HACKATHON.opens))} />
      </p>
    </main>
  )
}
