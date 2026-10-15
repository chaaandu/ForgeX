import type { Metadata } from 'next'
import { FoundersTable } from '@/components/team/FoundersTable'
import { meta } from '@/content/copy'
import { requireTeam } from '@/lib/session'
import { pocOf, staffOf } from '@/lib/staff'
import { founderRows } from '@/lib/team-rows'

export const metadata: Metadata = { title: meta.pages.founders }

/**
 * A reviewer opens on the students they review, and a POC on the students
 * they look after; the super admin and everyone else on everyone. Anyone can
 * widen it.
 */
export default async function TeamPage() {
  const [viewer, rows] = await Promise.all([requireTeam(), founderRows()])
  const staff = staffOf(viewer.email)
  const pocs = [...new Set(rows.map((row) => row.poc).filter(Boolean))]
  const poc = staff.admin || staff.reviewer ? null : pocOf(viewer, pocs)
  return <FoundersTable rows={rows} reviewer={staff.reviewer ?? ''} poc={poc ?? ''} />
}
