import { problem as copy } from '@/content/copy'
import type { FounderProblem } from '@/lib/problem'

/**
 * A matched problem: the title, what is broken, the challenge and the reasons
 * it was matched. Nothing else: no rarity, no score, nothing that ranks one
 * problem above another in a founder's eyes. Finding the user, the market and
 * the product is the founder's work, so none of that is here.
 */
export function ProblemCard({
  problem,
  note,
  as: Tag = 'article',
  onOpen,
}: {
  problem: FounderProblem
  note?: string
  as?: 'article' | 'div'
  onOpen?: () => void
}) {
  const inner = (
    <>
      {note ? <span className="meta text-violet-ink">{note}</span> : null}
      <h3 className="display m-0 text-[26px] leading-[1.05]">{problem.title}</h3>
      <p className="text-ink-2 m-0 text-[15px] leading-relaxed">{problem.problem}</p>
      <p className="m-0 grid gap-1.5 rounded-xl bg-black/25 px-4 py-3.5 text-[15px] leading-snug shadow-[inset_0_0_0_1px_var(--color-line)]">
        <span className="meta text-[11px]">{copy.challenge}</span>
        {problem.challenge}
      </p>
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
  return <Tag className={base}>{inner}</Tag>
}
