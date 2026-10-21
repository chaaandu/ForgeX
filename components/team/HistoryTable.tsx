'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { consoleCopy } from '@/content/copy'
import type { HistoryLine } from '@/lib/data/hackathon'

const copy = consoleCopy.history
type Key = 'time' | 'name'

/**
 * Every problem sent and every answer, one line each, as in the Sheet. Sort by
 * name or time, and search by name. Nothing here can be changed: it is the
 * record.
 */
export function HistoryTable({
  lines,
  slugs,
}: {
  lines: HistoryLine[]
  slugs: Record<string, string>
}) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'time', dir: -1 })

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return lines
      .filter((line) => !q || line.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const x = sort.key === 'time' ? a.time : a.name.toLowerCase()
        const y = sort.key === 'time' ? b.time : b.name.toLowerCase()
        return (
          (x < y ? -1 : x > y ? 1 : 0) * sort.dir ||
          b.time.localeCompare(a.time) ||
          b.order - a.order
        )
      })
  }, [lines, query, sort])

  const header = (key: Key, label: string, className: string) => (
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
    <div className="grid gap-5">
      <input
        className="field h-9 min-h-0 w-[220px] rounded-full px-4 py-0 text-[13px]"
        placeholder={copy.searchPlaceholder}
        aria-label={copy.search}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] table-fixed border-collapse text-[14px]">
          <thead className="border-line border-b">
            <tr>
              {header('time', copy.columns.time, 'w-[13%]')}
              {header('name', copy.columns.name, 'w-[16%]')}
              <th scope="col" className="meta w-[7%] py-3 pr-4 text-left font-normal">
                {copy.columns.version}
              </th>
              <th scope="col" className="meta w-[15%] py-3 pr-4 text-left font-normal">
                {copy.columns.event}
              </th>
              <th scope="col" className="meta w-[10%] py-3 pr-4 text-left font-normal">
                {copy.columns.by}
              </th>
              <th scope="col" className="meta py-3 pr-4 text-left font-normal">
                {copy.columns.title} · {copy.columns.notes}
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((line, index) => (
              <tr
                key={`${line.email}-${line.time}-${index}`}
                className="border-line border-b align-top"
              >
                <td className="text-ink-3 py-3 pr-4 font-mono text-[12px]">{line.time}</td>
                <td className="py-3 pr-4">
                  {slugs[line.email] ? (
                    <Link
                      href={`/f/${slugs[line.email]}`}
                      className="text-ink-1 hover:text-violet-ink no-underline"
                    >
                      {line.name}
                    </Link>
                  ) : (
                    line.name
                  )}
                </td>
                <td className="text-ink-2 py-3 pr-4 font-mono text-[12px]">{line.version}</td>
                <td className="text-ink-1 py-3 pr-4">{line.event}</td>
                <td className="text-ink-2 py-3 pr-4">{line.by}</td>
                <td className="user-text text-ink-2 py-3 pr-4 whitespace-pre-line">
                  {line.title}
                  {line.notes ? <span className="text-ink-2 block pt-1">{line.notes}</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 ? <p className="text-ink-3 py-10 text-center">{copy.empty}</p> : null}
      </div>
    </div>
  )
}
