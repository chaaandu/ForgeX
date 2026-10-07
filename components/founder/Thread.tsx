import { page as copy, why as whyCopy } from '@/content/copy'
import type { PickStatus, Pick, Response } from '@/lib/data/picks'
import { shortDate } from '@/lib/dates'
import { nameOf } from '@/lib/team-name'
import type { Problem } from '@/lib/problem'

export type ThreadEntry = {
  pick: Pick
  responses: Response[]
  status: PickStatus
  problem: Problem | null
  title: string
}

/** Every why a founder has sent and every answer we gave, oldest first. */
export function Thread({
  entries,
  authors = false,
}: {
  entries: ThreadEntry[]
  authors?: boolean
}) {
  return (
    <ol className="m-0 grid list-none gap-8 p-0">
      {entries.map((entry) => (
        <li key={entry.pick.id} className="grid gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="display m-0 text-[24px] leading-tight">{entry.title}</p>
            <span className="text-ink-3 font-mono text-[12px] whitespace-nowrap">
              {copy.sentOn(shortDate(entry.pick.submittedAt))}
            </span>
          </div>
          {entry.pick.custom ? (
            <div className="text-ink-2 grid gap-2 rounded-xl px-4 py-3 text-[15px] shadow-[inset_0_0_0_1px_var(--color-line)]">
              <span className="meta text-[11px]">{copy.own}</span>
              <p className="m-0">{entry.pick.custom.problem}</p>
              <p className="text-ink-1 m-0">{entry.pick.custom.challenge}</p>
            </div>
          ) : null}
          <dl className="m-0 grid gap-4">
            {(['whyProblem', 'whyUser', 'whyPay'] as const).map((field) => (
              <div key={field} className="grid gap-1.5">
                <dt className="meta text-[11px]">{whyCopy.prompts[field].label}</dt>
                <dd className="text-ink-2 m-0 text-[15px] leading-relaxed whitespace-pre-line">
                  {entry.pick[field]}
                </dd>
              </div>
            ))}
            {entry.pick.contact ? (
              <div className="grid gap-1.5">
                <dt className="meta text-[11px]">{whyCopy.prompts.contact.label}</dt>
                <dd className="text-ink-2 m-0 text-[15px] leading-relaxed whitespace-pre-line">
                  {entry.pick.contact}
                </dd>
              </div>
            ) : null}
          </dl>
          {entry.responses.map((response) => (
            <div
              key={response.id}
              className="grid gap-2 rounded-2xl p-5 shadow-[inset_0_0_0_1px_rgb(124_77_204/0.45)]"
              style={{ background: 'color-mix(in oklab, var(--color-violet) 7%, transparent)' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-violet-ink text-[15px] font-semibold">
                  {copy.status[response.type]}
                </span>
                <span className="text-ink-3 font-mono text-[12px]">
                  {authors && response.author ? copy.teamBy(nameOf(response.author)) : copy.team} ·{' '}
                  <span className="whitespace-nowrap">{shortDate(response.sentAt)}</span>
                </span>
              </div>
              {response.note ? (
                <p className="m-0 text-[16px] leading-relaxed whitespace-pre-line">
                  {response.note}
                </p>
              ) : null}
            </div>
          ))}
          {entry.pick.withdrawnAt ? (
            <p className="text-ink-3 m-0 font-mono text-[12px]">
              {copy.withdrawnOn(shortDate(entry.pick.withdrawnAt))}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
