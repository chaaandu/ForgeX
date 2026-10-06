import { DIFFICULTY_LABEL } from '@/lib/problem'
import type { Difficulty } from '@/lib/taxonomy'

const COLOR: Record<Difficulty, string> = {
  easy: 'var(--color-ok)',
  medium: 'var(--color-legendary)',
  hard: 'var(--color-mythic)',
}

/** How hard a problem is to build. The team sees this; founders never do. */
export function DifficultyTag({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-[12px] leading-none tracking-[0.08em] uppercase"
      style={{ color: COLOR[difficulty] }}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full"
        style={{ background: COLOR[difficulty] }}
      />
      {DIFFICULTY_LABEL[difficulty]}
    </span>
  )
}
