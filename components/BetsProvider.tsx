'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { placeBet, releaseBet } from '@/app/actions'
import { copy } from '@/lib/copy'
import { betsRouteSchema } from '@/lib/schema'
import type { BetMap, Role } from '@/lib/types'
import { useToast } from './Toast'

const POLL_MS = 15_000

type BetsValue = {
  bets: BetMap
  role: Role
  email: string
  closed: boolean
  degraded: boolean
  /** Changes this student has left. The first pick does not spend one. */
  changesLeft: number
  /** The problem this viewer holds, if any. */
  myBetId: string | null
  /** IDs whose stamp arrived from polling, so they fade in rather than slam. */
  quiet: Set<string>
  /** The viewer's own just-placed bet, which gets the slam. */
  slamId: string | null
  /** How a stamp on this problem should arrive. */
  entranceFor: (problemId: string) => 'slam' | 'fade' | 'none'
  pending: boolean
  bet: (problemId: string) => Promise<boolean>
  release: () => Promise<boolean>
}

const BetsContext = createContext<BetsValue | null>(null)

export function useBets(): BetsValue {
  const value = useContext(BetsContext)
  if (!value) throw new Error('useBets outside BetsProvider')
  return value
}

export function BetsProvider({
  children,
  initialBets,
  role,
  email,
  name,
  photo,
  closed,
  degraded: initialDegraded,
  changesLeft: initialChangesLeft,
}: {
  children: React.ReactNode
  initialBets: BetMap
  role: Role
  email: string
  name: string
  photo: string
  closed: boolean
  degraded: boolean
  /** Changes this student has left. The first pick does not spend one. */
  changesLeft: number
}) {
  const [bets, setBets] = useState<BetMap>(initialBets)
  const [degraded, setDegraded] = useState(initialDegraded)
  const [changesLeft, setChangesLeft] = useState(initialChangesLeft)
  const [pending, setPending] = useState(false)
  const [quiet, setQuiet] = useState<Set<string>>(new Set())
  const [slamId, setSlamId] = useState<string | null>(null)
  const known = useRef(new Set(Object.keys(initialBets)))
  const toast = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  // "Open only" is filtered on the server, so a change seen by polling has to
  // reach the server render as well.
  const openOnly = search.get('open') === '1'
  const openOnlyRef = useRef(openOnly)
  openOnlyRef.current = openOnly

  const adopt = useCallback(
    (next: BetMap, fromPoll: boolean) => {
      const keys = Object.keys(next)
      const changed =
        keys.length !== known.current.size || keys.some((id) => !known.current.has(id))
      if (fromPoll && changed) {
        const fresh = keys.filter((id) => !known.current.has(id))
        if (fresh.length) setQuiet((current) => new Set([...current, ...fresh]))
      }
      known.current = new Set(keys)
      setBets(next)
      // The server does the "Open only" filtering, so a change seen by polling
      // has to reach it too. Not while the modal is open, which would leave a
      // navigation pending under the dialog.
      if (changed && openOnlyRef.current && !document.body.dataset.modalOpen) router.refresh()
    },
    [router],
  )

  const poll = useCallback(async () => {
    try {
      const response = await fetch('/api/bets', { cache: 'no-store' })
      if (!response.ok) return
      const parsed = betsRouteSchema.safeParse(await response.json())
      if (!parsed.success) return
      adopt(parsed.data.bets, true)
      setDegraded(parsed.data.degraded)
      if (parsed.data.changesLeft !== null) setChangesLeft(parsed.data.changesLeft)
    } catch {
      /* a dropped poll is not worth telling anyone about */
    }
  }, [adopt])

  useEffect(() => {
    if (closed) return
    const timer = setInterval(poll, POLL_MS)
    const onFocus = () => poll()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', onFocus)
    }
  }, [poll, closed, pathname])

  const myBetId = useMemo(
    () => Object.keys(bets).find((id) => bets[id]?.email === email) ?? null,
    [bets, email],
  )

  const bet = useCallback(
    async (problemId: string) => {
      const before = bets
      setPending(true)
      // Optimistic: free whatever this viewer holds, then claim the new one.
      const optimistic: BetMap = { ...bets }
      for (const id of Object.keys(optimistic)) {
        if (optimistic[id]?.email === email) delete optimistic[id]
      }
      optimistic[problemId] = { name, email, photo, at: new Date().toISOString() }
      setBets(optimistic)

      const result = await placeBet(problemId)
      setPending(false)

      if (result.ok) {
        adopt(result.bets, false)
        if (result.changesLeft !== undefined) setChangesLeft(result.changesLeft)
        setSlamId(problemId)
        return true
      }
      setBets(before)
      if (result.error === 'taken') {
        toast(copy.toast.race(result.by ?? ''))
        void poll()
      } else if (result.error === 'locked') {
        setChangesLeft(0)
        toast(copy.toast.locked)
      } else {
        toast(copy.toast.saveFailed)
      }
      return false
    },
    [bets, email, name, photo, adopt, poll, toast],
  )

  const release = useCallback(async () => {
    const before = bets
    setPending(true)
    const optimistic: BetMap = { ...bets }
    for (const id of Object.keys(optimistic)) {
      if (optimistic[id]?.email === email) delete optimistic[id]
    }
    setBets(optimistic)

    const result = await releaseBet()
    setPending(false)
    if (result.ok) {
      adopt(result.bets, false)
      if (result.changesLeft !== undefined) setChangesLeft(result.changesLeft)
      return true
    }
    setBets(before)
    if (result.error === 'locked') {
      setChangesLeft(0)
      toast(copy.toast.locked)
    } else {
      toast(copy.toast.saveFailed)
    }
    return false
  }, [bets, email, adopt, toast])

  const entranceFor = useCallback(
    (problemId: string): 'slam' | 'fade' | 'none' => {
      if (problemId === slamId) return 'slam'
      if (quiet.has(problemId)) return 'fade'
      return 'none'
    },
    [slamId, quiet],
  )

  const value: BetsValue = {
    bets,
    role,
    email,
    closed,
    degraded,
    changesLeft,
    myBetId,
    quiet,
    slamId,
    entranceFor,
    pending,
    bet,
    release,
  }

  return <BetsContext.Provider value={value}>{children}</BetsContext.Provider>
}
