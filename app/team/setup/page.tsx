import type { Metadata } from 'next'
import { consoleCopy, meta } from '@/content/copy'
import { closeLabel } from '@/lib/dates'
import { batchGet } from '@/lib/sheet/google'
import { decode, TABS, type TabKey } from '@/lib/sheet/tabs'
import { isMock } from '@/lib/store/mode'

export const metadata: Metadata = { title: meta.pages.setup }
// Every visit asks Google afresh: a cached answer would hide the thing being checked.
export const dynamic = 'force-dynamic'

const copy = consoleCopy.setup

type Check = { label: string; ok: boolean; detail: string }

const has = (name: string) => Boolean(process.env[name]?.trim())

async function sheetChecks(): Promise<Check[]> {
  if (isMock()) return [{ label: copy.sheet, ok: false, detail: copy.sheetSkipped }]
  if (!has('SHEET_ID') || !has('GOOGLE_SA_EMAIL') || !has('GOOGLE_SA_KEY')) {
    return [{ label: copy.sheet, ok: false, detail: copy.sheetMissing }]
  }
  try {
    const names = Object.values(TABS).map((tab) => tab.name)
    const grids = await batchGet(names)
    const checks = (Object.keys(TABS) as TabKey[]).map((key): Check => {
      try {
        const rows = decode(key, grids[TABS[key].name] ?? [])
        return { label: TABS[key].name, ok: true, detail: copy.rows(rows.length) }
      } catch (error) {
        return {
          label: TABS[key].name,
          ok: false,
          detail: error instanceof Error ? error.message : String(error),
        }
      }
    })
    const problems = decode('problems', grids[TABS.problems.name] ?? [])
    const live = problems.filter((row) => row.cells.Status.trim() === 'approved').length
    return [
      { label: copy.sheet, ok: true, detail: copy.sheetOk },
      ...checks,
      { label: copy.bank, ok: live > 0, detail: live > 0 ? copy.live(live) : copy.noneLive },
    ]
  } catch (error) {
    return [
      {
        label: copy.sheet,
        ok: false,
        detail: error instanceof Error ? error.message : String(error),
      },
    ]
  }
}

/**
 * Is this deploy wired up? Team only, and it never prints a secret: only
 * whether each one is there and whether Google accepts it. Signing in to see
 * this page is itself the test that Google sign-in works.
 */
export default async function SetupPage() {
  const close = process.env.PICKS_CLOSE_AT ?? ''
  const closeAt = Date.parse(close)
  const checks: Check[] = [
    { label: copy.signIn, ok: true, detail: copy.signInOk },
    {
      label: 'AUTH_SECRET',
      ok: has('AUTH_SECRET'),
      detail: has('AUTH_SECRET') ? copy.set : copy.missing,
    },
    {
      label: 'AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET',
      ok: has('AUTH_GOOGLE_ID') && has('AUTH_GOOGLE_SECRET'),
      detail: has('AUTH_GOOGLE_ID') && has('AUTH_GOOGLE_SECRET') ? copy.set : copy.missing,
    },
    { label: copy.mock, ok: !isMock(), detail: isMock() ? copy.mockOn : copy.mockOff },
    {
      label: 'NEXT_PUBLIC_SITE_URL',
      ok: has('NEXT_PUBLIC_SITE_URL'),
      detail: process.env.NEXT_PUBLIC_SITE_URL || copy.missing,
    },
    {
      label: 'PICKS_CLOSE_AT',
      ok: Number.isFinite(closeAt) && closeAt > Date.now(),
      detail: Number.isFinite(closeAt)
        ? closeAt > Date.now()
          ? closeLabel(close)
          : copy.closed(closeLabel(close))
        : copy.missing,
    },
    ...(await sheetChecks()),
    {
      label: copy.email,
      ok: true,
      detail: has('RESEND_API_KEY') && has('EMAIL_FROM') ? copy.emailOn : copy.emailOff,
    },
  ]
  const failing = checks.filter((check) => !check.ok).length

  return (
    <div className="grid max-w-[880px] gap-8">
      <div className="grid gap-2">
        <h1 className="display m-0 text-[40px] leading-none">{copy.title}</h1>
        <p className={`text-lead m-0 ${failing ? 'text-violet-ink' : 'text-ok'}`}>
          {failing ? copy.failing(failing) : copy.allGood}
        </p>
      </div>
      <ul className="m-0 grid list-none gap-0 p-0">
        {checks.map((check) => (
          <li
            key={check.label}
            className="border-line grid grid-cols-[28px_minmax(0,1fr)] gap-3 border-t py-3.5 md:grid-cols-[28px_280px_minmax(0,1fr)]"
          >
            <span
              className={`font-mono text-[15px] ${check.ok ? 'text-ok' : 'text-violet-ink'}`}
              aria-label={check.ok ? copy.pass : copy.fail}
            >
              {check.ok ? '✓' : '✗'}
            </span>
            <span className="text-ink-1 text-[15px]">{check.label}</span>
            <span className="text-ink-2 col-start-2 text-[14px] break-words md:col-start-auto">
              {check.detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
