import type { Metadata } from 'next'
import { consoleCopy, meta } from '@/content/copy'
import { Brand } from '@/components/shell/Brand'
import { LayoutGrid } from 'lucide-react'
import { Account } from '@/components/shell/Account'
import { HeaderLink } from '@/components/shell/HeaderLink'
import { TeamNav } from '@/components/team/TeamNav'
import { allPicks, allResponses, statusOf } from '@/lib/data/picks'
import { bank } from '@/lib/data/problems'
import { requireTeam } from '@/lib/session'

export const metadata: Metadata = {
  title: { default: meta.pages.console, template: meta.pages.consoleTemplate },
  robots: { index: false, follow: false },
}

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireTeam()
  const [picks, responses, problems] = await Promise.all([allPicks(), allResponses(), bank()])
  const waiting = picks.filter(
    (pick) => !pick.withdrawnAt && statusOf(pick, responses) === 'waiting',
  ).length
  const drafts = problems.filter((item) => item.status === 'draft').length
  return (
    <div className="min-h-dvh">
      <header className="border-line bg-ground/90 sticky top-0 z-30 border-b backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3 md:px-8">
          <div className="flex items-center gap-6">
            <Brand href="/team" />
            <TeamNav waiting={waiting} drafts={drafts} />
          </div>
          <div className="flex items-center gap-2">
            <HeaderLink
              href="/"
              label={consoleCopy.wall}
              icon={<LayoutGrid size={16} strokeWidth={1.5} aria-hidden="true" />}
            />
            <Account name={viewer.name} email={viewer.email} photo={viewer.photo} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">{children}</main>
    </div>
  )
}
