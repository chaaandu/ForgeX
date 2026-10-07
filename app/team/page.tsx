import type { Metadata } from 'next'
import { FoundersTable } from '@/components/team/FoundersTable'
import { meta } from '@/content/copy'
import { POD_COUNT } from '@/lib/data/pods'
import { founderRows, trackOptions } from '@/lib/team-rows'

export const metadata: Metadata = { title: meta.pages.founders }

export default async function TeamPage() {
  const rows = await founderRows()
  return (
    <FoundersTable
      rows={rows}
      tracks={trackOptions(rows)}
      pods={Array.from({ length: POD_COUNT }, (_, index) => index + 1)}
    />
  )
}
