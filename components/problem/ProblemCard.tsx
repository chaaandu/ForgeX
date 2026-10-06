import type { Problem } from '@/lib/problem'
import { RarityTag, rarityColor } from '@/components/ui/RarityTag'

/**
 * A matched problem: the title, what is broken, the challenge, its rarity and
 * the reasons it was matched. Nothing else. Finding the user, the market and
 * the product is the founder's work, so none of that is here.
 */
export function ProblemCard({
  problem,
  chips,
  note,
  as: Tag = 'article',
  onOpen,
}: {
  problem: Problem
  chips: string[]
  note?: string
  as?: 'article' | 'div'
  onOpen?: () => void
}) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-x-6 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${rarityColor(problem.rarity)}, transparent)` }}
      />
      <div className="flex items-center justify-between gap-3">
        <RarityTag rarity={problem.rarity} />
        {note ? <span className="meta">{note}</span> : null}
      </div>
      <h3 className="display m-0 text-[26px] leading-[1.05]">{problem.title}</h3>
      <p className="clamp-3 m-0 text-[15px] leading-relaxed text-ink-2">{problem.problem}</p>
      <p className="m-0 grid gap-1.5 rounded-xl bg-black/25 px-4 py-3.5 text-[15px] leading-snug shadow-[inset_0_0_0_1px_var(--color-line)]">
        <span className="meta text-[11px]">Challenge</span>
        {problem.challenge}
      </p>
      {chips.length ? (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Why this fits you">
          {chips.map((chip) => (
            <li key={chip} className="tag">
              {chip}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
  const base = 'panel relative grid content-start gap-4 self-start p-6 text-left'
  if (onOpen) {
    return (
      <button type="button" onClick={onOpen} className={`${base} press w-full cursor-pointer border-0 text-ink-1 hover:-translate-y-0.5`}>
        {inner}
      </button>
    )
  }
  return <Tag className={base}>{inner}</Tag>
}
