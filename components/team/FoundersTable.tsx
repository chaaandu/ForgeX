'use client'

import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { consoleCopy } from '@/content/copy'
import { ago } from '@/lib/dates'
import type { FounderRow } from '@/lib/team-rows'

const copy = consoleCopy.founders
type Key = 'name' | 'archetype' | 'level' | 'pick' | 'status' | 'lastActive'
const STATUS_ORDER = ['waiting', 'talk', 'tweak', 'another', 'go', 'none'] as const

export function FoundersTable({ rows }: { rows: FounderRow[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | FounderRow['status']>('all')
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'name', dir: 1 })

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter(
        (row) =>
          (status === 'all' || row.status === status) && (!q || row.name.toLowerCase().includes(q)),
      )
      .sort((a, b) => {
        const by = (row: FounderRow) =>
          sort.key === 'status'
            ? STATUS_ORDER.indexOf(row.status)
            : sort.key === 'level'
              ? row.level
              : (row[sort.key] ?? '')
        const x = by(a)
        const y = by(b)
        return (x < y ? -1 : x > y ? 1 : a.name.localeCompare(b.name)) * sort.dir
      })
  }, [query, rows, sort, status])

  const counts = STATUS_ORDER.map(
    (key) => [key, rows.filter((row) => row.status === key).length] as const,
  )

  const header = (key: Key, label: string, className = '') => (
    <th
      scope="col"
      className={`py-3 pr-4 text-left font-normal ${className}`}
      aria-sort={sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}
    >
      <button
        type="button"
        className="meta press hover:text-ink-1 cursor-pointer border-0 bg-transparent p-0"
        onClick={() =>
          setSort((current) => ({
            key,
            dir: current.key === key ? (current.dir === 1 ? -1 : 1) : 1,
          }))
        }
      >
        {label}
        {sort.key === key ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}
      </button>
    </th>
  )

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display m-0 text-[40px] leading-none">
          {copy.title} <span className="text-ink-3 font-mono text-[14px]">{rows.length}</span>
        </h1>
        <a href="/api/team/export.csv" className="btn btn-secondary press" download>
          {copy.export}
        </a>
      </div>
      <div className="quiet-scroll -mx-5 flex items-center gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <input
          className="field h-10 min-h-0 w-[220px] shrink-0 py-0 text-[14px]"
          placeholder={copy.searchPlaceholder}
          aria-label={copy.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          type="button"
          className="chip press min-h-9 shrink-0 text-[13px]"
          aria-pressed={status === 'all'}
          onClick={() => setStatus('all')}
        >
          {copy.all}
        </button>
        {counts.map(([key, count]) => (
          <button
            key={key}
            type="button"
            className="chip press min-h-9 shrink-0 text-[13px]"
            aria-pressed={status === key}
            onClick={() => setStatus(key)}
          >
            {copy.statuses[key]} <span className="font-mono text-[11px]">{count}</span>
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] table-fixed border-collapse text-[14px]">
          <thead className="border-line border-b">
            <tr>
              {header('name', copy.columns.name, 'w-[24%]')}
              {header('archetype', copy.columns.archetype, 'w-[19%]')}
              {header('level', copy.columns.level, 'w-[11%]')}
              {header('pick', copy.columns.pick, 'w-[24%]')}
              {header('status', copy.columns.status, 'w-[10%]')}
              {header('lastActive', copy.columns.active, 'w-[12%]')}
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              // The whole row opens their profile; the name stays a real link
              // for the keyboard, a new tab and a screen reader.
              <tr
                key={row.slug}
                className="border-line cursor-pointer border-b hover:bg-white/[0.035]"
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest('a')) return
                  router.push(`/f/${row.slug}`)
                }}
              >
                <td className="py-2.5 pr-4">
                  <Link
                    href={`/f/${row.slug}`}
                    className="text-ink-1 hover:text-violet-ink flex items-center gap-3 no-underline"
                  >
                    <Avatar src={row.photo} size={40} />
                    <span className="truncate">{row.name}</span>
                  </Link>
                </td>
                <td className="text-ink-2 truncate py-2.5 pr-4">
                  {row.archetype ? `${row.family} · ${row.archetype}` : '—'}
                </td>
                <td
                  className={`py-2.5 pr-4 ${row.level >= 6 ? 'text-ink-3' : row.level === 0 ? 'text-ink-3' : 'text-ink-1'}`}
                >
                  {copy.steps[Math.min(row.level, 6)]}
                </td>
                <td className="text-ink-2 truncate py-2.5 pr-4" title={row.pick || undefined}>
                  {row.pick || copy.noPick}
                </td>
                <td className="py-2.5 pr-4">
                  <span
                    className={
                      row.status === 'waiting'
                        ? 'text-violet-ink'
                        : row.status === 'none'
                          ? 'text-ink-3'
                          : 'text-ink-1'
                    }
                  >
                    {copy.statuses[row.status]}
                  </span>
                </td>
                <td className="text-ink-3 py-2.5 pr-4 font-mono text-[13px]">
                  {row.lastActive ? ago(row.lastActive) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 ? <p className="text-ink-3 py-10 text-center">{copy.none}</p> : null}
      </div>
    </div>
  )
}
