import { consoleCopy } from '@/content/copy'
import type { StopCell } from '@/lib/team-rows'

const RATING_COLOUR = {
  green: 'var(--color-ok)',
  amber: 'var(--color-legendary)',
  red: 'var(--color-mythic)',
} as const

/**
 * Three dots, one per stop: empty until sent, filled once sent, coloured by
 * the team's rating. Colour is an accent only, so each dot says its state too.
 */
export function StopDots({ stops }: { stops: StopCell[] }) {
  return (
    <span className="flex items-center gap-1.5">
      {stops.map((cell, index) => {
        const label = `${index + 1}: ${
          cell.rating
            ? consoleCopy.stops.ratings[cell.rating]
            : cell.state === 'none'
              ? consoleCopy.stops.filters.notSent
              : cell.state === 'draft'
                ? consoleCopy.stops.draft
                : cell.state === 'late'
                  ? consoleCopy.stops.late
                  : consoleCopy.stops.filters.unrated
        }`
        return (
          <span
            key={index}
            title={label}
            aria-label={label}
            role="img"
            className="inline-block size-3 rounded-full"
            style={{
              background: cell.rating
                ? RATING_COLOUR[cell.rating]
                : cell.state === 'sent' || cell.state === 'late'
                  ? 'var(--color-ink-2)'
                  : 'transparent',
              boxShadow:
                cell.state === 'none' || cell.state === 'draft'
                  ? `inset 0 0 0 1.5px ${cell.state === 'draft' ? 'var(--color-ink-3)' : 'var(--color-line-2)'}`
                  : undefined,
            }}
          />
        )
      })}
    </span>
  )
}
