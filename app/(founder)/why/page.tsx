import type { Metadata } from 'next'
import { meta } from '@/content/copy'
import { redirect } from 'next/navigation'
import { Why } from '@/components/levels/Why'
import { LevelShell } from '@/components/shell/LevelShell'
import { founderContext } from '@/lib/context'
import { problemById } from '@/lib/data/problems'
import { forFounder } from '@/lib/problem'
import { currentPath, mayEnter } from '@/lib/journey'
import { closeLabel } from '@/lib/dates'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.why }

export default async function WhyPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string; revise?: string }>
}) {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'why')) redirect(currentPath(founder))
  const [{ p, revise }, context] = await Promise.all([searchParams, founderContext(founder)])
  const current = context.current

  // Sending a pick back after Needs a tweak: the same problem, their answers
  // as they left them, and our note pinned on top.
  // Once the change is sent the pick reads as waiting; the page stays put so
  // the Sent screen can show, rather than bouncing to the profile mid-send.
  if (revise) {
    const tweak = context.tweak
    if (!tweak || !current) redirect(`/f/${founder.slug}`)
    if (!current.pick.problemId || !current.problem) redirect('/matches/new?revise=1')
    return (
      <LevelShell level="why" card={context.card}>
        <Why
          problem={forFounder(current.problem)}
          custom={null}
          card={context.card}
          slug={founder.slug}
          closesAt={closeLabel(process.env.PICKS_CLOSE_AT ?? '')}
          initial={{
            whyProblem: current.pick.whyProblem,
            whyUser: current.pick.whyUser,
            whyPay: current.pick.whyPay,
            contact: current.pick.contact,
          }}
          revision={{ note: tweak.note }}
        />
      </LevelShell>
    )
  }

  if (current && current.status !== 'waiting') redirect(`/f/${founder.slug}`)
  const found = p ? await problemById(p) : null
  if (!found || found.status !== 'approved') redirect('/matches')
  return (
    <LevelShell level="why" card={{ ...context.card, problemTitle: found.title }}>
      <Why
        problem={forFounder(found)}
        custom={null}
        card={context.card}
        slug={founder.slug}
        closesAt={closeLabel(process.env.PICKS_CLOSE_AT ?? '')}
      />
    </LevelShell>
  )
}
