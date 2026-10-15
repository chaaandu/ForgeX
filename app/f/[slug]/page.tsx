import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LayoutDashboard, Users } from 'lucide-react'
import { BuildShell } from '@/components/build/BuildShell'
import { PersonCard } from '@/components/build/PersonCard'
import { ProgressTrack } from '@/components/build/ProgressTrack'
import { CardActions } from '@/components/card/CardActions'
import { FounderCard } from '@/components/card/FounderCard'
import { ProfileFacts } from '@/components/founder/ProfileFacts'
import { SocialLinks } from '@/components/founder/SocialLinks'
import { Profile } from '@/components/levels/Profile'
import { OwnProblemView } from '@/components/problem/OwnProblemView'
import { Account } from '@/components/shell/Account'
import { Brand } from '@/components/shell/Brand'
import { HeaderLink } from '@/components/shell/HeaderLink'
import { ReopenToggle } from '@/components/team/ReopenToggle'
import {
  archetypes,
  consoleCopy,
  families,
  home,
  levels,
  meta,
  page as copy,
  world as worldCopy,
} from '@/content/copy'
import { ARCHETYPES } from '@/lib/archetype'
import { founderContext } from '@/lib/context'
import { founderBySlug } from '@/lib/data/founders'
import { researchDone, statusWord } from '@/lib/data/hackathon'
import { ago } from '@/lib/dates'
import { clock, phaseAt, STAGE_IDS } from '@/lib/hackathon'
import { currentPath } from '@/lib/journey'
import { LINK_FIELDS, workLabel } from '@/lib/links'
import { requireViewer } from '@/lib/session'
import { staffOf } from '@/lib/staff'
import { nextDue, stepsFor } from '@/lib/steps'
import { fieldsOf, type SubmissionField } from '@/lib/submission'
import { BUILD_WITH, labelOf } from '@/lib/taxonomy'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const founder = await founderBySlug((await params).slug)
  return { title: founder?.name ?? meta.title, robots: { index: false, follow: false } }
}

/**
 * A founder's permanent page: their card, who they are, how far they have
 * got, the problem they are building and what they have submitted. The
 * founder and the team see all of it. Once a founder has a problem to build
 * the rest of the cohort sees the page too, with only the product and the
 * repo among the links. Anyone else gets a 404, not a refusal that confirms
 * the page exists.
 */
export default async function FounderPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireViewer()
  const { slug } = await params
  const founder = await founderBySlug(slug)
  if (!founder) notFound()
  const own = viewer.role === 'founder' && viewer.email.toLowerCase() === founder.email
  const team = viewer.role === 'team'
  const context = await founderContext(founder)
  const building = context.building
  // The cohort sees a founder once they are building, and never one who asked to stay off the wall.
  if (!own && !team && !(building && founder.wall)) notFound()
  const full = own || team
  const entry = context.entry
  const staff = team ? staffOf(viewer.email) : null
  // Only a deadline that locks can be reopened; the MVP scope never does.
  const locked = phaseAt(clock()).locked
  const passed = (['problem', ...STAGE_IDS] as const).filter((step) => locked[step])

  const kind = founder.archetype ? ARCHETYPES[founder.archetype] : null
  const world = founder.world
  // Only links from a stage that has been submitted; the cohort sees the product and the repo.
  const links: SubmissionField[] = entry
    ? STAGE_IDS.filter((stage) => entry.sentAt[stage]).flatMap((stage) =>
        fieldsOf(stage)
          .map((field) => field.id)
          .filter((id) => entry.fields[id] && (full || id === 'live' || id === 'github')),
      )
    : []
  const live = entry?.sentAt.launch ? (entry.fields.live ?? '') : ''
  const research =
    full && entry ? (['primary', 'secondary'] as const).filter((key) => entry.research[key]) : []

  const body = (
    <div className="grid gap-16">
      {own && founder.level < 3 ? (
        <Link href={currentPath(founder)} className="btn btn-primary press w-fit">
          {copy.continue(
            levels.names[
              founder.level <= 0 ? 'arrive' : founder.level === 1 ? 'archetype' : 'profile'
            ],
          )}
        </Link>
      ) : null}

      <section className="grid items-center gap-10 md:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
        <div className="grid justify-items-center gap-5 md:justify-items-start">
          <FounderCard data={context.card} size="lg" tilt priority glow="always" />
          {full ? <CardActions slug={founder.slug} name={founder.name} /> : null}
        </div>
        <div className="grid gap-4">
          <h1 className="display m-0 text-[clamp(48px,7vw,96px)] leading-[0.92]">{founder.name}</h1>
          {kind && founder.level >= 2 ? (
            <p className="display text-violet-ink m-0 text-[clamp(22px,2.6vw,30px)] italic">
              {families[kind.family].name} · {archetypes[kind.id].name}
            </p>
          ) : null}
          <SocialLinks
            name={founder.first || founder.name}
            github={founder.profile.github}
            linkedin={founder.profile.linkedin}
            live={live}
            site={founder.profile.portfolio}
          />
          {entry && entry.state !== 'none' ? (
            <div className="max-w-[420px] pt-4">
              <ProgressTrack value={context.progress} parts={context.parts} size="lg" />
            </div>
          ) : null}
        </div>
      </section>

      {building ? (
        <section
          className="panel grid min-w-0 gap-6 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)] md:gap-10 md:p-8"
          aria-labelledby="pick-title"
        >
          <div className="grid min-w-0 content-start gap-4">
            <span className="meta">{own ? copy.sections.problem : copy.building}</span>
            <h2 id="pick-title" className="section-title user-text m-0">
              {building.title}
            </h2>
            <p className="user-text text-ink-2 m-0 max-w-[62ch] text-[15px] leading-relaxed">
              {building.problem?.problem ?? building.own?.problem}
            </p>
            {building.own ? (
              <dl className="m-0 grid gap-3">
                {(full ? (['person', 'promise'] as const) : (['promise'] as const)).map((key) => (
                  <div key={key} className="grid gap-1">
                    <dt className="meta text-[11px]">{copy.threeP[key]}</dt>
                    <dd className="user-text text-ink-1 m-0 text-[15px] leading-relaxed">
                      {building.own?.[key]}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <div className="grid min-w-0 content-start gap-5">
            {full ? (
              <PersonCard name={building.poc}>{own ? home.pocLead : null}</PersonCard>
            ) : null}
            {links.length || research.length ? (
              <dl
                className="m-0 grid gap-4"
                aria-label={own ? copy.sections.built : copy.sections.theirBuilt}
              >
                {[...research, ...links].map((id) => {
                  const value =
                    id === 'primary' || id === 'secondary'
                      ? (entry?.research[id] ?? '')
                      : (entry?.fields[id] ?? '')
                  return (
                    <div key={id} className="grid gap-1">
                      <dt className="meta text-[11px]">{copy.links[id]}</dt>
                      <dd className="user-text m-0 grid gap-1 text-[15px]">
                        {value.split('\n').map((url) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-violet-ink"
                          >
                            {workLabel(url)}
                          </a>
                        ))}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            ) : null}
          </div>
        </section>
      ) : null}

      {own || LINK_FIELDS.some((field) => founder.profile[field]) ? (
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
      ) : null}

      {team ? (
        <section
          className="grid gap-6 rounded-[var(--radius-card)] p-6 shadow-[inset_0_0_0_1px_var(--color-line-2)] md:p-8"
          aria-labelledby="team-only"
        >
          <h2 id="team-only" className="meta text-violet-ink m-0">
            {copy.teamOnly}
          </h2>
          <dl className="m-0 grid gap-5 sm:grid-cols-3">
            {(
              [
                [copy.teamFields.email, founder.email],
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
                  copy.teamFields.stage,
                  entry && entry.state !== 'none'
                    ? statusWord(entry)
                    : (consoleCopy.founders.steps[Math.min(founder.level, 4)] ?? '—'),
                ],
                [
                  copy.teamFields.progress,
                  <div key="progress" className="max-w-[300px] pt-1">
                    <ProgressTrack value={context.progress} parts={context.parts} size="sm" />
                  </div>,
                ],
                [copy.teamFields.reviewer, entry?.reviewer || '—'],
                [copy.teamFields.poc, entry?.poc || '—'],
                [copy.teamFields.active, founder.lastActive ? ago(founder.lastActive) : '—'],
                [
                  copy.teamFields.world,
                  world
                    ? [
                        ...world.industries.map((id) =>
                          id === 'other'
                            ? (world.industryOther ?? worldCopy.industries.other)
                            : labelOf.industryShort(id),
                        ),
                        world.side === 'unsure'
                          ? worldCopy.side.options.unsure.label
                          : labelOf.side(world.side),
                        ...world.learn.map(
                          (id) => BUILD_WITH.find((item) => item.id === id)?.label ?? id,
                        ),
                      ].join(', ')
                    : '—',
                ],
              ] as [string, ReactNode][]
            ).map(([label, value]) => (
              <div key={label} className="grid content-start gap-1">
                <dt className="meta">{label}</dt>
                <dd className="m-0 text-[15px] break-words">{value}</dd>
              </div>
            ))}
          </dl>
          {entry?.latest ? (
            <div className="border-line grid gap-5 border-t pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="section-title m-0">{copy.sections.history}</h3>
                {entry.state === 'waiting' ? (
                  <Link href="/team/reviews" className="btn btn-secondary press min-h-10">
                    {copy.review}
                  </Link>
                ) : null}
              </div>
              <OwnProblemView
                latest={entry.latest}
                versions={entry.versions}
                reviews={entry.reviews}
              />
            </div>
          ) : null}
          {staff?.admin && entry && (passed.length || entry.reopened.size) ? (
            <ReopenToggle slug={founder.slug} open={[...entry.reopened]} passed={passed} />
          ) : null}
        </section>
      ) : null}
    </div>
  )

  // A founder past onboarding keeps the same bar as their home, clock and all.
  if (own && founder.level >= 3) {
    const now = clock()
    const phase = phaseAt(now)
    const steps = stepsFor(
      {
        state: entry?.state ?? 'none',
        sentAt: entry?.sentAt ?? { scope: '', prototype: '', launch: '', pitch: '' },
        fields: entry?.fields ?? {},
        reopened: entry ? [...entry.reopened] : [],
        researchDone: entry ? researchDone(entry) : false,
        answered: Boolean(founder.world),
      },
      phase,
    )
    return (
      <BuildShell
        slug={founder.slug}
        next={nextDue(steps, phase)}
        now={now.toISOString()}
        ownProblem={entry?.state !== 'bank'}
      >
        {body}
      </BuildShell>
    )
  }

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
      <main className="mx-auto max-w-[1240px] px-5 pt-10 pb-24 md:px-10 md:pt-14">{body}</main>
    </div>
  )
}
