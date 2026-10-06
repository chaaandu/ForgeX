'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { consoleCopy } from '@/content/copy'
import { ago } from '@/lib/dates'
import type { FounderRow } from '@/lib/team-rows'

const copy = consoleCopy.founders
type Key = 'name' | 'archetype' | 'level' | 'pick' | 'status' | 'lastActive'
const STATUS_ORDER = ['waiting', 'talk', 'tweak', 'another', 'go', 'none'] as const

export function FoundersTable({ rows }: { rows: FounderRow[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | FounderRow['status']>('all')
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'name', dir: 1 })

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter((row) => (status === 'all' || row.status === status) && (!q || row.name.toLowerCase().includes(q)))
      .sort((a, b) => {
        const by = (row: FounderRow) =>
          sort.key === 'status' ? STATUS_ORDER.indexOf(row.status) : sort.key === 'level' ? row.level : (row[sort.key] ?? '')
        const x = by(a)
        const y = by(b)
        return (x < y ? -1 : x > y ? 1 : a.name.localeCompare(b.name)) * sort.dir
      })
  }, [query, rows, sort, status])

  const counts = STATUS_ORDER.map((key) => [key, rows.filter((row) => row.status === key).length] as const)

  const header = (key: Key, label: string, className = '') => (
    <th scope="col" className={`py-3 pr-4 text-left font-normal ${className}`} aria-sort={sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        className="meta press cursor-pointer border-0 bg-transparent p-0 hover:text-ink-1"
        onClick={() => setSort((current) => ({ key, dir: current.key === key ? (current.dir === 1 ? -1 : 1) : 1 }))}
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
          {copy.title} <span className="font-mono text-[14px] text-ink-3">{rows.length}</span>
        </h1>
        <a href="/api/team/export.csv" className="btn btn-secondary press" download>
          {copy.export}
        </a>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input className="field h-10 min-h-0 w-full max-w-[260px] py-0 text-[14px]" placeholder={copy.search} aria-label={copy.search} value={query} onChange={(event) => setQuery(event.target.value)} />
        <button type="button" className="chip press min-h-9 text-[13px]" aria-pressed={status === 'all'} onClick={() => setStatus('all')}>
          {copy.all}
        </button>
        {counts.map(([key, count]) => (
          <button key={key} type="button" className="chip press min-h-9 text-[13px]" aria-pressed={status === key} onClick={() => setStatus(key)}>
            {copy.statuses[key]} <span className="font-mono text-[11px] opacity-70">{count}</span>
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-[14px]">
          <thead className="border-b border-line">
            <tr>
              {header('name', copy.columns.name)}
              {header('archetype', copy.columns.archetype)}
              {header('level', copy.columns.level)}
              {header('pick', copy.columns.pick, 'w-[32%]')}
              {header('status', copy.columns.status)}
              {header('lastActive', copy.columns.active)}
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <tr key={row.slug} className="border-b border-line hover:bg-white/[0.025]">
                <td className="py-2.5 pr-4">
                  <Link href={`/f/${row.slug}`} className="flex items-center gap-3 text-ink-1 no-underline hover:text-pink-ink">
                    <Image src={row.photo} alt="" width={36} height={36} className="size-9 rounded-lg object-cover" />
                    <span>{row.name}</span>
                  </Link>
                </td>
                <td className="py-2.5 pr-4 text-ink-2">{row.archetype ? `${row.family} · ${row.archetype}` : '—'}</td>
                <td className="py-2.5 pr-4 font-mono text-ink-2">{row.level}/6</td>
                <td className="py-2.5 pr-4 text-ink-2">{row.pick || copy.noPick}</td>
                <td className="py-2.5 pr-4">
                  <span className={row.status === 'waiting' ? 'text-pink-ink' : row.status === 'none' ? 'text-ink-3' : 'text-ink-1'}>
                    {copy.statuses[row.status]}
                  </span>
                </td>
                <td className="py-2.5 pr-4 font-mono text-[13px] text-ink-3">{row.lastActive ? ago(row.lastActive) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 ? <p className="py-10 text-center text-ink-3">{copy.none}</p> : null}
      </div>
    </div>
  )
}
