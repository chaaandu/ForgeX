'use client'

import { useState, type ReactNode } from 'react'

/** Remounts its children so a one-shot reveal can be watched again. */
export function Replay({
  children,
  className,
  label = 'Replay',
}: {
  children: ReactNode
  className?: string
  label?: string
}) {
  const [run, setRun] = useState(0)
  return (
    <>
      <div key={run} className="contents">
        {children}
      </div>
      <button type="button" className={className} onClick={() => setRun((value) => value + 1)}>
        {label}
      </button>
    </>
  )
}
