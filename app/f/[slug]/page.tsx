import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LayoutDashboard, Users } from 'lucide-react'
import { BuildNav } from '@/components/build/BuildNav'
import { CardActions } from '@/components/card/CardActions'
import { FounderCard } from '@/components/card/FounderCard'
import { ProfileFacts } from '@/components/founder/ProfileFacts'
import { Profile } from '@/components/levels/Profile'
import { Account } from '@/components/shell/Account'
import { Brand } from '@/components/shell/Brand'
import { HeaderLink } from '@/components/shell/HeaderLink'
import { CheckinForm } from '@/components/team/CheckinForm'
import {
  archetypes,
  consoleCopy,
  families,
  levels,
  meta,
  page as copy,
  stops as stopsCopy,
} from '@/content/copy'
import { ARCHETYPES } from '@/lib/archetype'
import { progressOf, stepsOf, workLinks } from '@/lib/build'
import { isBuilding } from '@/lib/building'
import { founderContext } from '@/lib/context'
import { ago, shortDate } from '@/lib/dates'
import { founderBySlug, LEVELS } from '@/lib/data/founders'
import { seats } from '@/lib/data/pods'
import { allReviews, latestBy } from '@/lib/data/reviews'
import { ticksOf } from '@/lib/data/steps'
import { allSubmissions } from '@/lib/data/submissions'
import { currentPath } from '@/lib/journey'
import { workLabel } from '@/lib/links'
import { dayOf, planNow, STOP_NUMBERS } from '@/lib/plan'
import { requireViewer } from '@/lib/session'
import { TRACK_LABELS, trackOf } from '@/lib/tracks'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const founder = await founderBySlug((await params).slug)
  return { title: founder?.name ?? meta.title, robots: { index: false, follow: false } }
}

const NEXT_LEVEL = [
  levels.names.arrive,
  levels.names.archetype,
  levels.names.profile,
  levels.names.challenge,
  levels.names.research,
]

/**
 * A founder's permanent page, and their portfolio: card, who they are, and
 * what they're building, with the live link, the code, the design and the
 * demo as each arrives. The founder and the team see all of it. Once a
 * founder has sent their research, the rest of the cohort sees the page
 * without ratings, the team's notes or the download. Anyone else gets a 404,
 * not a refusal that confirms the page exists.
 */
export default async function FounderPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireViewer()
  const { slug } = await params
  const founder = await founderBySlug(slug)
  if (!founder) notFound()
  const own = viewer.role === 'founder' && viewer.email === founder.email
  const team = viewer.role === 'team'
  if (!own && !team && !(await isBuilding(founder.slug))) notFound()
  const full = own || team

  const [context, ticks, submissions, reviews, seatMap] = await Promise.all([
    founderContext(founder),
    ticksOf(founder.email),
    allSubmissions(),
    allReviews(),
    seats(),
  ])
  const research = context.research?.sent ? context.research : null
  const mine = submissions.filter((item) => item.email === founder.email)
  const links = workLinks(ticks, mine)
  const today = dayOf(planNow())
  const progress = progressOf(stepsOf(founder), ticks, today)
  const kind = founder.archetype ? ARCHETYPES[founder.archetype] : null
  const seat = seatMap.get(founder.email)
  const checkins = reviews.filter((item) => item.email === founder.email && item.stop === 'checkin')
  const linkRows = (
    [
      [copy.links.live, links.live],
      [copy.links.repo, links.repo],
      [copy.links.design, links.design],
      [copy.links.video, links.video],
    ] as const
  ).filter(([, url]) => url)

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 pt-5 md:flex-nowrap md:px-10 md:pt-7">
        <Brand href={team ? '/team' : own && research ? '/today' : '/'} />
        {own && research ? (
          <div className="order-last w-full md:order-none md:mr-auto md:w-auto">
            <BuildNav slug={founder.slug} pod={seat?.role === 'mentor'} />
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          {team ? (
            <HeaderLink
              href="/team"
              label={copy.console}
              icon={<LayoutDashboard size={16} strokeWidth={1.5} aria-hidden="true" />}
            />
          ) : null}
          <HeaderLink
            href="/"
            label={consoleCopy.wall}
            icon={<Users size={16} strokeWidth={1.5} aria-hidden="true" />}
          />
          {team ? <Account name={viewer.name} email={viewer.email} photo={viewer.photo} /> : null}
        </div>
      </header>

      <main className="mx-auto grid max-w-[1240px] gap-16 px-5 pt-10 pb-24 md:px-10 md:pt-14">
        {own && founder.level < LEVELS.research ? (
          <Link href={currentPath(founder)} className="btn btn-primary press w-fit">
            {copy.continue(NEXT_LEVEL[founder.level] ?? levels.names.research)}
          </Link>
        ) : null}

        <section className="grid items-center gap-10 md:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          <div className="grid justify-items-center gap-5 md:justify-items-start">
            <FounderCard data={context.card} size="lg" tilt priority glow="always" />
            {full ? <CardActions slug={founder.slug} name={founder.name} /> : null}
          </div>
          <div className="grid gap-4">
            <h1 className="display m-0 text-[clamp(48px,7vw,96px)] leading-[0.92]">
              {founder.name}
            </h1>
            {kind && founder.level >= 2 ? (
              <p className="display text-violet-ink m-0 text-[clamp(22px,2.6vw,30px)] italic">
                {families[kind.family].name} · {archetypes[kind.id].name}
              </p>
            ) : null}
            {founder.profile.bio && !own ? (
              <p className="display m-0 mt-2 max-w-[30ch] text-[clamp(20px,2.2vw,26px)] leading-snug italic">
                {founder.profile.bio}
              </p>
            ) : null}
          </div>
        </section>

        <section className="border-line grid gap-8 border-t pt-12" aria-labelledby="build">
          <h2 id="build" className="display m-0 text-[clamp(32px,3.6vw,44px)] leading-none">
            {own ? copy.sections.build : copy.sections.theirBuild}
          </h2>
          {research ? (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-16">
              <dl className="m-0 grid gap-6">
                <div className="grid gap-1">
                  <dt className="meta">{copy.building.forWho}</dt>
                  <dd className="display m-0 text-[clamp(26px,3vw,36px)] leading-tight">
                    {research.forWho}
                  </dd>
                </div>
                <div className="grid gap-1">
                  <dt className="meta">{copy.building.problem}</dt>
                  <dd className="m-0 max-w-[60ch] text-[17px] leading-relaxed whitespace-pre-line">
                    {research.problem}
                  </dd>
                </div>
                <div className="grid gap-1">
                  <dt className="meta">{copy.building.moment}</dt>
                  <dd className="text-ink-2 m-0 max-w-[60ch] text-[16px] italic">
                    {research.moment}
                  </dd>
                </div>
              </dl>
              <div className="grid content-start gap-8">
                <div className="grid gap-3">
                  <h3 className="meta m-0">{copy.links.title}</h3>
                  {linkRows.length ? (
                    <ul className="m-0 grid list-none gap-2 p-0">
                      {linkRows.map(([label, url]) => (
                        <li key={label} className="grid gap-0.5">
                          <span className="text-ink-3 text-[13px]">{label}</span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-ink-1 decoration-line-2 hover:decoration-violet break-all underline underline-offset-4"
                          >
                            {workLabel(url)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-ink-3 m-0 text-[15px]">{copy.links.none}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <p className="text-violet-ink m-0 font-mono text-[13px]">
                    {copy.progress(String(progress.done), String(progress.total))}
                  </p>
                  <ul className="m-0 grid list-none gap-2 p-0">
                    {STOP_NUMBERS.map((n) => {
                      const sent = mine.filter((item) => item.stop === n && item.status === 'sent')
                      const review = latestBy(reviews, String(n) as '1').get(founder.email)
                      return (
                        <li key={n} className="flex flex-wrap items-baseline gap-x-3">
                          <span className="text-ink-1 text-[15px]">
                            {stopsCopy.heading(String(n), stopsCopy.names[String(n) as '1'])}
                          </span>
                          <span className="text-ink-3 text-[13px]">
                            {sent.length
                              ? sent.some((item) => item.late)
                                ? copy.stopLate
                                : copy.stopSent
                              : copy.stopNot}
                          </span>
                          {full && review?.rating ? (
                            <span className="text-violet-ink text-[13px]">
                              {stopsCopy.review.ratings[review.rating]}
                            </span>
                          ) : null}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-ink-2 m-0">
              {own ? copy.building.yoursNotYet : copy.building.notYet}
            </p>
          )}
        </section>

        <section className="grid gap-8" aria-labelledby="about">
          <h2 id="about" className="display m-0 text-[clamp(32px,3.6vw,44px)] leading-none">
            {own ? copy.sections.profile : copy.sections.theirProfile}
          </h2>
          {own ? (
            <Profile
              name={founder.name}
              photo={founder.photo}
              initial={founder.profile}
              next={null}
            />
          ) : (
            <ProfileFacts profile={founder.profile} />
          )}
        </section>

        {team ? (
          <section
            className="grid gap-8 rounded-[var(--radius-card)] p-6 shadow-[inset_0_0_0_1px_var(--color-line-2)] md:p-8"
            aria-labelledby="team-only"
          >
            <h2 id="team-only" className="meta text-violet-ink m-0">
              {copy.teamOnly}
            </h2>
            <dl className="m-0 grid gap-5 sm:grid-cols-3">
              {(
                [
                  [copy.teamFields.email, founder.email],
                  [copy.teamFields.track, TRACK_LABELS[trackOf(founder.track)]],
                  [
                    copy.teamFields.pod,
                    seat
                      ? seat.role === 'mentor'
                        ? copy.mentorOf(String(seat.pod))
                        : copy.podOf(String(seat.pod))
                      : '—',
                  ],
                  [
                    copy.teamFields.h1,
                    [
                      founder.h1Archetype,
                      founder.h1Outcome,
                      founder.h1Level && `level ${founder.h1Level}`,
                    ]
                      .filter(Boolean)
                      .join(' · ') || '—',
                  ],
                  [
                    copy.teamFields.level,
                    consoleCopy.founders.steps[Math.min(founder.level, 5)] ?? '—',
                  ],
                  [copy.teamFields.active, founder.lastActive ? ago(founder.lastActive) : '—'],
                  [
                    copy.teamFields.steps,
                    consoleCopy.founders.stepsOf(String(progress.done), String(progress.due)),
                  ],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label} className="grid gap-1">
                  <dt className="meta">{label}</dt>
                  <dd className="m-0 text-[15px] break-words">{value}</dd>
                </div>
              ))}
            </dl>

            {research ? (
              <div className="grid gap-4">
                <h3 className="meta m-0">{copy.research.title}</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="grid content-start gap-2">
                    <span className="text-ink-3 text-[13px]">{copy.research.apps}</span>
                    {research.apps.map((app) => (
                      <p key={app.name} className="m-0 text-[14px]">
                        <span className="text-ink-1 font-medium">{app.name}</span>
                        <span className="text-ink-2"> · {app.note}</span>
                      </p>
                    ))}
                  </div>
                  <div className="grid content-start gap-2">
                    <span className="text-ink-3 text-[13px]">{copy.research.talks}</span>
                    {research.talks.length
                      ? research.talks.map((talk) => (
                          <p key={talk.who} className="m-0 text-[14px]">
                            <span className="text-ink-1 font-medium">{talk.who}</span>
                            <span className="text-ink-2"> · {talk.breaks}</span>
                            {talk.said ? (
                              <span className="text-ink-3 block italic">{talk.said}</span>
                            ) : null}
                          </p>
                        ))
                      : copy.research.none}
                  </div>
                  <div className="grid content-start gap-2">
                    <span className="text-ink-3 text-[13px]">{copy.research.reading}</span>
                    {research.reading.length
                      ? research.reading.map((url) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-ink-1 text-[14px] break-all"
                          >
                            {workLabel(url)}
                          </a>
                        ))
                      : copy.research.none}
                  </div>
                </div>
              </div>
            ) : null}

            <Link
              href={`/team/messages?f=${founder.slug}`}
              className="btn btn-secondary press w-fit text-[14px]"
            >
              {copy.openThread}
            </Link>

            <div className="grid gap-4">
              <h3 className="meta m-0">{copy.checkins.title}</h3>
              <p className="text-ink-3 m-0 text-[14px]">{copy.checkins.lead}</p>
              {checkins.length ? (
                <ol className="m-0 grid list-none gap-3 p-0">
                  {checkins.map((note) => (
                    <li key={note.id} className="grid gap-1">
                      <span className="text-ink-3 font-mono text-[12px]">
                        {note.author} · {shortDate(note.at)}
                      </span>
                      <p className="m-0 text-[15px] whitespace-pre-line">{note.notes}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-ink-3 m-0 text-[14px]">{copy.checkins.none}</p>
              )}
              <CheckinForm email={founder.email} />
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
