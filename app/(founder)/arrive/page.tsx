import type { Metadata } from 'next'
import { Arrive } from '@/components/levels/Arrive'
import { LevelShell } from '@/components/shell/LevelShell'
import { founderContext } from '@/lib/context'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: 'Arrive' }

export default async function ArrivePage() {
  const { founder } = await requireFounder()
  const context = await founderContext(founder)
  return (
    <LevelShell level="arrive" card={context.card} wide>
      <Arrive first={founder.first} card={context.card} numbered={Boolean(founder.number) && founder.level >= 1} />
    </LevelShell>
  )
}
