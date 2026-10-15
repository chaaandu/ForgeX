'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Bullets } from '@/components/problem/Bullets'
import { problem as copy } from '@/content/copy'
import type { FounderProblem } from '@/lib/problem'
import { labelOf } from '@/lib/taxonomy'

/**
 * The full problem, with one thing to do: the 2-day challenge as its headline,
 * what is broken, what we expect to see working, and where to take it further. A bottom sheet
 * on a phone, a dialog on anything wider.
 */
export function ProblemSheet({
  problem,
  others = 0,
  open,
  onOpenChange,
  action,
}: {
  problem: FounderProblem | null
  others?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  action?: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px]" />
        <Dialog.Content
          className="sheet panel quiet-scroll fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-b-none p-6 pb-8 outline-none md:inset-auto md:top-1/2 md:left-1/2 md:w-[min(760px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[var(--radius-sheet)] md:p-10"
          aria-describedby={undefined}
        >
          {problem ? (
            <div className="grid gap-6">
              <div className="flex items-center justify-between gap-4">
                <span className="meta text-[11px]">{others > 0 ? copy.others(others) : ''}</span>
                <Dialog.Close
                  className="btn btn-quiet press -mr-3 min-h-10 px-3"
                  aria-label={copy.close}
                >
                  <X size={16} strokeWidth={1.5} />
                </Dialog.Close>
              </div>
              <div className="grid gap-3">
                <span className="meta text-[11px]">{copy.challenge}</span>
                <Dialog.Title className="display m-0 text-[clamp(28px,3.8vw,40px)] leading-[1.06]">
                  {problem.challenge}
                </Dialog.Title>
              </div>
              <p className="text-ink-2 m-0 max-w-[62ch] text-[16px] leading-relaxed">
                {problem.problem}
              </p>
              <section className="grid gap-3" aria-labelledby="sheet-expect">
                <h3 id="sheet-expect" className="meta m-0 text-[11px]">
                  {copy.expect}
                </h3>
                <Bullets items={problem.expect} label={copy.expect} />
              </section>
              {problem.further.length ? (
                <section className="grid gap-3" aria-labelledby="sheet-further">
                  <h3 id="sheet-further" className="meta m-0 text-[11px]">
                    {copy.further}
                  </h3>
                  <Bullets items={problem.further} label={copy.further} tone="quiet" />
                </section>
              ) : null}
              <dl className="border-line m-0 grid gap-2 border-t pt-5">
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
