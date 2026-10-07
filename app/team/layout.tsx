import type { Metadata } from 'next'
import { consoleCopy, meta } from '@/content/copy'
import { Brand } from '@/components/shell/Brand'
import { Users } from 'lucide-react'
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
        {/* On a phone the tabs take a row of their own under the logo, so nothing
            pushes the page wider than the screen. */}
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 md:flex-nowrap md:px-8">
          <Brand href="/team" />
          <div className="order-last -mx-1 w-full md:order-none md:mx-0 md:mr-auto md:w-auto">
            <TeamNav waiting={waiting} drafts={drafts} />
          </div>
          <div className="flex items-center gap-2">
            <HeaderLink
              href="/"
              label={consoleCopy.wall}
              icon={<Users size={16} strokeWidth={1.5} aria-hidden="true" />}
            />
            <Account name={viewer.name} email={viewer.email} photo={viewer.photo} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">{children}</main>
    </div>
  )
}
