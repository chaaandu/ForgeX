import type { Metadata } from 'next'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { consoleCopy, meta } from '@/content/copy'
import { buildingOf } from '@/lib/context'
import { allFounders } from '@/lib/data/founders'
import { entries } from '@/lib/data/hackathon'
import { bank } from '@/lib/data/problems'

export const metadata: Metadata = { title: meta.pages.picks }

const copy = consoleCopy.picks

type Who = { name: string; slug: string; photo: string }
type Row = { key: string; no: string | null; title: string; industry: string; who: Who[] }
type Kind = 'all' | 'own' | 'bank'

/**
 * What the cohort is building, in one table: every approved problem of a
 * founder's own, and every bank problem with everyone on it, by founder.
 */
export default async function PicksPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>
}) {
  const { kind: raw } = await searchParams
  const kind: Kind = raw === 'own' || raw === 'bank' ? raw : 'all'
  const [founders, all, problems] = await Promise.all([allFounders(), entries(), bank()])
  const byId = new Map(problems.map((item) => [item.id, item]))
  const fromBank = new Map<string, Row>()
  const own: Row[] = []
  for (const founder of founders) {
    const building = buildingOf(all.get(founder.email), byId)
    if (!building) continue
    const who = { name: founder.name, slug: founder.slug, photo: founder.photo }
    if (building.problem) {
      const row = fromBank.get(building.problem.id) ?? {
        key: building.problem.id,
        no: building.problem.id,
        title: building.title,
        industry: building.industryName,
        who: [],
      }
      row.who.push(who)
      fromBank.set(building.problem.id, row)
    } else {
      own.push({
        key: founder.slug,
        no: null,
        title: building.title,
        industry: building.industryName,
        who: [who],
      })
    }
  }
  // By founder, the way the team looks people up.
  const first = (row: Row) => row.who[0]?.name ?? ''
  const order = (a: Row, b: Row) => first(a).localeCompare(first(b))
  const lists: Record<Kind, Row[]> = {
    all: [...own, ...fromBank.values()].sort(order),
    own: [...own].sort(order),
    bank: [...fromBank.values()].sort(order),
  }
  const picked = own.length + [...fromBank.values()].reduce((sum, row) => sum + row.who.length, 0)
  const rows = lists[kind]

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="display m-0 text-[40px] leading-none">{copy.title}</h1>
        <p className="text-ink-2 m-0">{copy.lead(picked, founders.length)}</p>
      </div>

      <nav className="tabs" aria-label={copy.title}>
        {(['all', 'own', 'bank'] as const).map((key) => (
          <Link
            key={key}
            href={key === 'all' ? '/team/picks' : `/team/picks?kind=${key}`}
            aria-current={kind === key ? 'page' : undefined}
            className="tab"
          >
            {copy.kinds[key]}
            <span className="tab-count">{lists[key].length}</span>
          </Link>
        ))}
      </nav>

      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-[14px]">
            <thead className="border-line border-b">
              <tr className="meta text-left">
                <th scope="col" className="w-[26%] py-3 pr-6 font-normal">
                  {copy.columns.who}
                </th>
                <th scope="col" className="w-[14%] py-3 pr-6 font-normal">
                  {copy.columns.industry}
                </th>
                <th scope="col" className="py-3 font-normal">
                  {copy.columns.problem}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-line border-b align-top">
                  <td className="py-4 pr-6">
                    <ul className="m-0 grid list-none gap-2 p-0">
                      {row.who.map((person) => (
                        <li key={person.slug}>
                          <Link
                            href={`/f/${person.slug}`}
                            className="text-ink-1 hover:text-violet-ink inline-flex items-center gap-2.5 no-underline"
                          >
                            <Avatar src={person.photo} size={28} />
                            {person.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="text-ink-2 py-4 pr-6">{row.industry}</td>
                  <td className="py-4">
                    <span className="user-text text-ink-1 block text-[15px] leading-snug">
                      {row.title}
                    </span>
                    <span className="meta mt-1.5 block text-[10px]">
                      {row.no ? copy.fromBank(row.no) : copy.ownTag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-ink-3 py-16 text-center">{copy.empty[kind]}</p>
      )}
    </div>
  )
}
