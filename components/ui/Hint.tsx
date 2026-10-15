import { Lightbulb } from 'lucide-react'
import type { ReactNode } from 'react'

/** A small aside with a bulb: where to look when a founder is not sure how. */
export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="text-ink-2 m-0 flex items-start gap-3 rounded-xl bg-white/[0.03] px-4 py-3.5 text-[14px] leading-relaxed shadow-[inset_0_0_0_1px_var(--color-line)]">
      <Lightbulb size={16} strokeWidth={1.5} aria-hidden="true" className="text-violet-ink mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  )
}
