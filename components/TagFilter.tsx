'use client'

import * as Popover from '@radix-ui/react-popover'
import { Check, ChevronDown } from 'lucide-react'
import { copy } from '@/lib/copy'
import { TAGS, type Tag } from '@/lib/types'
import { TAG_COLOR, TAG_LABEL } from '@/lib/utils'

/**
 * Type is multi-select, so it cannot be a Select. It is a popover of checkboxes
 * that looks and sits exactly like the other two filters, which keeps the bar
 * to three identical controls rather than four loose pills and two dropdowns.
 */
export function TagFilter({ value, onChange }: { value: Tag[]; onChange: (tags: Tag[]) => void }) {
  const label =
    value.length === 0
      ? copy.filters.typeLabel
      : value.length === 1
        ? TAG_LABEL[value[0] as Tag]
        : `${value.length} types`

  const toggle = (tag: Tag) =>
    onChange(value.includes(tag) ? value.filter((item) => item !== tag) : [...value, tag])

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={copy.filters.typeLabel}
        className="border-line bg-surface text-secondary hover:text-primary inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] transition-colors duration-150 hover:border-white/15 data-[state=open]:border-white/15"
      >
        {value.length === 1 && (
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: TAG_COLOR[value[0] as Tag] }}
          />
        )}
        {label}
        <ChevronDown size={16} strokeWidth={1.5} className="text-muted" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="border-line-strong bg-surface-modal z-[70] w-44 rounded-xl border p-1 shadow-xl shadow-black/50"
        >
          {TAGS.map((tag) => {
            const on = value.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(tag)}
                className="text-secondary data-[on=true]:text-primary flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] outline-none select-none hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                data-on={on}
              >
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: TAG_COLOR[tag] }}
                />
                <span className="flex-1 text-left">{TAG_LABEL[tag]}</span>
                {on && <Check size={16} strokeWidth={1.5} />}
              </button>
            )
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
