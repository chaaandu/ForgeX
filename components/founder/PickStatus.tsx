'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { withdrawPick } from '@/app/actions/founder'
import { page as copy } from '@/content/copy'
import type { PickStatus as Status } from '@/lib/data/picks'
import type { FounderProblem } from '@/lib/problem'

/**
 * Level 7. While a why is waiting, this says one thing. When we answer, the
 * answer is here; a Try another sends the founder back to matches with their
 * answers kept and our suggestions first.
 */
export function PickStatus({
  title,
  challenge,
  status,
  note,
  suggested,
  own,
}: {
  title: string
  challenge: string
  status: Status
  note: string
  suggested: FounderProblem[]
  own: boolean
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  return (
    <section className="panel grid gap-5 p-6 md:p-8" aria-labelledby="pick-title">
      <h3 id="pick-title" className="display m-0 text-[clamp(28px,3.4vw,40px)] leading-[1.05]">
        {title}
      </h3>
      <p className="text-ink-2 m-0 text-[16px]">{challenge}</p>
      <div className="border-line border-t pt-5">
        {status === 'waiting' ? (
          <div className="grid gap-4">
            <p className="display m-0 text-[clamp(24px,2.8vw,32px)] leading-tight">
              {copy.waiting}
            </p>
            {own ? (
              <div>
                <button
                  type="button"
                  className="btn btn-quiet press -ml-3 text-[14px]"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      const result = await withdrawPick()
                      if (result.ok) router.push('/matches')
                    })
                  }
                >
                  {copy.pickAnother}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-4">
            <p className="display m-0 text-[clamp(24px,2.8vw,32px)] leading-tight">
              {copy.headline[status]}
            </p>
            {note ? (
              <p className="m-0 text-[17px] leading-relaxed whitespace-pre-line">{note}</p>
            ) : null}
            {status === 'another' ? (
              <div className="grid gap-3">
                {suggested.length ? (
                  <>
                    <p className="meta m-0">{copy.suggested}</p>
                    <ul className="m-0 grid list-none gap-2 p-0">
                      {suggested.map((item) => (
                        <li key={item.id} className="display text-[20px] leading-snug">
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {own ? (
                  <div>
                    <Link href="/matches" className="btn btn-primary press">
                      {copy.backToMatches}
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
