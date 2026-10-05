'use client'

import { copy } from '@/lib/copy'
import type { Problem } from '@/lib/types'
import { AvatarMenu } from './AvatarMenu'
import { useBets } from './BetsProvider'
import { useModal } from './ModalState'

/**
 * Greeting and subline on the left, avatar on the right. The subline is live:
 * a student who holds a bet sees it named here, and tapping it opens it.
 */
export function Header({
  firstName,
  name,
  email,
  photo,
  closesAt,
  titles,
  total,
}: {
  firstName: string
  name: string
  email: string
  photo: string
  closesAt: string
  titles: Record<string, Problem['title']>
  /** How many problems are on the board, so the count never goes stale. */
  total: number
}) {
  const { bets, role, myBetId } = useBets()
  const { open: openProblem } = useModal()
  const taken = Object.keys(bets).length
  const open = Math.max(0, total - taken)

  return (
    <header className="mx-auto flex max-w-[1600px] items-start justify-between gap-4 pt-8 pb-6">
      <div className="min-w-0">
        <h1 className="title text-primary">{copy.header.greeting(firstName)}</h1>
        {role === 'team' ? (
          <p className="text-muted mt-1 text-[14px]">{copy.header.team(taken, total)}</p>
        ) : myBetId ? (
          <button
            type="button"
            onClick={() => openProblem(myBetId)}
            className="text-secondary mt-1 block max-w-full truncate text-left text-[14px] underline decoration-white/20 underline-offset-4 transition-colors duration-150 hover:decoration-white"
          >
            {copy.header.studentHasBet(myBetId, titles[myBetId] ?? '')}
          </button>
        ) : (
          <p className="text-muted mt-1 text-[14px]">{copy.header.studentNoBet(open, total, closesAt)}</p>
        )}
      </div>
      <AvatarMenu name={name} email={email} photo={photo} />
    </header>
  )
}
