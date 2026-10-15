import { consoleCopy, ownProblem as copy, page } from '@/content/copy'
import { shortDate } from '@/lib/dates'
import { workLabel } from '@/lib/links'
import { stampToIso } from '@/lib/stamp'
import type { Decision } from '@/lib/own-problem'

type Version = {
  version: number
  time: string
  title: string
  person: string
  problem: string
  promise: string
  plan: string
  primary: string
  secondary: string
}
type Review = { version: number; time: string; decision: Decision; by: string; notes: string }

const iso = (stamp: string) => stampToIso(stamp) || stamp

/**
 * A problem as it was sent: its name, the 3Ps, the plan and the research, then
 * every answer it got. Earlier versions fold away underneath, so the founder
 * and the reviewer can see what changed and why.
 */
export function OwnProblemView({
  latest,
  versions,
  reviews,
}: {
  latest: Version
  versions: Version[]
  reviews: Review[]
}) {
  const answersTo = (version: number) => reviews.filter((item) => item.version === version)
  const earlier = versions.filter((item) => item.version !== latest.version).reverse()
  return (
    <div className="grid gap-8">
      <Answers items={answersTo(latest.version)} />
      <Sent version={latest} />
      {earlier.length ? (
        <details className="border-line group border-t pt-5">
          <summary className="text-ink-2 hover:text-ink-1 cursor-pointer text-[14px]">
            {copy.earlier}
          </summary>
          <div className="grid gap-8 pt-6">
            {earlier.map((item) => (
              <div key={item.version} className="grid gap-5">
                <Answers items={answersTo(item.version)} />
                <Sent version={item} />
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  )
}

/** The answers to one version, newest first. */
export function Answers({ items }: { items: Review[] }) {
  if (!items.length) return null
  return (
    <ul className="m-0 grid list-none gap-3 p-0">
      {[...items].reverse().map((item) => (
        <li
          key={`${item.version}-${item.time}`}
          className={`grid gap-1.5 rounded-xl px-4 py-3.5 shadow-[inset_0_0_0_1px_var(--color-line-2)] ${item.decision === 'rejected' ? 'bg-white/[0.02]' : 'bg-violet/10'}`}
        >
          <span className="meta text-[11px]">
            {consoleCopy.reviews.answers[item.decision]} ·{' '}
            {consoleCopy.reviews.answeredBy(item.by, shortDate(iso(item.time)))}
          </span>
          {item.notes ? (
            <p className="user-text text-ink-1 m-0 text-[15px] leading-relaxed whitespace-pre-line">
              {item.notes}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

function Sent({ version }: { version: Version }) {
  return (
    <article className="grid gap-5">
      <div className="grid gap-1">
        <span className="meta text-[11px]">
          {copy.version(version.version)} · {copy.sentOn(shortDate(iso(version.time)))}
        </span>
        <h2 className="section-title user-text m-0">{version.title}</h2>
      </div>
      <dl className="m-0 grid gap-4">
        {(['person', 'problem', 'promise', 'plan'] as const).map((key) => (
          <div key={key} className="grid gap-1">
            <dt className="meta text-[11px]">{page.threeP[key]}</dt>
            <dd className="user-text text-ink-1 m-0 text-[15px] leading-relaxed whitespace-pre-line">
              {version[key]}
            </dd>
          </div>
        ))}
        {(['primary', 'secondary'] as const).map((key) => (
          <div key={key} className="grid gap-1">
            <dt className="meta text-[11px]">{page.links[key]}</dt>
            <dd className="user-text m-0 text-[15px]">
              <a href={version[key]} target="_blank" rel="noreferrer" className="text-violet-ink">
                {workLabel(version[key])}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
