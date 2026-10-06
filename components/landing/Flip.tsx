'use client'

import { useEffect } from 'react'

/** One listener flips every face on the wall: tap to turn, tap again or move on to turn back. */
export function Flip() {
  useEffect(() => {
    function close(except?: Element) {
      document.querySelectorAll('[data-face][aria-pressed="true"]').forEach((face) => {
        if (face !== except) face.setAttribute('aria-pressed', 'false')
      })
    }
    function onClick(event: MouseEvent) {
      const face = (event.target as Element | null)?.closest('[data-face]')
      if (!face) return
      const open = face.getAttribute('aria-pressed') === 'true'
      close(face)
      const name = face.querySelector('.wf-back b')
      const kind = face.querySelector('.wf-back i')
      if (name && !name.textContent) name.textContent = face.getAttribute('data-first') ?? ''
      if (kind && !kind.textContent) kind.textContent = face.getAttribute('data-kind') ?? ''
      face.setAttribute('aria-pressed', open ? 'false' : 'true')
    }
    function onFocusOut(event: FocusEvent) {
      const face = (event.target as Element | null)?.closest('[data-face]')
      if (face) face.setAttribute('aria-pressed', 'false')
    }
    document.addEventListener('click', onClick)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])
  return null
}
