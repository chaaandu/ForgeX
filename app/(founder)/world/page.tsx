import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { World } from '@/components/levels/World'
import { LevelShell } from '@/components/shell/LevelShell'
import { meta } from '@/content/copy'
import { mayUseBank } from '@/lib/bank-access'
import { founderContext } from '@/lib/context'
import { clock, phaseAt } from '@/lib/hackathon'
import { currentPath, mayEnter } from '@/lib/journey'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.world }

/** The three questions the bank matches on, asked only of a founder who needs the bank. */
export default async function WorldPage() {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'world')) redirect(currentPath(founder))
  const context = await founderContext(founder)
  if (!mayUseBank(context.entry, phaseAt(clock()))) redirect('/build')
  return (
    <LevelShell level="world" card={context.card}>
      <World initial={founder.world} />
    </LevelShell>
  )
}
