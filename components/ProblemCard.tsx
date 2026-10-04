import { copy } from '@/lib/copy'
import type { Problem } from '@/lib/types'
import { CardBet } from './CardBet'
import { CardLink } from './CardLink'
import { TagPill } from './TagPill'

/**
 * Collapsed card: tag, cluster, ID, title, Problem and Who. Nothing else.
 * The whole card is the control.
 */
export function ProblemCard({ problem, href }: { problem: Problem; href: string }) {
  return (
    <CardLink href={href} problemId={problem.id} label={`${problem.id}. ${problem.title}`}>
      <span className="flex items-center gap-2 pr-10">
        <TagPill tag={problem.tag} />
        <span className="text-muted truncate text-[13px]">{problem.cluster}</span>
      </span>

      <span className="text-muted font-mono text-[11px] tracking-[0.1em]">{problem.id}</span>

      <span className="title text-primary">{problem.title}</span>

      <span className="clamp-3 text-secondary text-[14px]">{problem.problem}</span>

      <span className="mt-auto flex flex-col gap-1 pt-1">
        <span className="label">{copy.card.whoLabel}</span>
        <span className="clamp-2 text-muted text-[13px]">{problem.who}</span>
      </span>

      <span className="flex h-5 items-center">
        <CardBet problemId={problem.id} tag={problem.tag} />
      </span>
    </CardLink>
  )
}
