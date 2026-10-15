import type { Metadata } from 'next'
import { FoundersTable } from '@/components/team/FoundersTable'
import { meta } from '@/content/copy'
import { requireTeam } from '@/lib/session'
import { staffOf } from '@/lib/staff'
import { founderRows } from '@/lib/team-rows'

export const metadata: Metadata = { title: meta.pages.founders }

/** A reviewer opens on their own students; anyone can widen it to everyone. */
export default async function TeamPage() {
  const [viewer, rows] = await Promise.all([requireTeam(), founderRows()])
  return <FoundersTable rows={rows} reviewer={staffOf(viewer.email).reviewer ?? ''} />
}
