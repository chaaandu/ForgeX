import 'server-only'
import type { FounderCardData } from '@/components/card/FounderCard'
import type { Founder } from '@/lib/data/founders'
import type { PickStatus } from '@/lib/data/picks'
import type { Problem } from '@/lib/problem'

/** Builds a founder's card from what they have done so far, and nothing they haven't. */
export function cardFor(
  founder: Founder,
  of: number,
  current?: { title: string; problem: Problem | null; status: PickStatus } | null,
): FounderCardData {
  return {
    name: founder.name,
    photo: founder.photo,
    number: founder.number,
    of,
    // Placed in Hackathon 1 or not, the archetype joins the card at Level 2.
    archetype: founder.level >= 2 ? founder.archetype : null,
    bio: founder.profile.bio || undefined,
    problemTitle: current?.title,
    finish: current ? 'picked' : null,
  }
}
