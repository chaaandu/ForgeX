import Link from 'next/link'
import { FounderCard } from '@/components/card/FounderCard'
import { Brand } from '@/components/shell/Brand'
import { Wall } from '@/components/landing/Wall'
import { Lines } from '@/components/ui/Lines'
import { landing as copy } from '@/content/copy'
import { building } from '@/lib/building'
import { allFounders } from '@/lib/data/founders'

/** Regenerated every five minutes, so a newly placed archetype shows up on the wall. */
export const revalidate = 300

/**
 * The door. The whole cohort's faces, one line, and one way in. Below the
 * fold, every founder who has sent their research, by who they're building
 * for, with a live link once the team has rated their stop 2 green.
 */
export default async function Landing() {
  const [founders, live] = await Promise.all([allFounders(), building()])
  // Only founders with an archetype: every face on the wall turns over to show one.
  const faces = founders
    .filter((founder) => founder.wall)
    .flatMap((founder) => {
      const archetype =
        founder.level >= 2 || founder.archetypeSource === 'h1' ? founder.archetype : null
      return archetype ? [{ first: founder.first, photo: founder.photo, archetype }] : []
    })

  return (
    <>
      <div className="relative h-svh min-h-[600px] overflow-clip">
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-7">
          <Brand />
        </header>
        <Wall faces={faces} />
        <div className="landing-fade pointer-events-none absolute inset-0 z-10" />
        <main className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto grid max-w-[1400px] gap-6 px-5 pb-10 md:gap-8 md:px-12 md:pb-16">
          <p className="meta m-0">{copy.kicker}</p>
          <h1 className="display m-0 text-[clamp(40px,min(7.4vw,10.5svh),116px)] leading-[0.95]">
            <span className="block">{copy.lineStart}</span> <em className="block">{copy.lineEm}</em>
          </h1>
          <p className="text-lead text-ink-2 m-0 max-w-[36ch]">{copy.sub}</p>
          <div className="pointer-events-auto flex flex-wrap items-center gap-x-6 gap-y-4">
            {/* A plain link: /enter is a redirect, and a full navigation follows it cleanly. */}
            <a href="/enter" className="btn btn-primary press min-h-[52px] px-8 text-[16px]">
              {copy.enter}
            </a>
          </div>
        </main>
      </div>
      {/* Always there, so a scroll down shows what this becomes, even before anyone sends research. */}
      <section
        className="mx-auto grid max-w-[1400px] gap-10 px-5 pt-16 pb-24 md:px-12 md:pt-24"
        aria-labelledby="building"
      >
        <div className="grid gap-3">
          <h2 id="building" className="display m-0 text-[clamp(32px,4.4vw,56px)] leading-none">
            {copy.building.title}
          </h2>
          <p className="text-lead text-ink-2 m-0 max-w-[48ch]">
            <Lines text={live.length ? copy.building.lead : copy.building.empty} />
          </p>
        </div>
        {live.length ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-10 p-0 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {live.map((item) => (
              <li key={item.slug} className="grid content-start gap-3">
                {/* Signed out, this goes through sign-in and lands back on the page. */}
                <Link
                  href={`/f/${item.slug}`}
                  className="press grid gap-3 no-underline"
                  aria-label={copy.building.open(item.card.name)}
                >
                  <FounderCard data={item.card} />
                  <span className="text-ink-1 text-[15px] leading-snug">{item.forWho}</span>
                </Link>
                {item.live ? (
                  <a
                    href={item.live}
                    target="_blank"
                    rel="noreferrer"
                    className="text-violet-ink w-fit text-[14px] font-medium"
                  >
                    {copy.building.live}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </>
  )
}
