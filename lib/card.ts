import 'server-only'
import type { FounderCardData } from '@/components/card/FounderCard'
import type { Founder } from '@/lib/data/founders'

/** Builds a founder's card from what they have done so far, and nothing they haven't. */
export function cardFor(founder: Founder, of: number, building?: string | null): FounderCardData {
  return {
    name: founder.name,
    photo: founder.photo,
    number: founder.number,
    of,
    // Placed in Hackathon 1, it is on the card from the first step. Anyone else gets
    // the question mark until they take the test.
    archetype:
      founder.level >= 2 || founder.archetypeSource === 'h1' ? founder.archetype : null,
    problemTitle: building || undefined,
    finish: building ? 'picked' : null,
  }
}
