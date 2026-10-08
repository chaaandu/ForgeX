'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { consoleCopy } from '@/content/copy'
import { ago } from '@/lib/dates'
import type { FounderRow } from '@/lib/team-rows'
import { StopDots } from './StopDots'

const copy = consoleCopy.founders
type Key = 'name' | 'track' | 'pod' | 'forWho' | 'done' | 'behind' | 'lastActive'
type Option = { id: string; label: string; count: number }

/**
 * Every founder, as the day stands: their track and pod, who they're building
 * for, steps done against steps due, how far behind, and the three phases.
 * Filter to whoever needs a nudge.
 */
export function FoundersTable({
  rows,
  tracks,
  pods,
}: {
  rows: FounderRow[]
  tracks: Option[]
  pods: number[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [track, setTrack] = useState<string>('all')
  const [pod, setPod] = useState<string>('all')
  const [behind, setBehind] = useState(false)
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'name', dir: 1 })

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter(
        (row) =>
          (track === 'all' || row.track === track) &&
          (pod === 'all' || (pod === 'none' ? row.pod === null : String(row.pod) === pod)) &&
          (!behind || row.behind >= 2) &&
          (!q || row.name.toLowerCase().includes(q) || row.forWho.toLowerCase().includes(q)),
      )
      .sort((a, b) => {
        const by = (row: FounderRow) =>
          sort.key === 'pod'
            ? (row.pod ?? 99)
            : sort.key === 'track'
              ? row.trackLabel
              : row[sort.key]
        const x = by(a)
        const y = by(b)
        return (x < y ? -1 : x > y ? 1 : a.name.localeCompare(b.name)) * sort.dir
      })
  }, [behind, pod, query, rows, sort, track])

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
            dir: current.key === key ? (current.dir === 1 ? -1 : 1) : key === 'behind' ? -1 : 1,
          }))
        }
      >
        {label}
        {sort.key === key ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}
      </button>
    </th>
  )

  const chip = (pressed: boolean, onClick: () => void, label: string, count?: number) => (
    <button
      type="button"
      className="chip press min-h-9 shrink-0 text-[13px]"
      aria-pressed={pressed}
      onClick={onClick}
    >
      {label}
      {count !== undefined ? <span className="font-mono text-[11px]">{count}</span> : null}
    </button>
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
      <div
        className="quiet-scroll -mx-5 flex items-center gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0"
        role="group"
        aria-label={copy.filters}
      >
        <input
          className="field h-10 min-h-0 w-[220px] shrink-0 py-0 text-[14px]"
          placeholder={copy.searchPlaceholder}
          aria-label={copy.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {chip(track === 'all', () => setTrack('all'), copy.allTracks)}
        {tracks.map((option) =>
          chip(track === option.id, () => setTrack(option.id), option.label, option.count),
        )}
        <select
          className="field h-10 min-h-0 w-auto shrink-0 py-0 text-[14px]"
          aria-label={consoleCopy.founders.columns.pod}
          value={pod}
          onChange={(event) => setPod(event.target.value)}
        >
          <option value="all">{copy.allPods}</option>
          {pods.map((n) => (
            <option key={n} value={String(n)}>
              {consoleCopy.pods.pod(String(n))}
            </option>
          ))}
          <option value="none">{copy.noPod}</option>
        </select>
        {chip(behind, () => setBehind((value) => !value), copy.behindOnly)}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] table-fixed border-collapse text-[14px]">
          <thead className="border-line border-b">
            <tr>
              {header('name', copy.columns.name, 'w-[22%]')}
              {header('track', copy.columns.track, 'w-[11%]')}
              {header('pod', copy.columns.pod, 'w-[7%]')}
              {header('forWho', copy.columns.forWho, 'w-[24%]')}
              {header('done', copy.columns.steps, 'w-[8%]')}
              {header('behind', copy.columns.behind, 'w-[8%]')}
              <th scope="col" className="meta w-[9%] py-3 pr-4 text-left font-normal">
                {copy.columns.stop}
              </th>
              {header('lastActive', copy.columns.active, 'w-[11%]')}
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
                    <span className="grid min-w-0">
                      <span className="truncate">{row.name}</span>
                      <span className="text-ink-3 truncate text-[12px]">
                        {copy.steps[Math.min(row.level, 5)]}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="text-ink-2 truncate py-2.5 pr-4">{row.trackLabel}</td>
                <td className="text-ink-2 py-2.5 pr-4 font-mono text-[13px]">
                  {row.pod ? `${row.pod}${row.mentor ? '★' : ''}` : copy.dash}
                </td>
                <td className="text-ink-2 truncate py-2.5 pr-4" title={row.forWho || undefined}>
                  {row.forWho || copy.dash}
                </td>
                <td className="text-ink-1 py-2.5 pr-4 font-mono text-[13px]">
                  {copy.stepsOf(String(row.done), String(row.due))}
                </td>
                <td
                  className={`py-2.5 pr-4 font-mono text-[13px] ${row.behind >= 2 ? 'text-violet-ink' : 'text-ink-3'}`}
                >
                  {row.behind}
                </td>
                <td className="py-2.5 pr-4">
                  <StopDots stops={row.stops} />
                </td>
                <td className="text-ink-3 py-2.5 pr-4 font-mono text-[13px]">
                  {row.lastActive ? ago(row.lastActive) : copy.dash}
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
