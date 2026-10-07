import 'server-only'
import type { Brief } from '@/components/team/FounderBrief'
import { world as worldCopy } from '@/content/copy'
import type { Founder } from '@/lib/data/founders'
import { INTENTS, labelOf } from '@/lib/taxonomy'

/** A founder's answers and profile, turned into the words the console shows. Team only. */
export function briefFor(founder: Founder): Brief {
  const world = founder.world
  const industry = (id: string) =>
    id === 'other' ? (world?.industryOther ?? 'Other') : labelOf.industryShort(id)
  return {
    bio: founder.profile.bio,
    world: world
      ? {
          industries: world.industries.map(industry),
          side:
            world.side === 'unsure'
              ? worldCopy.side.options.unsure.label
              : worldCopy.side.options[world.side].label,
          reach: world.access.map((entry) => ({
            who: entry.kind === 'other' ? (entry.other ?? 'Other') : labelOf.access(entry.kind),
            where: entry.worlds.map((id) =>
              id === 'elsewhere'
                ? (entry.elsewhere ?? 'Somewhere else')
                : labelOf.industryShort(id),
            ),
          })),
          learn: world.learn.map((id) =>
            id === 'other' ? (world.learnOther ?? 'Other') : labelOf.learn(id),
          ),
          intent: INTENTS.find((intent) => intent.id === world.intent)?.label ?? '',
          comfort: {
            value: world.comfort,
            label: worldCopy.comfort.stops[world.comfort - 1] ?? '',
          },
        }
      : null,
    profile: {
      degree: founder.profile.degree,
      city: founder.profile.city,
      languages: founder.profile.languages,
      goodAt: founder.profile.goodAt,
      wantToLearn: founder.profile.wantToLearn,
    },
  }
}
