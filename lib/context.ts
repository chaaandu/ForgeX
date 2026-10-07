import 'server-only'
import { cardFor } from '@/lib/card'
import { allFounders, type Founder } from '@/lib/data/founders'
import { researchOf } from '@/lib/data/research'

/** What every founder screen needs about them in one read: their card and their research. */
export async function founderContext(founder: Founder) {
  const [founders, research] = await Promise.all([allFounders(), researchOf(founder.email)])
  const of = founders.length
  return { of, research, card: cardFor(founder, of, Boolean(research?.sent)) }
}
