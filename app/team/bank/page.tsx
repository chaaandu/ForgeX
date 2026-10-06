import type { Metadata } from 'next'
import { meta } from '@/content/copy'
import { Bank, type BankItem } from '@/components/team/Bank'
import { bank, internalFor } from '@/lib/data/problems'
import { labelOf } from '@/lib/taxonomy'

export const metadata: Metadata = { title: meta.pages.bank }

export default async function BankPage() {
  const problems = await bank()
  const items: BankItem[] = await Promise.all(
    problems.map(async (item) => ({
      id: item.id,
      status: item.status,
      title: item.title,
      problem: item.problem,
      challenge: item.challenge,
      rarity: item.rarity,
      tags: [...item.industries.map(labelOf.industryShort), labelOf.side(item.side), ...item.learn.map(labelOf.learn), item.geo === 'IN' ? 'India' : 'Global'],
      signal: item.signal.line,
      strength: item.signal.strength,
      internal: await internalFor(item.id),
    })),
  )
  return <Bank items={items} />
}
