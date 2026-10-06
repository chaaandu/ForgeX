'use client'

import { crashed as copy } from '@/content/copy'

/** When a page fails to render: what happened, that nothing is lost, and one way forward. */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center px-5 pb-24">
      <div className="grid max-w-[480px] gap-6" role="alert">
        <h1 className="display m-0 text-[clamp(40px,6vw,64px)] leading-none">{copy.title}</h1>
        <p className="m-0 text-lead text-ink-2">{copy.lead}</p>
        <div>
          <button type="button" className="btn btn-primary press" onClick={reset}>
            {copy.retry}
          </button>
        </div>
      </div>
    </main>
  )
}
