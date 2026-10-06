import Link from 'next/link'
import { Brand } from '@/components/shell/Brand'
import { notFound as copy } from '@/content/copy'

export default function NotFound() {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr]">
      <header className="px-5 pt-5 md:px-10 md:pt-7">
        <Brand />
      </header>
      <main className="grid place-items-center px-5 pb-24">
        <div className="grid max-w-[480px] gap-6">
          <h1 className="display m-0 text-[clamp(40px,6vw,64px)] leading-none">{copy.title}</h1>
          <p className="m-0 text-lead text-ink-2">{copy.lead}</p>
          <div>
            <Link href="/" className="btn btn-primary press">
              {copy.home}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
