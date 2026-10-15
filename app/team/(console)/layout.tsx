import type { Metadata } from 'next'
import { consoleCopy, meta } from '@/content/copy'
import { Brand } from '@/components/shell/Brand'
import { Users } from 'lucide-react'
import { Account } from '@/components/shell/Account'
import { HeaderLink } from '@/components/shell/HeaderLink'
import { TeamNav } from '@/components/team/TeamNav'
import { allEntries } from '@/lib/data/hackathon'
import { bank } from '@/lib/data/problems'
import { requireTeam } from '@/lib/session'
import { staffOf } from '@/lib/staff'

export const metadata: Metadata = {
  title: { default: meta.pages.console, template: meta.pages.consoleTemplate },
  robots: { index: false, follow: false },
}

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireTeam()
  const staff = staffOf(viewer.email)
  const [problems, entries] = await Promise.all([bank(), allEntries()])
  const drafts = problems.filter((item) => item.status === 'draft').length
  // A reviewer's count is their own students; everyone else sees the whole queue.
  const waiting = entries.filter(
    (entry) =>
      entry.state === 'waiting' &&
      (!staff.reviewer || entry.reviewer.toLowerCase() === staff.reviewer.toLowerCase()),
  ).length
  return (
    <div className="min-h-dvh">
      <header className="border-line bg-ground/90 sticky top-0 z-30 border-b backdrop-blur">
        {/* On a phone the tabs take a row of their own under the logo, so nothing
            pushes the page wider than the screen. */}
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 md:flex-nowrap md:px-8">
          <Brand href="/team" />
          <div className="order-last -mx-1 w-full md:order-none md:mx-0 md:mr-auto md:w-auto">
            <TeamNav drafts={drafts} waiting={waiting} />
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
