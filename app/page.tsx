import Link from 'next/link'
import { Brand } from '@/components/shell/Brand'
import { Wall } from '@/components/landing/Wall'
import { landing as copy } from '@/content/copy'
import { allFounders } from '@/lib/data/founders'
import { openProblems } from '@/lib/data/problems'
import { currentPath } from '@/lib/journey'
import { getViewer } from '@/lib/session'

/**
 * The door. The whole cohort's faces, one line, how many problems are open,
 * and one way in. No problem statements here: those are earned by walking
 * the levels, not browsed from the doorway.
 */
export default async function Landing() {
  const [viewer, founders, problems] = await Promise.all([getViewer(), allFounders(), openProblems()])
  let enter = '/login'
  if (viewer?.role === 'team') enter = '/team'
  if (viewer?.role === 'founder') {
    const me = founders.find((founder) => founder.email === viewer.email)
    if (me) enter = currentPath(me)
  }
  const faces = founders
    .filter((founder) => founder.wall)
    .map((founder) => ({
      first: founder.first,
      photo: founder.photo,
      archetype: founder.level >= 2 || founder.archetypeSource === 'h1' ? founder.archetype : null,
    }))

  return (
    <div className="relative h-svh min-h-[600px] overflow-clip">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-7">
        <Brand />
      </header>
      <Wall faces={faces} />
      <div className="landing-fade pointer-events-none absolute inset-0 z-10" />
      <main className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto grid max-w-[1400px] gap-6 px-5 pb-10 md:gap-8 md:px-12 md:pb-16">
        <p className="meta m-0">{copy.kicker}</p>
        <h1 className="display m-0 max-w-[14ch] text-[clamp(44px,min(8vw,11.5svh),128px)] leading-[0.95]">
          {copy.lineStart} <em>{copy.lineEm}</em> {copy.lineEnd}
        </h1>
        <div className="pointer-events-auto flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href={enter} className="btn btn-primary press min-h-[52px] px-8 text-[16px]">
            {copy.enter}
          </Link>
          {problems.length ? (
            <p className="m-0 inline-flex items-center gap-2.5 font-mono text-[13px] text-ink-2">
              <span aria-hidden="true" className="live-dot" />
              {copy.open(problems.length)}
            </p>
          ) : null}
        </div>
      </main>
    </div>
  )
}
