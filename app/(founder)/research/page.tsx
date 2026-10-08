import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BuildShell } from '@/components/build/BuildShell'
import { Research } from '@/components/levels/Research'
import { meta } from '@/content/copy'
import { founderContext } from '@/lib/context'
import { seats } from '@/lib/data/pods'
import { currentPath, mayEnter } from '@/lib/journey'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.research }

/** The plan's first work, days 1 and 2. Sending it unlocks the build days; it stays editable. */
export default async function ResearchPage() {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'today')) redirect(currentPath(founder))
  const [context, seatMap] = await Promise.all([founderContext(founder), seats()])
  const research = context.research
  const form = (
    <Research
      initial={
        research
          ? {
              forWho: research.forWho,
              problem: research.problem,
              doc: research.doc,
              mentor: research.mentor,
            }
          : null
      }
      sent={Boolean(research?.sent)}
    />
  )
  const seat = seatMap.get(founder.email)
  return (
    <BuildShell card={context.card} slug={founder.slug} pod={seat?.role === 'mentor'}>
      {form}
    </BuildShell>
  )
}
