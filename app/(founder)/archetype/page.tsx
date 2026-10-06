import type { Metadata } from 'next'
import { meta } from '@/content/copy'
import { redirect } from 'next/navigation'
import { ArchetypeFlow } from '@/components/levels/archetype/ArchetypeFlow'
import { LevelShell } from '@/components/shell/LevelShell'
import { founderContext } from '@/lib/context'
import { currentPath, mayEnter } from '@/lib/journey'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.archetype }

export default async function ArchetypePage({ searchParams }: { searchParams: Promise<{ retake?: string }> }) {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'archetype')) redirect(currentPath(founder))
  const [{ retake }, context] = await Promise.all([searchParams, founderContext(founder)])
  const canRetake = founder.retakesUsed < 1
  return (
    <LevelShell level="archetype" card={context.card} wide>
      <ArchetypeFlow
        archetype={founder.archetype}
        fromH1={founder.archetypeSource === 'h1'}
        needsConfirm={founder.level < 2}
        canRetake={canRetake}
        retaking={retake === '1' && canRetake && Boolean(founder.archetype)}
        card={context.card}
        slug={founder.slug}
      />
    </LevelShell>
  )
}
