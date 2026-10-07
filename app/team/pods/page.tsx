import type { Metadata } from 'next'
import { PodBoard } from '@/components/team/PodBoard'
import { consoleCopy, meta } from '@/content/copy'
import { allFounders } from '@/lib/data/founders'
import { POD_COUNT, seats } from '@/lib/data/pods'
import { trackOf } from '@/lib/tracks'

export const metadata: Metadata = { title: meta.pages.pods }

/** Pods for the guided founders, and mentors from the autonomous ones. */
export default async function PodsPage() {
  const [founders, seatMap] = await Promise.all([allFounders(), seats()])
  const person = (founder: (typeof founders)[number], role: 'member' | 'mentor') => {
    const seat = seatMap.get(founder.email)
    return {
      email: founder.email,
      name: founder.name,
      photo: founder.photo,
      pod: seat?.role === role ? seat.pod : null,
    }
  }
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="display m-0 text-[40px] leading-none">{consoleCopy.pods.title}</h1>
        <p className="text-ink-2 m-0 max-w-[60ch]">{consoleCopy.pods.lead}</p>
      </div>
      <PodBoard
        pods={Array.from({ length: POD_COUNT }, (_, index) => index + 1)}
        members={founders
          .filter((founder) => trackOf(founder.track) === 'guided')
          .map((founder) => person(founder, 'member'))}
        mentors={founders
          .filter((founder) => trackOf(founder.track) === 'autonomous')
          .map((founder) => person(founder, 'mentor'))}
      />
    </div>
  )
}
