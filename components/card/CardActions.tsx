'use client'

import { Download, Share2 } from 'lucide-react'
import { useState } from 'react'
import { card as copy, share as shareCopy } from '@/content/copy'

/**
 * Download the card as an image, or share it. Sharing sends the public link
 * to their card (which unfurls with the card as its preview) and attaches the
 * PNG where the phone allows. Where there is no share sheet, the link is
 * copied instead.
 */
export function CardActions({ slug, name }: { slug: string; name: string }) {
  const href = `/api/card/${slug}`
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = `${window.location.origin}/c/${slug}`
    const text = shareCopy.text(name)
    try {
      if (typeof navigator.share === 'function') {
        const blob = await (await fetch(href)).blob()
        const file = new File([blob], `${slug}-forgex.png`, { type: 'image/png' })
        const withFile = { files: [file], title: shareCopy.title(name), text: `${text} ${url}`, url }
        if (navigator.canShare?.(withFile)) await navigator.share(withFile)
        else await navigator.share({ title: shareCopy.title(name), text, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Dismissing the share sheet is not an error worth showing.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={href} download={`${slug}-forgex.png`} className="btn btn-secondary press">
        <Download size={16} strokeWidth={1.5} aria-hidden="true" />
        {copy.download}
      </a>
      <button type="button" className="btn btn-secondary press" onClick={() => void share()}>
        <Share2 size={16} strokeWidth={1.5} aria-hidden="true" />
        {copy.share}
      </button>
      <span className="text-ink-2 text-[13px]" role="status">
        {copied ? shareCopy.copied : ''}
      </span>
    </div>
  )
}
