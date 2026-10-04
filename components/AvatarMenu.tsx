'use client'

import * as Popover from '@radix-ui/react-popover'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { copy } from '@/lib/copy'

export function AvatarMenu({ name, email, photo }: { name: string; email: string; photo: string }) {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={name}
        className="border-line bg-surface h-9 w-9 shrink-0 overflow-hidden rounded-full border transition-colors duration-150 hover:border-white/20"
      >
        {photo ? (
          <Image
            src={photo}
            alt=""
            width={36}
            height={36}
            unoptimized={photo.startsWith('/')}
            className="h-9 w-9 object-cover"
          />
        ) : (
          <span className="text-secondary flex h-9 w-9 items-center justify-center font-mono text-[12px]">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="border-line-strong bg-surface-modal z-[70] w-60 rounded-xl border p-3 shadow-xl shadow-black/50"
        >
          <p className="text-primary truncate text-[14px]">{name}</p>
          <p className="text-muted truncate text-[13px]">{email}</p>
          <button
            type="button"
            onClick={() => void signOut({ callbackUrl: '/login' })}
            className="border-line text-secondary hover:text-primary mt-3 w-full rounded-lg border px-3 py-1.5 text-left text-[13px] transition-colors duration-150 hover:border-white/15"
          >
            {copy.avatarMenu.signOut}
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
