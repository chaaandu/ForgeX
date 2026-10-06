import type { Metadata } from 'next'
import { meta } from '@/content/copy'
import { redirect } from 'next/navigation'
import { World } from '@/components/levels/World'
import { LevelShell } from '@/components/shell/LevelShell'
import { founderContext } from '@/lib/context'
import { currentPath, mayEnter } from '@/lib/journey'
import { requireFounder } from '@/lib/session'
import { seesBank, trackOf } from '@/lib/tracks'

export const metadata: Metadata = { title: meta.pages.world }

export default async function WorldPage() {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'world')) redirect(currentPath(founder))
  const context = await founderContext(founder)
  return (
    <LevelShell level="world" card={context.card}>
      <World
        initial={founder.world}
        familyBusiness={/family/i.test(founder.priorWork)}
        ownOnly={!seesBank(trackOf(founder.track))}
      />
    </LevelShell>
  )
}
