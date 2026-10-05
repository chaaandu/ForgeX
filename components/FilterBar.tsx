'use client'

import { Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { copy } from '@/lib/copy'
import { isFiltering, toQuery, type Filters } from '@/lib/filters'
import { TAGS, type Tag } from '@/lib/types'
import { TAG_LABEL, tagStyle } from '@/lib/utils'
import { Select } from './Select'

export function FilterBar({
  filters,
  clusters,
  mechanics,
  count,
}: {
  filters: Filters
  clusters: string[]
  mechanics: string[]
  count: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [query, setQuery] = useState(filters.q)
  const typed = useRef(false)

  const push = (next: Filters) => {
    startTransition(() => router.replace(`${pathname}${toQuery(next)}`, { scroll: false }))
  }

  // Search is debounced so the server is not asked a question per keystroke.
  useEffect(() => {
    if (!typed.current) return
    const timer = setTimeout(() => push({ ...filters, q: query }), 220)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    setQuery(filters.q)
    typed.current = false
  }, [filters.q])

  const toggleTag = (tag: Tag) => {
    const tags = filters.tags.includes(tag)
      ? filters.tags.filter((value) => value !== tag)
      : [...filters.tags, tag]
    push({ ...filters, tags })
  }

  return (
    <div className="border-line bg-ink/80 sticky top-0 z-40 border-b px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-2">
        <span className="label mr-0.5 hidden sm:block">{copy.filters.typeLabel}</span>
        {TAGS.map((tag) => {
          const active = filters.tags.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={active}
              onClick={() => toggleTag(tag)}
              style={active ? tagStyle(tag) : undefined}
              className={
                active
                  ? 'h-8 rounded-full border px-3 font-mono text-[11px] tracking-[0.08em] uppercase'
                  : 'border-line text-muted hover:text-secondary h-8 rounded-full border px-3 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors duration-150 hover:border-white/15'
              }
            >
              {TAG_LABEL[tag]}
            </button>
          )
        })}

        <span className="mx-1 hidden h-5 w-px bg-white/[0.08] sm:block" />

        <Select
          label="Cluster"
          placeholder="Cluster"
          value={filters.cluster}
          options={clusters}
          onValueChange={(cluster) => push({ ...filters, cluster })}
        />
        {mechanics.length > 0 && (
          <Select
            label="Build type"
            placeholder="Build type"
            value={filters.mechanic}
            options={mechanics}
            onValueChange={(mechanic) => push({ ...filters, mechanic })}
          />
        )}

        <label className="relative flex h-8 min-w-0 flex-1 basis-40 items-center">
          <Search
            size={16}
            strokeWidth={1.5}
            className="text-muted pointer-events-none absolute left-3"
          />
          <span className="sr-only">Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              typed.current = true
              setQuery(event.target.value)
            }}
            className="border-line bg-surface text-primary placeholder:text-muted h-8 w-full rounded-full border pr-3 pl-9 text-[13px] focus:border-white/15 focus:outline-none"
            placeholder="Search"
          />
        </label>

        <button
          type="button"
          aria-pressed={filters.openOnly}
          onClick={() => push({ ...filters, openOnly: !filters.openOnly })}
          className={
            filters.openOnly
              ? 'text-primary h-8 rounded-full border border-white/20 bg-white/[0.08] px-3 text-[13px]'
              : 'border-line text-muted hover:text-secondary h-8 rounded-full border px-3 text-[13px] transition-colors duration-150 hover:border-white/15'
          }
        >
          {copy.filters.openOnly}
        </button>

        {isFiltering(filters) && <span className="label shrink-0 tabular-nums">{count}</span>}
      </div>
    </div>
  )
}
