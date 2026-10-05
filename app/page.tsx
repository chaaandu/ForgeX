import { Suspense } from 'react'
import { BetsProvider } from '@/components/BetsProvider'
import { GridSkeleton } from '@/components/CardSkeleton'
import { EmptyState } from '@/components/EmptyState'
import { FilterBar } from '@/components/FilterBar'
import { Header } from '@/components/Header'
import { ModalProvider } from '@/components/ModalState'
import { PausedNotice } from '@/components/PausedNotice'
import { ProblemCard } from '@/components/ProblemCard'
import { ProblemModal } from '@/components/ProblemModal'
import { ToastProvider } from '@/components/Toast'
import { getChangesLeft, getSnapshot } from '@/lib/backend'
import {
  applyFilters,
  clustersOf,
  isFiltering,
  mechanicsOf,
  parseFilters,
  toQuery,
  type SearchParams,
} from '@/lib/filters'
import { requireViewer } from '@/lib/session'
import { closeTimeIso, formatCloseTime, isClosed } from '@/lib/time'
import { visibleBets } from '@/lib/visibility'

export const dynamic = 'force-dynamic'

export default async function GridPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [viewer, params] = await Promise.all([requireViewer(), searchParams])
  const { problems, bets, degraded } = await getSnapshot()

  const filters = parseFilters(params)
  const seen = visibleBets(viewer.role, viewer.email, bets)
  const filtered = applyFilters(problems, filters, bets)

  const titles = Object.fromEntries(problems.map((problem) => [problem.id, problem.title]))
  const href = (id: string) => `/${toQuery(filters, { p: id })}`

  const requested = typeof params.p === 'string' ? params.p : ''
  const openId = problems.some((problem) => problem.id === requested) ? requested : null

  return (
    <ToastProvider>
      <BetsProvider
        initialBets={seen}
        role={viewer.role}
        email={viewer.email}
        name={viewer.name}
        photo={viewer.photo}
        closed={isClosed()}
        degraded={degraded}
        changesLeft={viewer.role === 'student' ? await getChangesLeft(viewer.email) : 0}
      >
        <ModalProvider initialOpenId={openId} ids={filtered.map((problem) => problem.id)}>
          <div className="px-4 pb-4 sm:px-6">
            <Header
              firstName={viewer.firstName}
              name={viewer.name}
              email={viewer.email}
              photo={viewer.photo}
              closesAt={formatCloseTime(closeTimeIso())}
              titles={titles}
              total={problems.length}
            />
          </div>

          <Suspense fallback={null}>
            <FilterBar
              filters={filters}
              clusters={clustersOf(problems)}
              mechanics={mechanicsOf(problems)}
              count={filtered.length}
            />
          </Suspense>

          <main className="px-4 pt-6 pb-24 sm:px-6">
            <PausedNotice />
            {filtered.length === 0 && isFiltering(filters) ? (
              <EmptyState />
            ) : (
              <Suspense fallback={<GridSkeleton />}>
                <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {filtered.map((problem) => (
                    <ProblemCard key={problem.id} problem={problem} href={href(problem.id)} />
                  ))}
                </div>
              </Suspense>
            )}
          </main>

          <ProblemModal titles={titles} />
        </ModalProvider>
      </BetsProvider>
    </ToastProvider>
  )
}
