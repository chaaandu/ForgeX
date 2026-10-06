import type { Metadata } from 'next'
import { FoundersTable } from '@/components/team/FoundersTable'
import { founderRows } from '@/lib/team-rows'

export const metadata: Metadata = { title: 'Founders' }

export default async function TeamPage() {
  return <FoundersTable rows={await founderRows()} />
}
