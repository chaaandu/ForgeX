'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { replyMessage } from '@/app/actions/team'
import { consoleCopy } from '@/content/copy'

const copy = consoleCopy.messages

export function ReplyBox({ founder, name }: { founder: string; name: string }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [failed, setFailed] = useState(false)
  const [pending, start] = useTransition()
  return (
    <form
      className="grid gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        start(async () => {
          setFailed(false)
          const result = await replyMessage({ founder, text })
          if (result.ok) {
            setText('')
            router.refresh()
          } else setFailed(true)
        })
      }}
    >
      <textarea
        className="field min-h-[88px] text-[15px]"
        aria-label={`${copy.reply}: ${name}`}
        value={text}
        maxLength={2000}
        placeholder={copy.replyPlaceholder}
        onChange={(event) => setText(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary press" disabled={pending || !text.trim()}>
          {pending ? copy.sending : copy.send}
        </button>
        {failed ? (
          <p role="alert" className="text-violet-ink m-0 text-[14px]">
            {copy.failed}
          </p>
        ) : null}
      </div>
    </form>
  )
}
