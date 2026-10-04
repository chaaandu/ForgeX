'use client'

import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

/** Radix Select in the app's surface colours. Used for Cluster and Region. */
export function Select({
  value,
  onValueChange,
  options,
  placeholder,
  label,
}: {
  value: string
  onValueChange: (value: string) => void
  options: string[]
  placeholder: string
  label: string
}) {
  const ALL = '__all__'
  return (
    <RadixSelect.Root
      value={value === '' ? ALL : value}
      onValueChange={(next) => onValueChange(next === ALL ? '' : next)}
    >
      <RadixSelect.Trigger
        aria-label={label}
        className="border-line bg-surface text-secondary hover:text-primary inline-flex h-8 max-w-[220px] items-center gap-1.5 rounded-full border px-3 text-[13px] transition-colors duration-150 hover:border-white/15 data-[state=open]:border-white/15"
      >
        <RadixSelect.Value placeholder={placeholder}>
          <span className="truncate">{value === '' ? placeholder : value}</span>
        </RadixSelect.Value>
        <RadixSelect.Icon>
          <ChevronDown size={16} strokeWidth={1.5} className="text-muted" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="border-line-strong bg-surface-modal z-[70] max-h-[60vh] overflow-hidden rounded-xl border shadow-xl shadow-black/50"
        >
          <RadixSelect.Viewport className="p-1">
            <Item value={ALL}>{placeholder}</Item>
            {options.map((option) => (
              <Item key={option} value={option}>
                {option}
              </Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

function Item({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <RadixSelect.Item
      value={value}
      className="text-secondary data-[highlighted]:text-primary flex cursor-pointer items-center justify-between gap-6 rounded-lg px-3 py-2 text-[13px] outline-none select-none data-[highlighted]:bg-white/[0.06]"
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator>
        <Check size={16} strokeWidth={1.5} />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}
