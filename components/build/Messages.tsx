'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { sendMessage } from '@/app/actions/founder'
import { messages as copy } from '@/content/copy'
import { MESSAGE_LINES, MESSAGE_MAX } from '@/lib/limits'

export type ThreadLine = {
  id: string
  mine: boolean
  text: string
  screenshot: string
  about: string
  at: string
}

/**
 * Stuck? Message the team. The thread, oldest first, and one short box under
 * it: 3 lines at most, a screenshot as a Drive link, and the step it's about
 * when they came from one.
 */
export function Messages({
  thread,
  step,
}: {
  thread: ThreadLine[]
  step: { id: string; title: string } | null
}) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [screenshot, setScreenshot] = useState('')
  const [about, setAbout] = useState(step)
  const [status, setStatus] = useState<'idle' | 'sent' | 'failed' | 'badScreenshot'>('idle')
  const [pending, start] = useTransition()
  const lines = text.split('\n').length
  const ready = text.trim().length >= 3 && lines <= MESSAGE_LINES

  function send() {
    start(async () => {
      setStatus('idle')
      const result = await sendMessage({ text, stepId: about?.id ?? '', screenshot })
      if (result.ok) {
        setText('')
        setScreenshot('')
        setAbout(null)
        setStatus('sent')
        router.refresh()
      } else setStatus(result.fields?.screenshot ? 'badScreenshot' : 'failed')
    })
  }

  return (
    <div className="grid gap-10">
      {thread.length ? (
        <ol className="m-0 grid list-none gap-4 p-0">
          {thread.map((line) => (
            <li
              key={line.id}
              className={`grid max-w-[560px] gap-2 rounded-2xl p-4 ${line.mine ? 'justify-self-end bg-white/[0.05]' : 'shadow-[inset_0_0_0_1px_rgb(124_77_204/0.45)]'}`}
              style={
                line.mine
                  ? undefined
                  : { background: 'color-mix(in oklab, var(--color-violet) 7%, transparent)' }
              }
            >
              <span className="text-ink-3 font-mono text-[12px]">
                {line.mine ? copy.you : copy.team} · {line.at}
              </span>
              {line.about ? <span className="meta">{copy.about(line.about)}</span> : null}
              <p className="m-0 text-[16px] leading-relaxed whitespace-pre-line">{line.text}</p>
              {line.screenshot ? (
                <a
                  href={line.screenshot}
                  target="_blank"
                  rel="noreferrer"
                  className="text-violet-ink w-fit text-[14px]"
                >
                  {copy.viewScreenshot}
                </a>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-ink-2 m-0">{copy.empty}</p>
      )}

      <form
        className="panel grid gap-4 p-5"
        onSubmit={(event) => {
          event.preventDefault()
          if (ready) send()
        }}
      >
        {about ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag">{copy.about(about.title)}</span>
            <button
              type="button"
              className="btn btn-quiet press min-h-8 px-2 text-[13px]"
              onClick={() => setAbout(null)}
            >
              {copy.removeStep}
            </button>
          </div>
        ) : null}
        <label htmlFor="message" className="text-ink-1 text-[16px] font-medium">
          {copy.label}
        </label>
        <span className="text-ink-3 -mt-2 text-[13px]">{copy.hint}</span>
        <textarea
          id="message"
          className="field min-h-[104px]"
          value={text}
          rows={3}
          maxLength={MESSAGE_MAX}
          placeholder={copy.placeholder}
          aria-describedby="message-count"
          onChange={(event) => {
            setStatus('idle')
            setText(event.target.value)
          }}
        />
        <div
          id="message-count"
          className="flex justify-between gap-3 text-[13px]"
          aria-live="polite"
        >
          <span className="text-violet-ink">{lines > MESSAGE_LINES ? copy.tooManyLines : ''}</span>
          <span className="meta">{copy.count(String(text.length), String(MESSAGE_MAX))}</span>
        </div>
        <label htmlFor="screenshot" className="text-ink-1 text-[15px] font-medium">
          {copy.screenshot}
        </label>
        <span className="text-ink-3 -mt-2 text-[13px]">{copy.screenshotHint}</span>
        <input
          id="screenshot"
          className="field"
          inputMode="url"
          value={screenshot}
          maxLength={600}
          placeholder={copy.screenshotPlaceholder}
          onChange={(event) => {
            setStatus('idle')
            setScreenshot(event.target.value)
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="btn btn-primary press min-h-[52px]"
            disabled={pending || !ready}
          >
            {pending ? copy.sending : copy.send}
          </button>
          {status === 'sent' ? (
            <p role="status" className="text-ink-2 m-0 text-[14px]">
              {copy.sent}
            </p>
          ) : status === 'failed' || status === 'badScreenshot' ? (
            <p role="alert" className="text-violet-ink m-0 text-[14px]">
              {status === 'badScreenshot' ? copy.badScreenshot : copy.failed}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  )
}
