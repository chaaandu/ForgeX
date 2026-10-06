'use client'

import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { profile as copy } from '@/content/copy'

/**
 * A short list a founder builds by tapping suggestions or typing. Each change
 * saves straight away; nothing waits for a submit button.
 */
export function ChipList({
  label,
  items,
  suggestions = [],
  placeholder,
  max = 8,
  onChange,
}: {
  label: string
  items: string[]
  suggestions?: string[]
  placeholder: string
  max?: number
  onChange: (items: string[]) => void
}) {
  const [draft, setDraft] = useState('')
  const lower = items.map((item) => item.toLowerCase())
  const open = suggestions.filter((item) => !lower.includes(item.toLowerCase()))

  function add(raw: string) {
    const item = raw.replace(/,/g, ' ').trim().slice(0, 40)
    if (!item || lower.includes(item.toLowerCase()) || items.length >= max) return
    onChange([...items, item])
    setDraft('')
  }

  return (
    <div className="grid gap-3" role="group" aria-label={label}>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              className="chip press"
              aria-pressed="true"
              aria-label={copy.remove(item)}
              onClick={() => onChange(items.filter((value) => value !== item))}
            >
              {item}
              <X size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </li>
        ))}
        {items.length < max ? (
          <li className="min-w-[160px] flex-1">
            <input
              className="inline-edit h-10 w-full text-[15px]"
              value={draft}
              placeholder={placeholder}
              aria-label={`${label}, ${placeholder}`}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault()
                  add(draft)
                }
              }}
              onBlur={() => add(draft)}
            />
          </li>
        ) : null}
      </ul>
      {open.length && items.length < max ? (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label={`${label}, suggestions`}>
          {open.map((item) => (
            <li key={item}>
              <button type="button" className="press inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[13px] text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)] hover:text-ink-1" onClick={() => add(item)}>
                <Plus size={12} strokeWidth={1.5} aria-hidden="true" />
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
