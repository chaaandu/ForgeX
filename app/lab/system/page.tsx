import { FounderCard, type FounderCardData } from '@/components/card/FounderCard'
import { WallFace } from '@/components/card/WallFace'
import { ProblemCard } from '@/components/problem/ProblemCard'
import { faces, founder, sampleChips, sampleProblem } from '../_shared/data'
import { Controls } from './Controls'
import '@/components/card/card.css'

/** Every core component in every state, for review. Deleted before launch. */
export default function System() {
  const base: FounderCardData = { name: founder.name, photo: founder.photo, number: founder.number, of: 117, archetype: null }
  const stages: [string, FounderCardData][] = [
    ['Arrived', base],
    ['Archetype', { ...base, archetype: founder.archetype }],
    ['Profile', { ...base, archetype: founder.archetype, bio: founder.bio }],
    ['World', { ...base, archetype: founder.archetype, bio: founder.bio, marks: ['Retail', 'Businesses', 'Family business'] }],
    ['Picked', { ...base, archetype: founder.archetype, marks: ['Retail', 'Businesses'], problemTitle: sampleProblem.title }],
    ['Sent · Epic', { ...base, archetype: founder.archetype, marks: ['Retail', 'Businesses'], problemTitle: sampleProblem.title, finish: 'epic' }],
    ['Sent · Mythic', { ...base, archetype: founder.archetype, marks: ['Retail', 'Businesses'], problemTitle: sampleProblem.title, finish: 'mythic' }],
    ['Original · Go', { ...base, archetype: founder.archetype, marks: ['Retail', 'Businesses'], problemTitle: 'My own problem', finish: 'original', stamp: 'go' }],
  ]
  return (
    <main className="mx-auto grid max-w-[1240px] gap-20 px-5 py-20 md:px-10">
      <section className="grid gap-6">
        <p className="meta">Founder card, level by level</p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stages.map(([label, data]) => (
            <figure key={label} className="m-0 grid gap-3">
              <FounderCard data={data} tilt />
              <figcaption className="meta">{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <p className="meta">Wall faces · tap to flip</p>
        <ul className="m-0 grid list-none grid-cols-5 gap-2 p-0 sm:grid-cols-10">
          {faces.slice(0, 20).map((face, index) => (
            <li key={face.photo}>
              <WallFace face={face} priority={index < 4} />
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-6">
          <p className="meta">Problem card</p>
          <ProblemCard problem={sampleProblem} chips={sampleChips} />
        </div>
        <Controls problem={sampleProblem} />
      </section>
    </main>
  )
}
