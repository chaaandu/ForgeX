'use client'

import { copy } from '@/lib/copy'
import type { Tag } from '@/lib/types'
import { TAG_COLOR } from '@/lib/utils'
import { useBets } from './BetsProvider'
import { Stamp } from './Stamp'

/**
 * The only live part of a card. The card itself stays a Server Component, so
 * polling repaints a 32px stamp and one line rather than the whole grid.
 */
export function CardBet({ problemId, tag }: { problemId: string; tag: Tag }) {
  const { bets, email, entranceFor } = useBets()
  const bet = bets[problemId]
  if (!bet) return null

  const mine = bet.email === email

  return (
    <>
      <span className="absolute top-4 right-4">
        <Stamp
          size={32}
          tag={tag}
          name={bet.name}
          photo={bet.photo}
          at={bet.at}
          entrance={entranceFor(problemId)}
        />
      </span>
      {mine && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[16px] border"
          style={{ borderColor: `color-mix(in srgb, ${TAG_COLOR[tag]} 55%, transparent)` }}
        />
      )}
      <span className="text-muted truncate text-[13px]">
        {mine ? copy.card.own : copy.card.taken(bet.name)}
      </span>
    </>
  )
}
