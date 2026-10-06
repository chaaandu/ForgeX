'use client'

import { useId } from 'react'

/**
 * The way out of any list: a chip that, once on, opens a short text field.
 * No question is a dead end.
 */
export function OtherField({
  label,
  on,
  onToggle,
  value,
  onChange,
  placeholder,
}: {
  label: string
  on: boolean
  onToggle: () => void
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  const id = useId()
  return (
    <div className="contents">
      <button type="button" className="chip press" aria-pressed={on} aria-expanded={on} aria-controls={on ? id : undefined} onClick={onToggle}>
        {label}
      </button>
      {on ? (
        <input
          id={id}
          className="field rise basis-full"
          value={value}
          maxLength={80}
          placeholder={placeholder}
          aria-label={label}
          autoFocus
          onChange={(event) => onChange(event.target.value)}
        />
      ) : null}
    </div>
  )
}
