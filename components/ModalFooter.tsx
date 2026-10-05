'use client'

import { useState } from 'react'
import { copy } from '@/lib/copy'
import { formatBetTime } from '@/lib/time'
import type { Tag } from '@/lib/types'
import { useBets } from './BetsProvider'

/**
 * Every footer state in one place.
 *
 * A student gets their first pick free and three changes after it. The rule is
 * stated before the first bet, the cost is stated under every move, and the
 * move that spends the last change asks once before it goes through: it is the
 * only action here that cannot be undone.
 */
export function ModalFooter({
  problemId,
  tag: _tag,
  titles,
  onPlaced,
}: {
  problemId: string
  tag: Tag
  titles: Record<string, string>
  onPlaced: () => void
}) {
  const { bets, role, email, closed, myBetId, pending, changesLeft, bet, release } = useBets()
  const [confirming, setConfirming] = useState(false)
  const held = bets[problemId]
  const mine = held?.email === email

  if (role === 'team') {
    return (
      <div data-testid="footer-team" className="flex flex-col gap-0.5 text-[14px]">
        {held ? (
          <>
            <span className="text-primary">{held.name}</span>
            <span className="text-muted">
              {held.email} · {formatBetTime(held.at)}
            </span>
          </>
        ) : (
          <span className="text-muted">{copy.modal.teamNobody}</span>
        )}
      </div>
    )
  }

  if (closed) {
    return (
      <p data-testid="footer-closed" className="text-muted text-[14px]">
        {copy.modal.closed}
      </p>
    )
  }

  const locked = changesLeft === 0

  // The problem this student holds.
  if (held && mine) {
    return (
      <div data-testid="footer-own" className="flex items-center justify-between gap-4">
        <span className="flex flex-col gap-0.5">
          <span className="text-secondary text-[14px]">{copy.modal.ownBet}</span>
          <span className="text-muted text-[13px]">
            {locked ? copy.modal.finalBet : copy.modal.changesLeft(changesLeft)}
          </span>
        </span>
        {!locked && (
          <button
            type="button"
            disabled={pending}
            onClick={() => void release()}
            className="text-secondary hover:text-primary text-[14px] underline decoration-white/25 underline-offset-4 transition-colors duration-150 hover:decoration-white disabled:opacity-50"
          >
            {copy.modal.undo}
          </button>
        )}
      </div>
    )
  }

  // Somebody else got here first.
  if (held) {
    return (
      <button
        type="button"
        disabled
        data-testid="footer-taken"
        className="border-line text-muted h-11 w-full cursor-not-allowed rounded-xl border bg-white/[0.03] text-[14px]"
      >
        {copy.modal.takenByOther(held.name)}
      </button>
    )
  }

  // Open, but this student has nothing left to spend on it.
  if (locked && myBetId) {
    return (
      <button
        type="button"
        disabled
        data-testid="footer-locked"
        className="border-line text-muted h-11 w-full cursor-not-allowed rounded-xl border bg-white/[0.03] text-[14px]"
      >
        {copy.modal.lockedElsewhere}
      </button>
    )
  }

  const moving = myBetId !== null && myBetId !== problemId

  const place = async () => {
    setConfirming(false)
    if (await bet(problemId)) onPlaced()
  }

  // Spending the last change is the one move with no way back from it.
  if (moving && confirming) {
    return (
      <div data-testid="footer-confirm" className="flex flex-col gap-2">
        <p className="text-secondary text-center text-[13px]">{copy.modal.confirmLast}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="border-line text-secondary hover:text-primary h-11 flex-1 rounded-xl border text-[14px] transition-colors duration-150 hover:border-white/15"
          >
            {copy.modal.confirmLastNo}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={place}
            className="bg-primary text-ink h-11 flex-1 rounded-xl text-[14px] font-medium transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
          >
            {copy.modal.confirmLastYes}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div data-testid="footer-open" className="flex flex-col gap-2">
      <button
        type="button"
        data-testid="bet-button"
        disabled={pending}
        onClick={() => (moving && changesLeft === 1 ? setConfirming(true) : void place())}
        className="bg-primary text-ink h-11 w-full rounded-xl text-[14px] font-medium transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
      >
        {moving ? copy.modal.ctaMoving : copy.modal.cta}
      </button>

      {moving && myBetId ? (
        <p className="text-muted text-center text-[13px]">
          {copy.modal.movingLine(myBetId, titles[myBetId] ?? '')}{' '}
          {copy.modal.movingCost(changesLeft)}
        </p>
      ) : (
        <p className="text-muted text-center text-[13px]">{copy.modal.firstBetNote}</p>
      )}
    </div>
  )
}
