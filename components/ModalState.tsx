'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Which problem the modal is showing, held in the client and mirrored into the
 * URL by hand. Keeping it out of the router means opening, closing and walking
 * the list with the arrow keys never waits on a server round trip.
 */

type ModalValue = {
  openId: string | null
  open: (problemId: string) => void
  close: () => void
  /** Neighbours in the current filtered order, or null at either end. */
  prevId: string | null
  nextId: string | null
  goPrev: () => void
  goNext: () => void
  /** 1-based position in the filtered list, and how many there are. */
  position: { at: number; of: number } | null
}

const ModalContext = createContext<ModalValue | null>(null)

export function useModal(): ModalValue {
  const value = useContext(ModalContext)
  if (!value) throw new Error('useModal outside ModalProvider')
  return value
}

function urlFor(problemId: string | null): string {
  const query = new URLSearchParams(window.location.search)
  if (problemId) query.set('p', problemId)
  else query.delete('p')
  const text = query.toString()
  return `${window.location.pathname}${text ? `?${text}` : ''}`
}

export function ModalProvider({
  children,
  initialOpenId,
  ids,
}: {
  children: React.ReactNode
  initialOpenId: string | null
  /** The filtered list, in the order the grid shows it. */
  ids: string[]
}) {
  const [openId, setOpenId] = useState<string | null>(initialOpenId)

  const open = useCallback((problemId: string) => {
    window.history.pushState({ forgexProblem: problemId }, '', urlFor(problemId))
    setOpenId(problemId)
  }, [])

  const close = useCallback(() => {
    // Going back keeps the history clean when the modal was opened from the
    // grid. A deep link has nothing behind it, so the param is replaced.
    if (window.history.state?.forgexProblem) window.history.back()
    else window.history.replaceState({}, '', urlFor(null))
    setOpenId(null)
  }, [])

  const step = useCallback((problemId: string) => {
    window.history.replaceState({ forgexProblem: problemId }, '', urlFor(problemId))
    setOpenId(problemId)
  }, [])

  useEffect(() => {
    const onPop = () => {
      const fromUrl = new URLSearchParams(window.location.search).get('p')
      setOpenId(fromUrl)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const { prevId, nextId, position } = useMemo(() => {
    if (!openId) return { prevId: null, nextId: null, position: null }
    const at = ids.indexOf(openId)
    return {
      prevId: at > 0 ? (ids[at - 1] ?? null) : null,
      nextId: at >= 0 && at < ids.length - 1 ? (ids[at + 1] ?? null) : null,
      position: at >= 0 ? { at: at + 1, of: ids.length } : null,
    }
  }, [openId, ids])

  const value: ModalValue = {
    openId,
    open,
    close,
    prevId,
    nextId,
    goPrev: useCallback(() => prevId && step(prevId), [prevId, step]),
    goNext: useCallback(() => nextId && step(nextId), [nextId, step]),
    position,
  }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}
