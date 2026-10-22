/**
 * How far a founder has got, as a small ring and a number: under each card on
 * the landing, where a full track would not fit. Violet all the way, like the
 * track on their home and page.
 */
export function ProgressRing({
  value,
  size = 96,
  label,
}: {
  value: number
  size?: number
  /** Read aloud in place of the drawing. */
  label: string
}) {
  const stroke = Math.max(3, Math.round(size / 14))
  const radius = (size - stroke) / 2
  const length = 2 * Math.PI * radius
  const done = Math.min(100, Math.max(0, value))
  return (
    <span
      role="img"
      aria-label={label}
      className="relative inline-grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-s3)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-violet)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - done / 100)}
          className="transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span
        aria-hidden="true"
        className="text-ink-1 absolute font-mono font-medium"
        style={{ fontSize: Math.max(10, Math.round(size / 4.4)) }}
      >
        {done}%
      </span>
    </span>
  )
}
