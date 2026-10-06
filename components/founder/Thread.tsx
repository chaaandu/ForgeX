import { page as copy, why as whyCopy } from '@/content/copy'
import type { PickStatus, Pick, Response } from '@/lib/data/picks'
import { shortDate } from '@/lib/dates'
import type { Problem } from '@/lib/problem'

export type ThreadEntry = {
  pick: Pick
  responses: Response[]
  status: PickStatus
  problem: Problem | null
  title: string
}

/** Every why a founder has sent and every answer we gave, oldest first. */
export function Thread({ entries }: { entries: ThreadEntry[] }) {
  return (
    <ol className="m-0 grid list-none gap-8 p-0">
      {entries.map((entry) => (
        <li key={entry.pick.id} className="grid gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="display m-0 text-[24px] leading-tight">{entry.title}</p>
            <span className="font-mono text-[12px] whitespace-nowrap text-ink-3">{copy.sentOn(shortDate(entry.pick.submittedAt))}</span>
          </div>
          {entry.pick.custom ? (
            <div className="grid gap-2 rounded-xl px-4 py-3 text-[15px] text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <span className="meta text-[11px]">{copy.own}</span>
              <p className="m-0">{entry.pick.custom.problem}</p>
              <p className="m-0 text-ink-1">{entry.pick.custom.challenge}</p>
            </div>
          ) : null}
          <dl className="m-0 grid gap-4">
            {(['whyProblem', 'whyUser', 'whyPay'] as const).map((field) => (
              <div key={field} className="grid gap-1.5">
                <dt className="meta text-[11px]">{whyCopy.prompts[field].label}</dt>
                <dd className="m-0 text-[15px] leading-relaxed whitespace-pre-line text-ink-2">{entry.pick[field]}</dd>
              </div>
            ))}
            {entry.pick.contact ? (
              <div className="grid gap-1.5">
                <dt className="meta text-[11px]">{whyCopy.prompts.contact.label}</dt>
                <dd className="m-0 text-[15px] leading-relaxed whitespace-pre-line text-ink-2">{entry.pick.contact}</dd>
              </div>
            ) : null}
          </dl>
          {entry.responses.map((response) => (
            <div
              key={response.id}
              className="grid gap-2 rounded-2xl p-5 shadow-[inset_0_0_0_1px_rgb(255_72_176/0.45)]"
              style={{ background: 'color-mix(in oklab, var(--color-pink) 7%, transparent)' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[15px] font-semibold text-pink-ink">{copy.status[response.type]}</span>
                <span className="font-mono text-[12px] text-ink-3">
                  {copy.team} · <span className="whitespace-nowrap">{shortDate(response.sentAt)}</span>
                </span>
              </div>
              {response.note ? <p className="m-0 text-[16px] leading-relaxed whitespace-pre-line">{response.note}</p> : null}
            </div>
          ))}
          {entry.pick.withdrawnAt ? <p className="m-0 font-mono text-[12px] text-ink-3">{copy.withdrawnOn(shortDate(entry.pick.withdrawnAt))}</p> : null}
        </li>
      ))}
    </ol>
  )
}
