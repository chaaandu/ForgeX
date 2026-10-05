'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { copy } from '@/lib/copy'

/** The whole screen when somebody signs in with an account we do not take. */
export function RefusedPanel() {
  const [busy, setBusy] = useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col items-center text-center">
      <p className="label tracking-[0.06em] normal-case">{copy.refused.label}</p>

      <h1
        role="alert"
        className="text-primary mt-6 text-[22px] leading-[1.45] font-medium tracking-[-0.02em]"
      >
        {copy.refused.line}
      </h1>

      <p className="text-secondary mt-3 text-[14px]">{copy.refused.help}</p>

      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true)
          void signIn('google', { callbackUrl: '/' })
        }}
        className="bg-primary text-ink mt-8 h-11 w-full rounded-xl text-[14px] font-medium transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
      >
        {copy.refused.button}
      </button>
    </div>
  )
}
