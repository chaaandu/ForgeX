import type { Metadata } from 'next'
import { meta } from '@/content/copy'
import { FoundersTable } from '@/components/team/FoundersTable'
import { founderRows } from '@/lib/team-rows'

export const metadata: Metadata = { title: meta.pages.founders }

export default async function TeamPage() {
  return <FoundersTable rows={await founderRows()} />
}
