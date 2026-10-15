'use client'

import {
  Camera,
  ClipboardList,
  Code2,
  FileText,
  FlaskConical,
  Globe,
  Presentation,
  Video,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { consoleCopy } from '@/content/copy'
import { ago } from '@/lib/dates'
import { TICKS } from '@/lib/submission'
import { labelOf } from '@/lib/taxonomy'
import type { BoardStatus, FounderRow } from '@/lib/team-rows'

const copy = consoleCopy.founders
type Key = 'name' | 'title' | 'reviewer' | 'poc' | 'progress' | 'status' | 'lastActive'
const STATUS_ORDER: BoardStatus[] = ['none', 'review', 'building', 'done']
// One colour, deeper as a founder gets further: nothing here reads as a warning.
const TONE: Record<BoardStatus, string> = {
  none: 'bg-s3',
  review: 'bg-violet/35',
  building: 'bg-violet/70',
  done: 'bg-violet',
}
const ICON: Record<(typeof TICKS)[number], LucideIcon> = {
  scope: ClipboardList,
  github: Code2,
  prototype: FlaskConical,
  proof: Camera,
  live: Globe,
  docs: FileText,
  deck: Presentation,
  video: Video,
}

/**
 * Where every founder stands: four counts the room asks for, then each
 * founder with their problem, reviewer, POC, progress and the links they have
 * sent, each one an icon that opens it. Anything cut short shows in full on
 * hover. Sorted by a person, never by progress unless they ask.
 */
export function FoundersTable({
  rows,
  reviewer: mine,
  poc: myPoc,
}: {
  rows: FounderRow[]
  /** The viewer's own name when they are a reviewer: the list opens on their students. */
  reviewer: string
  /** The viewer's own name when they are a POC: the list opens on the students they look after. */
  poc: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | BoardStatus>('all')
  const [industry, setIndustry] = useState('')
  const [reviewer, setReviewer] = useState(mine)
  const [poc, setPoc] = useState(myPoc)
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'name', dir: 1 })

  // The board is watched while the clock runs down, so it keeps itself fresh.
  useEffect(() => {
    const id = window.setInterval(() => router.refresh(), 30_000)
    return () => window.clearInterval(id)
  }, [router])

  const industries = useMemo(
    () => [...new Set(rows.map((row) => row.industry).filter(Boolean))].sort(),
    [rows],
  )
  const pocs = useMemo(
    () => [...new Set(rows.map((row) => row.poc).filter(Boolean))].sort(),
    [rows],
  )
  const reviewers = useMemo(
    () => [...new Set(rows.map((row) => row.reviewer).filter(Boolean))].sort(),
    [rows],
  )

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter(
        (row) =>
          (status === 'all' || row.status === status) &&
          (!industry || row.industry === industry) &&
          (!reviewer || row.reviewer === reviewer) &&
          (!poc || row.poc === poc) &&
          (!q || row.name.toLowerCase().includes(q)),
      )
      .sort((a, b) => {
        const by = (row: FounderRow): string | number =>
          sort.key === 'status'
            ? STATUS_ORDER.indexOf(row.status)
            : sort.key === 'progress'
              ? row.progress
              : (row[sort.key] ?? '')
        const x = by(a)
        const y = by(b)
        return (x < y ? -1 : x > y ? 1 : 0) * sort.dir || a.name.localeCompare(b.name)
      })
  }, [industry, poc, query, reviewer, rows, sort, status])

  // The counts follow the reviewer, POC and industry chosen, so each sees their own group.
  const scoped = rows.filter(
    (row) =>
      (!reviewer || row.reviewer === reviewer) &&
      (!poc || row.poc === poc) &&
      (!industry || row.industry === industry),
  )
  const count = (key: BoardStatus) => scoped.filter((row) => row.status === key).length

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
        <h1 className="display m-0 text-[40px] leading-none">{copy.title}</h1>
        <div className="flex flex-wrap gap-2">
          <a href="/api/team/export.csv" className="btn btn-secondary press" download>
            {copy.export}
          </a>
        </div>
      </div>

      <div className="grid gap-3">
        <dl className="m-0 grid grid-cols-2 gap-3 md:grid-cols-4">
          {STATUS_ORDER.map((key) => (
            <div key={key} className="panel grid gap-1 p-4 md:p-5">
              <dt className="meta flex items-center gap-2 text-[11px]">
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${TONE[key]}`} />
                {copy.statuses[key]}
              </dt>
              <dd className="display m-0 text-[clamp(30px,4vw,48px)] leading-none">
                {count(key)}{' '}
                <span className="text-ink-3 font-mono text-[13px]">
                  {copy.ofTotal(scoped.length)}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="bg-s3 flex h-2 overflow-hidden rounded-full" aria-hidden="true">
          {(['done', 'building', 'review'] as BoardStatus[]).map((key) => (
            <span
              key={key}
              className={TONE[key]}
              style={{ width: `${(count(key) / Math.max(1, scoped.length)) * 100}%` }}
            />
          ))}
        </div>
      </div>

      <div className="quiet-scroll -mx-5 flex items-center gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <input
          className="field h-9 min-h-0 w-[200px] shrink-0 rounded-full px-4 py-0 text-[13px]"
          placeholder={copy.searchPlaceholder}
          aria-label={copy.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="select shrink-0"
          aria-label={copy.statusFilter}
          value={status}
          onChange={(event) => setStatus(event.target.value as 'all' | BoardStatus)}
        >
          <option value="all">{copy.anyStatus(scoped.length)}</option>
          {STATUS_ORDER.map((key) => (
            <option key={key} value={key}>
              {copy.statusOption(copy.statuses[key], count(key))}
            </option>
          ))}
        </select>
        <select
          className="select shrink-0"
          aria-label={copy.reviewers}
          value={reviewer}
          onChange={(event) => setReviewer(event.target.value)}
        >
          <option value="">{copy.anyReviewer}</option>
          {reviewers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          className="select shrink-0"
          aria-label={copy.pocs}
          value={poc}
          onChange={(event) => setPoc(event.target.value)}
        >
          <option value="">{copy.anyPoc}</option>
          {pocs.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          className="select shrink-0"
          aria-label={copy.industries}
          value={industry}
          onChange={(event) => setIndustry(event.target.value)}
        >
          <option value="">{copy.anyIndustry}</option>
          {industries.map((id) => (
            <option key={id} value={id}>
              {labelOf.industryShort(id)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] table-fixed border-collapse text-[14px]">
          <thead className="border-line border-b">
            <tr>
              {header('name', copy.columns.name, 'w-[20%]')}
              {header('title', copy.columns.pick, 'w-[21%]')}
              {header('reviewer', copy.columns.reviewer, 'w-[9%]')}
              {header('poc', copy.columns.poc, 'w-[9%]')}
              {header('progress', copy.columns.progress, 'w-[16%]')}
              <th scope="col" className="meta w-[17%] py-3 pr-4 text-left font-normal">
                {copy.columns.links}
              </th>
              {header('lastActive', copy.columns.active, 'w-[8%]')}
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => {
              const where =
                row.status === 'none'
                  ? (copy.steps[Math.min(row.level, 4)] ?? copy.statuses.none)
                  : row.word
              const sent = TICKS.filter((id) => row.fields[id])
              return (
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
                  <td className="py-3 pr-4">
                    <Link
                      href={`/f/${row.slug}`}
                      title={row.name}
                      className="text-ink-1 hover:text-violet-ink flex items-center gap-3 no-underline"
                    >
                      <Avatar src={row.photo} size={36} />
                      <span className="truncate">{row.name}</span>
                    </Link>
                  </td>
                  <td className="py-3 pr-4" title={row.title || undefined}>
                    {row.title ? (
                      <span className="text-ink-1 line-clamp-2 leading-snug">{row.title}</span>
                    ) : (
                      <span className="text-ink-3">{copy.noPick}</span>
                    )}
                    {row.title && !row.own ? (
                      <span className="meta mt-1 block text-[10px]">{copy.bank}</span>
                    ) : null}
                  </td>
                  <td className="text-ink-2 truncate py-3 pr-4" title={row.reviewer || undefined}>
                    {row.reviewer || copy.noPick}
                  </td>
                  <td className="text-ink-2 truncate py-3 pr-4" title={row.poc || undefined}>
                    {row.poc || copy.noPick}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2.5">
                      <span
                        className="bg-s3 h-1.5 w-full max-w-[96px] overflow-hidden rounded-full"
                        aria-hidden="true"
                      >
                        <span
                          className="bg-violet block h-full rounded-full"
                          style={{ width: `${row.progress}%` }}
                        />
                      </span>
                      <span className="text-ink-1 font-mono text-[12px]">{row.progress}%</span>
                    </span>
                    <span
                      className={`mt-1.5 block truncate text-[12px] ${row.status === 'none' ? 'text-ink-3' : 'text-ink-2'}`}
                      title={where}
                    >
                      {where}
                      {row.reopened.length ? ` · ${copy.reopened}` : ''}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {sent.length ? (
                      <ul className="m-0 flex list-none gap-1 p-0">
                        {sent.map((id) => {
                          const Icon = ICON[id]
                          const url = row.fields[id] ?? ''
                          return (
                            <li key={id}>
                              <a
                                href={url.split('\n')[0]}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={copy.has(copy.ticks[id])}
                                data-tip={copy.ticks[id]}
                                className="text-ink-2 hover:text-ink-1 tip press grid size-6 place-items-center rounded-md shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:bg-white/5"
                              >
                                <Icon size={13} strokeWidth={1.5} aria-hidden="true" />
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <span className="text-ink-3">{copy.noPick}</span>
                    )}
                  </td>
                  <td className="text-ink-3 py-3 pr-4 font-mono text-[12px]">
                    {row.lastActive ? ago(row.lastActive) : copy.noPick}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {shown.length === 0 ? <p className="text-ink-3 py-10 text-center">{copy.none}</p> : null}
      </div>
    </div>
  )
}
