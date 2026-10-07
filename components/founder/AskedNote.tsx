import { why as copy } from '@/content/copy'

/** The team's tweak, pinned where the founder is making the change, so they never have to go and look for it. */
export function AskedNote({ note }: { note: string }) {
  return (
    <aside
      className="grid gap-2 rounded-2xl p-5 shadow-[inset_0_0_0_1px_rgb(124_77_204/0.45)]"
      style={{ background: 'color-mix(in oklab, var(--color-violet) 9%, transparent)' }}
      aria-label={copy.revise.asked}
    >
      <span className="meta text-violet-ink">{copy.revise.asked}</span>
      <p className="m-0 text-[17px] leading-relaxed whitespace-pre-line">{note}</p>
    </aside>
  )
}
