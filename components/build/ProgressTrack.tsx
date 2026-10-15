import { home as copy } from '@/content/copy'
import { PROGRESS_PARTS, type ProgressPart } from '@/lib/submission'

/**
 * How far a founder has got, as 4 parts in the order they are done: the
 * problem, then the prototype, the launch and the pitch. Each part is as wide
 * as it is worth, so the filled length is the percentage. One colour
 * throughout: finishing is the bar filling, not the bar changing colour.
 */
export function ProgressTrack({
  value,
  parts,
  size = 'md',
}: {
  value: number
  parts: Record<ProgressPart, number>
  /** `sm` drops the Progress label, for a place that already says it. */
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <div
      role="img"
      aria-label={copy.progressRead(
        value,
        PROGRESS_PARTS.filter((part) => parts[part.id] >= 1)
          .map((part) => copy.parts[part.id])
          .join(', '),
      )}
      className="grid w-full gap-3"
    >
      <div className="flex items-baseline justify-between gap-4" aria-hidden="true">
        {size === 'sm' ? null : <span className="meta text-[11px]">{copy.progressLabel}</span>}
        <span
          className={`display leading-none ${size === 'lg' ? 'text-[44px]' : size === 'sm' ? 'text-[24px]' : 'text-[32px]'}`}
        >
          {value}
          <span className="text-ink-3 text-[0.55em]">%</span>
        </span>
      </div>
      <div className="flex gap-1.5" aria-hidden="true">
        {PROGRESS_PARTS.map((part) => (
          <div
            key={part.id}
            className="grid min-w-[46px] gap-2"
            style={{ flexGrow: part.weight, flexBasis: 0 }}
          >
            <span className="bg-s3 block h-2 overflow-hidden rounded-full">
              <span
                className="bg-violet block h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
                style={{ width: `${parts[part.id] * 100}%` }}
              />
            </span>
            <span
              className={`truncate font-mono text-[10px] tracking-[0.04em] uppercase ${parts[part.id] >= 1 ? 'text-ink-1' : 'text-ink-3'}`}
            >
              {copy.parts[part.id]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
