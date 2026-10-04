'use client'

import { usePathname, useRouter } from 'next/navigation'
import { copy } from '@/lib/copy'

export function EmptyState() {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <p className="text-secondary text-[15px]">{copy.empty.line}</p>
      <button
        type="button"
        onClick={() => router.replace(pathname, { scroll: false })}
        className="text-primary text-[14px] underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:decoration-white"
      >
        {copy.empty.link}
      </button>
    </div>
  )
}
