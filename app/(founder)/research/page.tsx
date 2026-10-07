import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BuildShell } from '@/components/build/BuildShell'
import { Research } from '@/components/levels/Research'
import { LevelShell } from '@/components/shell/LevelShell'
import { meta } from '@/content/copy'
import { founderContext } from '@/lib/context'
import { seats } from '@/lib/data/pods'
import { currentPath, mayEnter } from '@/lib/journey'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.research }

/**
 * The last onboarding step, and after that a page of the build: once sent,
 * the research stays editable from the plan, inside the build's own shell.
 */
export default async function ResearchPage() {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'research')) redirect(currentPath(founder))
  const [context, seatMap] = await Promise.all([founderContext(founder), seats()])
  const research = context.research
  const form = (
    <Research
      initial={
        research
          ? {
              forWho: research.forWho,
              problem: research.problem,
              moment: research.moment,
              apps: research.apps,
              talks: research.talks,
              reading: research.reading,
            }
          : null
      }
      sent={Boolean(research?.sent)}
      card={context.card}
    />
  )
  if (research?.sent) {
    const seat = seatMap.get(founder.email)
    return (
      <BuildShell card={context.card} slug={founder.slug} pod={seat?.role === 'mentor'}>
        {form}
      </BuildShell>
    )
  }
  return (
    <LevelShell level="research" card={context.card}>
      {form}
    </LevelShell>
  )
}
