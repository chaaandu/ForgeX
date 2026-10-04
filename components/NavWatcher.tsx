'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Marks that the user has navigated inside the app, so the modal knows whether
 * closing should go back or replace the URL.
 */
export function NavWatcher() {
  const pathname = usePathname()
  const search = useSearchParams()
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.__forgexNavigated = true
  }, [pathname, search])

  return null
}
