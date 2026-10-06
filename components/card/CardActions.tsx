'use client'

import { Download, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { card as copy } from '@/content/copy'

/**
 * Download the card as an image, or hand it to the phone's share sheet with
 * the image attached, so it can go to LinkedIn or anywhere without the
 * founder's page ever being public.
 */
export function CardActions({ slug, name }: { slug: string; name: string }) {
  const href = `/api/card/${slug}`
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    const probe = new File([''], 'card.png', { type: 'image/png' })
    setCanShare(typeof navigator.canShare === 'function' && navigator.canShare({ files: [probe] }))
  }, [])

  async function share() {
    const blob = await (await fetch(href)).blob()
    const file = new File([blob], `${slug}-forgex.png`, { type: 'image/png' })
    try {
      await navigator.share({ files: [file], title: copy.shareText(name) })
    } catch {
      // Dismissing the share sheet is not an error worth showing.
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a href={href} download={`${slug}-forgex.png`} className="btn btn-secondary press">
        <Download size={16} strokeWidth={1.5} aria-hidden="true" />
        {copy.download}
      </a>
      {canShare ? (
        <button type="button" className="btn btn-secondary press" onClick={() => void share()}>
          <Share2 size={16} strokeWidth={1.5} aria-hidden="true" />
          {copy.share}
        </button>
      ) : null}
    </div>
  )
}
