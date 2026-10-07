'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { X } from 'lucide-react'
import { setSeat } from '@/app/actions/team'
import { Avatar } from '@/components/ui/Avatar'
import { consoleCopy } from '@/content/copy'

const copy = consoleCopy.pods

export type PodPerson = { email: string; name: string; photo: string; pod: number | null }

/**
 * The 5 pods side by side: each pod's mentors, then its founders, each with a
 * picker to move them. Everyone not yet in a pod waits in the last column.
 */
export function PodBoard({
  members,
  mentors,
  pods,
}: {
  members: PodPerson[]
  mentors: PodPerson[]
  pods: number[]
}) {
  const router = useRouter()
  const [failed, setFailed] = useState(false)
  const [pending, start] = useTransition()

  function move(email: string, pod: number | null, role: 'member' | 'mentor') {
    start(async () => {
      setFailed(false)
      const result = await setSeat({ email, pod, role })
      if (result.ok) router.refresh()
      else setFailed(true)
    })
  }

  const picker = (person: PodPerson) => (
    <select
      className="field h-9 min-h-0 w-auto py-0 text-[13px]"
      aria-label={copy.move(person.name)}
      value={person.pod ?? ''}
      disabled={pending}
      onChange={(event) =>
        move(person.email, event.target.value ? Number(event.target.value) : null, 'member')
      }
    >
      <option value="">{copy.unassigned}</option>
      {pods.map((n) => (
        <option key={n} value={n}>
          {copy.pod(String(n))}
        </option>
      ))}
    </select>
  )

  const unassigned = members.filter((person) => person.pod === null)

  return (
    <div className="grid gap-4">
      {failed ? (
        <p role="alert" className="text-violet-ink m-0 text-[14px]">
          {copy.failed}
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pods.map((n) => {
          const inPod = members.filter((person) => person.pod === n)
          const podMentors = mentors.filter((person) => person.pod === n)
          const free = mentors.filter((person) => person.pod === null)
          return (
            <section
              key={n}
              className="panel grid content-start gap-4 p-5"
              aria-labelledby={`pod-${n}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 id={`pod-${n}`} className="display m-0 text-[26px] leading-none">
                  {copy.pod(String(n))}
                </h2>
                <span className="text-ink-3 font-mono text-[12px]">
                  {copy.members(String(inPod.length))}
                </span>
              </div>
              <div className="grid gap-2">
                <span className="meta">{copy.mentors}</span>
                {podMentors.length ? (
                  podMentors.map((person) => (
                    <div key={person.email} className="flex items-center gap-2">
                      <Avatar src={person.photo} size={28} />
                      <span className="min-w-0 flex-1 truncate text-[14px]">{person.name}</span>
                      <button
                        type="button"
                        className="btn btn-quiet press min-h-8 px-2"
                        aria-label={copy.remove(person.name)}
                        disabled={pending}
                        onClick={() => move(person.email, null, 'mentor')}
                      >
                        <X size={16} strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-ink-3 text-[14px]">{copy.noMentor}</span>
                )}
                <select
                  className="field h-9 min-h-0 py-0 text-[13px]"
                  aria-label={copy.addMentor(String(n))}
                  value=""
                  disabled={pending || free.length === 0}
                  onChange={(event) => {
                    if (event.target.value) move(event.target.value, n, 'mentor')
                  }}
                >
                  <option value="">{copy.pickMentor}</option>
                  {free.map((person) => (
                    <option key={person.email} value={person.email}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
              <ul className="m-0 grid list-none gap-2 p-0">
                {inPod.map((person) => (
                  <li key={person.email} className="flex items-center gap-2">
                    <Avatar src={person.photo} size={28} />
                    <span className="min-w-0 flex-1 truncate text-[14px]">{person.name}</span>
                    {picker(person)}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
        <section className="panel grid content-start gap-4 p-5" aria-labelledby="pod-none">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="pod-none" className="display m-0 text-[26px] leading-none">
              {copy.unassigned}
            </h2>
            <span className="text-ink-3 font-mono text-[12px]">
              {copy.members(String(unassigned.length))}
            </span>
          </div>
          {unassigned.length ? (
            <ul className="m-0 grid list-none gap-2 p-0">
              {unassigned.map((person) => (
                <li key={person.email} className="flex items-center gap-2">
                  <Avatar src={person.photo} size={28} />
                  <span className="min-w-0 flex-1 truncate text-[14px]">{person.name}</span>
                  {picker(person)}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-ink-3 text-[14px]">{copy.none}</span>
          )}
        </section>
      </div>
    </div>
  )
}
