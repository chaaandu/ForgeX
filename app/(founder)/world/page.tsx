import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { World } from '@/components/levels/World'
import { LevelShell } from '@/components/shell/LevelShell'
import { founderContext } from '@/lib/context'
import { currentPath, mayEnter } from '@/lib/journey'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: 'Your world' }

export default async function WorldPage() {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'world')) redirect(currentPath(founder))
  const context = await founderContext(founder)
  return (
    <LevelShell level="world" card={context.card}>
      <World initial={founder.world} familyBusiness={/family/i.test(founder.priorWork)} />
    </LevelShell>
  )
}
