'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { LogOut } from 'lucide-react'
import { signOutTeam } from '@/app/actions/session'
import { account as copy } from '@/content/copy'

/** Two letters for a face we have no photo of: Priya Sharma reads as PS. */
function initials(name: string, email: string): string {
  const words = (name || email.split('@')[0] || '').split(/[\s._-]+/).filter(Boolean)
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

/**
 * The team's own corner: their Google photo, or their initials, and behind it
 * who they are signed in as and the way out. Founders never get one.
 */
export function Account({ name, email, photo }: { name: string; email: string; photo: string }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const panel = useId()

  useEffect(() => {
    if (!open) return
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        className="press text-ink-1 grid size-10 place-items-center overflow-hidden rounded-full border-0 bg-white/10 p-0 text-[13px] font-semibold shadow-[inset_0_0_0_1px_var(--color-line-2)]"
        aria-label={copy.open(name || email)}
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen((value) => !value)}
      >
        {photo ? (
          <Image src={photo} alt="" width={40} height={40} className="size-10 object-cover" />
        ) : (
          initials(name, email)
        )}
      </button>
      {open ? (
        <div
          id={panel}
          className="panel absolute top-[calc(100%+8px)] right-0 z-50 grid w-[min(280px,calc(100vw-40px))] gap-4 p-4"
        >
          <div className="grid min-w-0 gap-0.5">
            <p className="text-ink-1 m-0 truncate text-[15px] font-semibold">{name || email}</p>
            <p className="text-ink-3 m-0 truncate text-[13px]">{email}</p>
          </div>
          <form action={signOutTeam} className="border-line border-t pt-3">
            <button
              type="submit"
              className="btn btn-secondary press min-h-10 w-full gap-2 text-[14px]"
            >
              <LogOut size={16} strokeWidth={1.5} aria-hidden="true" />
              {copy.signOut}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
