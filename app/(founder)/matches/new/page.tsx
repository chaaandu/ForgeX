import type { Metadata } from 'next'
import { meta } from '@/content/copy'
import { redirect } from 'next/navigation'
import { Composer } from '@/components/levels/Composer'
import { LevelShell } from '@/components/shell/LevelShell'
import { founderContext } from '@/lib/context'
import { currentPath, mayEnter } from '@/lib/journey'
import { closeLabel } from '@/lib/dates'
import { requireFounder } from '@/lib/session'
import { seesBank, trackOf } from '@/lib/tracks'
import { levels } from '@/content/copy'

export const metadata: Metadata = { title: meta.pages.writeOwn }

export default async function ComposerPage() {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'why')) redirect(currentPath(founder))
  const context = await founderContext(founder)
  const ownOnly = !seesBank(trackOf(founder.track))
  if (context.current && context.current.status !== 'waiting') redirect(`/f/${founder.slug}`)
  return (
    <LevelShell
      level={ownOnly ? 'matches' : 'why'}
      card={context.card}
      label={ownOnly ? levels.names.own : undefined}
    >
      <Composer
        card={context.card}
        slug={founder.slug}
        closesAt={closeLabel(process.env.PICKS_CLOSE_AT ?? '')}
        ownOnly={ownOnly}
      />
    </LevelShell>
  )
}
