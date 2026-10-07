import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BuildShell } from '@/components/build/BuildShell'
import { Messages } from '@/components/build/Messages'
import { LevelShell } from '@/components/shell/LevelShell'
import { messages as copy, meta } from '@/content/copy'
import { stepsOf } from '@/lib/build'
import { founderContext } from '@/lib/context'
import { shortDate } from '@/lib/dates'
import { threadOf } from '@/lib/data/messages'
import { seats } from '@/lib/data/pods'
import { currentPath, mayEnter } from '@/lib/journey'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.messages }

/**
 * A founder's thread with the team. Open from the challenge on, so someone
 * stuck in their research can ask too. Team replies show as the team, never
 * as the person who wrote them.
 */
export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>
}) {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'research')) redirect(currentPath(founder))
  const [{ step }, context, thread, seatMap] = await Promise.all([
    searchParams,
    founderContext(founder),
    threadOf(founder.email),
    seats(),
  ])
  const steps = stepsOf(founder)
  const titles = new Map(steps.map((item) => [item.id, item.title]))
  const tagged = step && titles.has(step) ? { id: step, title: titles.get(step) ?? '' } : null
  const body = (
    <div className="grid max-w-[680px] gap-8">
      <div className="grid gap-3">
        <h1 className="display m-0 text-[clamp(40px,5vw,60px)] leading-none">{copy.title}</h1>
        <p className="text-lead text-ink-2 m-0 max-w-[48ch]">{copy.lead}</p>
      </div>
      <Messages
        step={tagged}
        thread={thread.map((line) => ({
          id: line.id,
          mine: line.from === founder.email,
          text: line.text,
          screenshot: line.screenshot,
          about: titles.get(line.stepId) ?? '',
          at: shortDate(line.at),
        }))}
      />
    </div>
  )
  if (context.research?.sent) {
    return (
      <BuildShell
        card={context.card}
        slug={founder.slug}
        pod={seatMap.get(founder.email)?.role === 'mentor'}
      >
        {body}
      </BuildShell>
    )
  }
  return (
    <LevelShell level="research" card={context.card}>
      <div className="grid gap-8">
        <Link href="/research" className="btn btn-quiet press w-fit px-0 text-[14px]">
          {copy.back}
        </Link>
        {body}
      </div>
    </LevelShell>
  )
}
