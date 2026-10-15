/**
 * A short list of expectations, one to a line. A real list, so a screen
 * reader counts the items and a founder can tick them off in their head.
 */
export function Bullets({
  items,
  label,
  tone = 'strong',
}: {
  items: string[]
  label: string
  /** `strong` for what must work; `quiet` for what is optional. */
  tone?: 'strong' | 'quiet'
}) {
  return (
    <ul className="m-0 grid list-none gap-2.5 p-0" aria-label={label}>
      {items.map((item) => (
        <li
          key={item}
          className={`grid grid-cols-[14px_1fr] items-baseline gap-2.5 text-[15px] leading-snug ${tone === 'strong' ? 'text-ink-1' : 'text-ink-2'}`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 -translate-y-[3px] justify-self-center rounded-full ${tone === 'strong' ? 'bg-violet-ink' : 'bg-ink-3'}`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
