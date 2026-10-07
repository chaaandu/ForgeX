import type { Metadata } from 'next'
import { meta } from '@/content/copy'
import { redirect } from 'next/navigation'
import { Composer } from '@/components/levels/Composer'
import { LevelShell } from '@/components/shell/LevelShell'
import { founderContext } from '@/lib/context'
import { currentPath, mayEnter } from '@/lib/journey'
import { closeLabel } from '@/lib/dates'
import { requireFounder } from '@/lib/session'
import { seesBank, trackOf } from '@/lib/tracks'
import { levels } from '@/content/copy'

export const metadata: Metadata = { title: meta.pages.writeOwn }

export default async function ComposerPage({
  searchParams,
}: {
  searchParams: Promise<{ revise?: string }>
}) {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'why')) redirect(currentPath(founder))
  const [{ revise }, context] = await Promise.all([searchParams, founderContext(founder)])
  const ownOnly = !seesBank(trackOf(founder.track))
  const current = context.current
  // Their own problem, sent back after Needs a tweak: everything as they left it.
  const revision =
    revise && context.tweak && current?.pick.custom
      ? {
          note: context.tweak.note,
          custom: current.pick.custom,
          answers: {
            whyProblem: current.pick.whyProblem,
            whyUser: current.pick.whyUser,
            whyPay: current.pick.whyPay,
            contact: current.pick.contact,
          },
        }
      : null
  if (current && current.status !== 'waiting' && !revision) redirect(`/f/${founder.slug}`)
  return (
    <LevelShell
      level={ownOnly ? 'matches' : 'why'}
      card={context.card}
      label={ownOnly ? levels.names.own : undefined}
    >
      <Composer
        card={context.card}
        slug={founder.slug}
        closesAt={closeLabel(process.env.PICKS_CLOSE_AT ?? '')}
        ownOnly={ownOnly}
        revision={revision}
      />
    </LevelShell>
  )
}
