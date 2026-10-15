import type { Metadata } from 'next'
import { HistoryTable } from '@/components/team/HistoryTable'
import { consoleCopy, meta } from '@/content/copy'
import { allFounders } from '@/lib/data/founders'
import { historyLines } from '@/lib/data/hackathon'

export const metadata: Metadata = { title: meta.pages.history }

/** The Problem history tab, readable and sortable in the console. */
export default async function HistoryPage() {
  const [lines, founders] = await Promise.all([historyLines(), allFounders()])
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="display m-0 text-[40px] leading-none">{consoleCopy.history.title}</h1>
        <p className="text-ink-2 m-0">{consoleCopy.history.lead}</p>
      </div>
      <HistoryTable
        lines={lines}
        slugs={Object.fromEntries(founders.map((founder) => [founder.email, founder.slug]))}
      />
    </div>
  )
}
