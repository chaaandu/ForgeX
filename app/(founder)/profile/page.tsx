import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Profile } from '@/components/levels/Profile'
import { LevelShell } from '@/components/shell/LevelShell'
import { founderContext } from '@/lib/context'
import { currentPath, mayEnter } from '@/lib/journey'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'profile')) redirect(currentPath(founder))
  const context = await founderContext(founder)
  return (
    <LevelShell level="profile" card={context.card}>
      <Profile name={founder.name} photo={founder.photo} initial={founder.profile} next="/world" />
    </LevelShell>
  )
}
