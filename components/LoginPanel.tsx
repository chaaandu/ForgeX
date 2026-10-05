'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { copy } from '@/lib/copy'

type PickerEntry = { email: string; name: string; role: string }

export function LoginPanel({ picker }: { picker: PickerEntry[] }) {
  const [busy, setBusy] = useState(false)

  return (
    <div className="mt-8 flex w-full flex-col items-center">
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true)
          void signIn('google', { callbackUrl: '/' })
        }}
        className="bg-primary text-ink h-11 w-full rounded-xl text-[14px] font-medium transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
      >
        {copy.login.button}
      </button>

      <p className="text-muted mt-3 text-[13px]">{copy.login.underButton}</p>

      {picker.length > 0 && (
        <div className="border-line mt-10 flex w-full flex-col gap-2 border-t pt-6">
          {picker.map((entry) => (
            <button
              key={entry.email}
              type="button"
              data-mock-signin={entry.email}
              onClick={() => {
                setBusy(true)
                void signIn('mock', { email: entry.email, callbackUrl: '/' })
              }}
              className="border-line flex items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-colors duration-150 hover:border-white/15"
            >
              <span className="min-w-0">
                <span className="text-primary block truncate text-[14px]">{entry.name}</span>
                <span className="text-muted block truncate text-[12px]">{entry.email}</span>
              </span>
              <span className="label shrink-0">{entry.role}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
