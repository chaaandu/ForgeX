import { TAG_LABEL, tagStyle } from '@/lib/utils'
import type { Tag } from '@/lib/types'

export function TagPill({ tag }: { tag: Tag }) {
  return (
    <span
      style={tagStyle(tag)}
      className="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 font-mono text-[11px] tracking-[0.08em] uppercase"
    >
      {TAG_LABEL[tag]}
    </span>
  )
}
