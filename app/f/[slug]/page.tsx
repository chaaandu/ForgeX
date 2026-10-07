import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CardActions } from '@/components/card/CardActions'
import { FounderCard } from '@/components/card/FounderCard'
import { PickStatus } from '@/components/founder/PickStatus'
import { ProfileFacts } from '@/components/founder/ProfileFacts'
import { Thread } from '@/components/founder/Thread'
import { Profile } from '@/components/levels/Profile'
import { Brand } from '@/components/shell/Brand'
import { LayoutDashboard, Users } from 'lucide-react'
import { Account } from '@/components/shell/Account'
import { HeaderLink } from '@/components/shell/HeaderLink'
import { archetypes, consoleCopy, families, levels, meta, page as copy } from '@/content/copy'
import { ARCHETYPES } from '@/lib/archetype'
import { isBuilding } from '@/lib/building'
import { founderContext } from '@/lib/context'
import { founderBySlug } from '@/lib/data/founders'
import { bank } from '@/lib/data/problems'
import { forFounder } from '@/lib/problem'
import { ago } from '@/lib/dates'
import { currentPath } from '@/lib/journey'
import { requireViewer } from '@/lib/session'
import { INTENTS, labelOf } from '@/lib/taxonomy'
import { world as worldCopy } from '@/content/copy'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const founder = await founderBySlug((await params).slug)
  return { title: founder?.name ?? meta.title, robots: { index: false, follow: false } }
}

const NEXT_LEVEL = ['Arrive', 'Archetype', 'Profile', 'Your world', 'Matches', 'Matches']

/**
 * A founder's permanent page: their card, who they are, their pick and its
 * status, and the whole thread with the team. The founder and the team see
 * all of it. Once the team has said go, the rest of the cohort can see the
 * card, the problem and the profile, never the thread. Anyone else gets a 404,
 * not a refusal that confirms the page exists.
 */
export default async function FounderPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireViewer()
  const { slug } = await params
  const founder = await founderBySlug(slug)
  const own = Boolean(founder && viewer.role === 'founder' && viewer.email === founder.email)
  if (!founder) notFound()
  const team = viewer.role === 'team'
  if (!own && !team && !(await isBuilding(founder.slug))) notFound()
  const full = own || team

  const [context, problems] = await Promise.all([founderContext(founder), bank()])
  const kind = founder.archetype ? ARCHETYPES[founder.archetype] : null
  const latest = [...context.entries].reverse().find((entry) => !entry.pick.withdrawnAt) ?? null
  const latestResponse = latest?.responses.at(-1)
  const suggested = (latestResponse?.suggested ?? [])
    .map((id) => problems.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map(forFounder)
  const world = founder.world

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 pt-5 md:px-10 md:pt-7">
        <Brand href={team ? '/team' : '/'} />
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
        {own && founder.level < 6 ? (
          <Link href={currentPath(founder)} className="btn btn-primary press w-fit">
            {copy.continue(NEXT_LEVEL[founder.level] ?? levels.names.matches)}
          </Link>
        ) : null}

        <section className="grid items-center gap-10 md:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          <div className="grid justify-items-center gap-5 md:justify-items-start">
            <FounderCard data={context.card} size="lg" tilt priority />
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

        {latest && !full ? (
          <section className="panel grid gap-4 p-6 md:p-8" aria-labelledby="pick-title">
            <span className="meta">{copy.building}</span>
            <h2
              id="pick-title"
              className="display m-0 text-[clamp(28px,3.4vw,40px)] leading-[1.05]"
            >
              {latest.title}
            </h2>
            <p className="text-ink-2 m-0 text-[16px]">
              {latest.problem?.challenge ?? latest.pick.custom?.challenge ?? ''}
            </p>
          </section>
        ) : null}

        {full && latest ? (
          <section className="border-line grid gap-6 border-t pt-12" aria-labelledby="problem">
            <h2 id="problem" className="display m-0 text-[clamp(32px,3.6vw,44px)] leading-none">
              {own ? copy.sections.problem : copy.sections.theirProblem}
            </h2>
            <PickStatus
              title={latest.title}
              challenge={latest.problem?.challenge ?? latest.pick.custom?.challenge ?? ''}
              status={latest.status}
              note={latestResponse?.note ?? ''}
              suggested={suggested}
              own={own}
              reviseHref={latest.pick.problemId ? '/why?revise=1' : '/matches/new?revise=1'}
            />
            {context.entries.length ? (
              <div
                className="grid gap-6 rounded-[var(--radius-card)] p-6 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-8"
                aria-labelledby="thread"
              >
                <h3 id="thread" className="meta m-0">
                  {own ? copy.thread : copy.threadTeam}
                </h3>
                <Thread entries={context.entries} authors={team} />
              </div>
            ) : null}
          </section>
        ) : null}

        {team ? (
          <section
            className="grid gap-5 rounded-[var(--radius-card)] p-6 shadow-[inset_0_0_0_1px_var(--color-line-2)] md:p-8"
            aria-labelledby="team-only"
          >
            <h2 id="team-only" className="meta text-violet-ink m-0">
              {copy.teamOnly}
            </h2>
            <dl className="m-0 grid gap-5 sm:grid-cols-3">
              {(
                [
                  [copy.teamFields.email, founder.email],
                  [copy.teamFields.track, founder.track],
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
                  [copy.teamFields.level, `${founder.level} of 6`],
                  [copy.teamFields.active, founder.lastActive ? ago(founder.lastActive) : '—'],
                  [
                    copy.teamFields.comfort,
                    world
                      ? `${world.comfort} of 5 · ${worldCopy.comfort.stops[world.comfort - 1] ?? ''}`
                      : '—',
                  ],
                  [
                    copy.teamFields.intent,
                    world ? (INTENTS.find((item) => item.id === world.intent)?.label ?? '') : '—',
                  ],
                  [
                    copy.teamFields.world,
                    world
                      ? [
                          ...world.industries.map((id) =>
                            id === 'other'
                              ? (world.industryOther ?? 'Other')
                              : labelOf.industryShort(id),
                          ),
                          world.side,
                        ].join(', ')
                      : '—',
                  ],
                  [
                    copy.teamFields.access,
                    world && world.access.length
                      ? world.access
                          .map(
                            (entry) =>
                              `${entry.kind === 'other' ? (entry.other ?? 'Other') : labelOf.access(entry.kind)} (${entry.worlds.map((id) => (id === 'elsewhere' ? (entry.elsewhere ?? 'elsewhere') : labelOf.industryShort(id))).join(', ')})`,
                          )
                          .join('; ')
                      : '—',
                  ],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label} className="grid gap-1">
                  <dt className="meta">{label}</dt>
                  <dd className="m-0 text-[15px] break-words">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </main>
    </div>
  )
}
