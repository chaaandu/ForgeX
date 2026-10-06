import type { Metadata } from 'next'
import { Queue, type QueueItem } from '@/components/team/Queue'
import { archetypes, families } from '@/content/copy'
import { ARCHETYPES } from '@/lib/archetype'
import { allFounders } from '@/lib/data/founders'
import { allPicks, allResponses, statusOf } from '@/lib/data/picks'
import { bank } from '@/lib/data/problems'
import { INTENTS, labelOf } from '@/lib/taxonomy'

export const metadata: Metadata = { title: 'Queue' }

export default async function QueuePage() {
  const [picks, responses, founders, problems] = await Promise.all([allPicks(), allResponses(), allFounders(), bank()])
  const byEmail = new Map(founders.map((founder) => [founder.email, founder]))
  const byId = new Map(problems.map((item) => [item.id, item]))
  const items: QueueItem[] = picks
    .filter((pick) => !pick.withdrawnAt && statusOf(pick, responses) === 'waiting')
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt))
    .flatMap((pick) => {
      const founder = byEmail.get(pick.email)
      if (!founder) return []
      const problem = pick.problemId ? byId.get(pick.problemId) : null
      const kind = founder.archetype ? ARCHETYPES[founder.archetype] : null
      const world = founder.world
      const previous = picks.filter((item) => item.email === pick.email && item.id !== pick.id).length
      return [
        {
          pickId: pick.id,
          submittedAt: pick.submittedAt,
          founder: {
            name: founder.name,
            slug: founder.slug,
            photo: founder.photo,
            archetype: kind ? `${families[kind.family].name} · ${archetypes[kind.id].name}` : '—',
            bio: founder.profile.bio,
            facts: [
              founder.profile.degree,
              founder.profile.city,
              founder.profile.goodAt.length ? `Good at ${founder.profile.goodAt.join(', ')}` : '',
              founder.profile.wantToLearn.length ? `Wants ${founder.profile.wantToLearn.join(', ')}` : '',
            ].filter(Boolean),
            world: world
              ? [
                  `Industries: ${world.industries.map((id) => (id === 'other' ? (world.industryOther ?? 'Other') : labelOf.industryShort(id))).join(', ')}`,
                  `For: ${world.side}`,
                  `Can reach: ${world.access.length ? world.access.map((entry) => `${entry.kind === 'other' ? (entry.other ?? 'Other') : labelOf.access(entry.kind)} (${entry.worlds.map((id) => (id === 'elsewhere' ? (entry.elsewhere ?? 'elsewhere') : labelOf.industryShort(id))).join(', ')})`).join('; ') : 'nobody yet'}`,
                  `Learn: ${world.learn.map((id) => (id === 'other' ? (world.learnOther ?? 'Other') : labelOf.learn(id))).join(', ')}`,
                  `Here for: ${INTENTS.find((intent) => intent.id === world.intent)?.label ?? ''}`,
                  `Tech comfort: ${world.comfort} of 5`,
                ]
              : [],
            previous,
          },
          problem: problem
            ? { title: problem.title, problem: problem.problem, challenge: problem.challenge, rarity: problem.rarity, own: false }
            : { title: pick.custom?.title ?? '', problem: pick.custom?.problem ?? '', challenge: pick.custom?.challenge ?? '', rarity: null, own: true },
          whyProblem: pick.whyProblem,
          whyUser: pick.whyUser,
          whyPay: pick.whyPay,
          contact: pick.contact,
        },
      ]
    })
  const bankList = problems.filter((item) => item.status === 'approved').map((item) => ({ id: item.id, title: item.title }))
  return <Queue items={items} bank={bankList} />
}
