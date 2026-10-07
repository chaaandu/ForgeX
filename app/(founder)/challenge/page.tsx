import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Challenge } from '@/components/levels/Challenge'
import { LevelShell } from '@/components/shell/LevelShell'
import { meta } from '@/content/copy'
import { founderContext } from '@/lib/context'
import { LEVELS } from '@/lib/data/founders'
import { currentPath, mayEnter } from '@/lib/journey'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.challenge }

export default async function ChallengePage() {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'challenge')) redirect(currentPath(founder))
  const context = await founderContext(founder)
  return (
    <LevelShell level="challenge" card={context.card}>
      <Challenge started={founder.level >= LEVELS.challenge} />
    </LevelShell>
  )
}
