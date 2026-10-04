'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { problemSchema } from '@/lib/schema'
import type { Problem } from '@/lib/types'
import { useBets } from './BetsProvider'
import { ModalFooter } from './ModalFooter'
import { useModal } from './ModalState'
import { ProblemDetail } from './ProblemDetail'
import { Stamp } from './Stamp'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * The modal lives entirely in the client: it is handed a problem ID and fetches
 * the rest. Opening, closing and the arrow keys are instant, and the URL is
 * kept in step by ModalState rather than by the router.
 */
export function ProblemModal({ titles }: { titles: Record<string, string> }) {
  const { openId, close, prevId, nextId, goPrev, goNext } = useModal()
  const { bets, entranceFor } = useBets()
  const reduced = useReducedMotion()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [slammed, setSlammed] = useState(false)
  const cache = useRef(new Map<string, Problem>())
  const lastOpened = useRef<string | null>(null)

  useEffect(() => {
    if (!openId) return
    lastOpened.current = openId
    setSlammed(false)

    const cached = cache.current.get(openId)
    if (cached) {
      setProblem(cached)
      return
    }

    let live = true
    setProblem(null)
    void fetch(`/api/problem/${openId}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((body: unknown) => {
        if (!live || !body || typeof body !== 'object') return
        const parsed = problemSchema.safeParse((body as { problem: unknown }).problem)
        if (!parsed.success) return
        cache.current.set(parsed.data.id, parsed.data)
        setProblem(parsed.data)
      })
      .catch(() => undefined)
    return () => {
      live = false
    }
  }, [openId])

  // Focus returns to the card the modal was opened from.
  useEffect(() => {
    if (openId) {
      document.body.dataset.modalOpen = 'true'
      return
    }
    delete document.body.dataset.modalOpen
    const id = lastOpened.current
    if (!id) return
    window.setTimeout(() => {
      document.querySelector<HTMLElement>(`[data-card-id="${id}"]`)?.focus()
    }, 40)
  }, [openId])

  useEffect(() => {
    if (!openId) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (event.key === 'ArrowLeft' && prevId) {
        event.preventDefault()
        goPrev()
      }
      if (event.key === 'ArrowRight' && nextId) {
        event.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId, prevId, nextId, goPrev, goNext])

  const bet = openId ? bets[openId] : undefined
  const tag = problem?.tag ?? 'rare'
  const entrance = openId
    ? slammed
      ? 'slam'
      : entranceFor(openId) === 'none'
        ? 'none'
        : 'fade'
    : 'none'

  return (
    <Dialog.Root open={openId !== null} onOpenChange={(next) => !next && close()}>
      <AnimatePresence>
        {openId && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[8px]"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount aria-labelledby="problem-title">
              <motion.div
                key="content"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.2, ease: EASE }}
                drag={reduced ? false : 'y'}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.4 }}
                onDragEnd={(_event, info) => {
                  if (info.offset.y > 120 && window.innerWidth < 640) close()
                }}
                className="border-line-strong bg-surface-modal fixed inset-x-0 bottom-0 z-50 flex max-h-[92vh] flex-col overflow-hidden rounded-t-2xl border sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[85vh] sm:w-[calc(100%-2rem)] sm:max-w-3xl sm:rounded-2xl"
              >
                <div className="relative flex h-12 shrink-0 items-center justify-end px-3 sm:h-14 sm:px-4">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-2 mx-auto h-1 w-10 rounded-full bg-white/15 sm:hidden"
                  />
                  <Dialog.Close
                    aria-label="Close"
                    className="border-line text-muted hover:text-primary flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-150 hover:border-white/15"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </Dialog.Close>
                </div>

                <div
                  data-stamped={bet ? 'true' : 'false'}
                  className="relative flex-1 overflow-y-auto overscroll-contain px-5 pt-1 pb-6 sm:px-7"
                >
                  {bet && problem && (
                    <span className="absolute top-0 right-5 z-10 sm:right-7">
                      <Stamp
                        size={96}
                        tag={problem.tag}
                        name={bet.name}
                        photo={bet.photo}
                        at={bet.at}
                        entrance={entrance}
                      />
                    </span>
                  )}
                  {problem ? <ProblemDetail problem={problem} /> : <DetailSkeleton />}
                </div>

                <div className="border-line bg-surface-modal border-t px-5 py-4 sm:px-7">
                  {openId && (
                    <ModalFooter
                      problemId={openId}
                      tag={tag}
                      titles={titles}
                      onPlaced={() => setSlammed(true)}
                    />
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

function DetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6 py-2">
      <div className="h-5 w-40 rounded-full bg-white/[0.06]" />
      <div className="h-6 w-2/3 rounded bg-white/[0.07]" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-3/4 rounded bg-white/[0.04]" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
      </div>
    </div>
  )
}
