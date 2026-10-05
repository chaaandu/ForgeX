import { redirect } from 'next/navigation'
import { LoginPanel } from '@/components/LoginPanel'
import { RefusedPanel } from '@/components/RefusedPanel'
import { copy } from '@/lib/copy'
import { getViewer } from '@/lib/session'
import { students } from '@/lib/students'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [viewer, params] = await Promise.all([getViewer(), searchParams])
  if (viewer) redirect('/')

  // Any sign-in error is a refused account: the only thing that can fail here
  // is the domain check.
  if (params.error !== undefined) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6">
        <RefusedPanel />
      </main>
    )
  }

  const mock = process.env.MOCK_BACKEND === 'true'
  const picker = mock
    ? [
        ...students.slice(0, 2).map((student) => ({
          email: student.email,
          name: student.name,
          role: 'Student',
        })),
        { email: 'team@mesaschool.co', name: 'Mesa Team', role: 'Team' },
        { email: 'someone@gmail.com', name: 'Outside account', role: 'Refused' },
      ]
    : []

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <p className="label">{copy.login.label}</p>
        <h1 className="mt-6 flex flex-col gap-1 text-[22px] leading-[1.35] font-medium tracking-[-0.02em]">
          <span className="text-muted">{copy.login.line}</span>
          <span className="text-primary">{copy.login.lineTwo}</span>
        </h1>
        <LoginPanel picker={picker} />
      </div>
    </main>
  )
}
