'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { problem as copy } from '@/content/copy'
import type { Problem } from '@/lib/problem'
import { labelOf } from '@/lib/taxonomy'

/**
 * The full problem, with one thing to do. A bottom sheet on a phone, a dialog
 * on anything wider. The action is passed in so the same sheet serves the
 * founder's matches and the team's bank.
 */
export function ProblemSheet({
  problem,
  open,
  onOpenChange,
  action,
}: {
  problem: Problem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  action?: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px]" />
        <Dialog.Content
          className="sheet panel fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-b-none p-6 pb-8 outline-none md:inset-auto md:top-1/2 md:left-1/2 md:w-[min(720px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[var(--radius-sheet)] md:p-10"
          aria-describedby={undefined}
        >
          {problem ? (
            <div className="grid gap-5">
              <div className="flex items-center justify-end gap-4">
                <Dialog.Close className="btn btn-quiet press -mr-3 min-h-10 px-3" aria-label={copy.close}>
                  <X size={16} strokeWidth={1.5} />
                </Dialog.Close>
              </div>
              <Dialog.Title className="display m-0 text-[clamp(32px,5vw,48px)] leading-[1.02]">{problem.title}</Dialog.Title>
              <p className="m-0 max-w-[62ch] text-[16px] leading-relaxed text-ink-2">{problem.problem}</p>
              <p className="m-0 grid gap-1.5 rounded-xl bg-black/25 px-4 py-4 text-[17px] leading-snug shadow-[inset_0_0_0_1px_var(--color-line)]">
                <span className="meta text-[11px]">{copy.challenge}</span>
                {problem.challenge}
              </p>
              <dl className="m-0 grid gap-2 border-t border-line pt-5">
                <dt className="meta text-[11px]">{copy.learn}</dt>
                <dd className="m-0 flex flex-wrap gap-1.5">
                  {problem.learn.map((id) => (
                    <span key={id} className="tag">
                      {labelOf.learn(id)}
                    </span>
                  ))}
                </dd>
              </dl>
              {action ? <div className="pt-1">{action}</div> : null}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
