import { problem as copy } from '@/content/copy'
import type { FounderProblem } from '@/lib/problem'

/**
 * A matched problem: the 2-day challenge as its headline, what is broken under
 * it, and how many others are on it. Nothing else: no difficulty, no score,
 * nothing that ranks one problem above another in a founder's eyes.
 */
export function ProblemCard({
  problem,
  others = 0,
  onOpen,
}: {
  problem: FounderProblem
  others?: number
  onOpen?: () => void
}) {
  const inner = (
    <>
      <h3 className="display m-0 text-[26px] leading-[1.08]">{problem.challenge}</h3>
      <p className="text-ink-2 m-0 text-[15px] leading-relaxed">{problem.problem}</p>
      {others > 0 ? <span className="meta text-[11px]">{copy.others(others)}</span> : null}
    </>
  )
  const base = 'panel relative grid content-start gap-4 self-start p-6 text-left'
  if (onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={`${base} press text-ink-1 w-full cursor-pointer border-0 hover:-translate-y-0.5`}
      >
        {inner}
      </button>
    )
  }
  return <article className={base}>{inner}</article>
}
