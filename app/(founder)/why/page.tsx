import type { Metadata } from 'next'
import { meta } from '@/content/copy'
import { redirect } from 'next/navigation'
import { Why } from '@/components/levels/Why'
import { LevelShell } from '@/components/shell/LevelShell'
import { founderContext } from '@/lib/context'
import { problemById, publicProblem } from '@/lib/data/problems'
import { currentPath, mayEnter } from '@/lib/journey'
import { closeLabel } from '@/lib/dates'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.why }

export default async function WhyPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'why')) redirect(currentPath(founder))
  const [{ p }, context] = await Promise.all([searchParams, founderContext(founder)])
  if (context.current && context.current.status !== 'waiting') redirect(`/f/${founder.slug}`)
  const found = p ? await problemById(p) : null
  if (!found || found.status !== 'approved') redirect('/matches')
  return (
    <LevelShell level="why" card={{ ...context.card, problemTitle: found.title }}>
      <Why problem={publicProblem(found)} custom={null} card={context.card} slug={founder.slug} closesAt={closeLabel(process.env.PICKS_CLOSE_AT ?? '')} />
    </LevelShell>
  )
}
