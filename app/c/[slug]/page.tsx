import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FounderCard } from '@/components/card/FounderCard'
import { Brand } from '@/components/shell/Brand'
import { share as copy } from '@/content/copy'
import { founderContext } from '@/lib/context'
import { founderBySlug } from '@/lib/data/founders'
import { shareable, siteUrl } from '@/lib/share'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const shared = await shareable(await founderBySlug(slug))
  if (!shared) return {}
  const image = { url: `${siteUrl()}/api/og/${slug}`, width: 1200, height: 630 }
  return {
    metadataBase: new URL(siteUrl()),
    title: shared.title,
    description: shared.line,
    openGraph: {
      title: shared.title,
      description: shared.line,
      url: `${siteUrl()}/c/${slug}`,
      images: [image],
      type: 'profile',
    },
    twitter: { card: 'summary_large_image', title: shared.title, images: [image.url] },
  }
}

/**
 * A founder's card, in public: what a shared link opens to. The card, their
 * name, and who they are building for. Their full profile stays behind
 * sign-in, as it always has.
 */
export default async function SharedCard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const founder = await founderBySlug(slug)
  const shared = await shareable(founder)
  if (!shared || !founder) notFound()
  const context = await founderContext(founder)
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-[1040px] items-center px-5 pt-5 md:px-10 md:pt-7">
        <Brand />
      </header>
      <main className="mx-auto grid max-w-[1040px] items-center gap-12 px-5 pt-10 pb-24 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16 md:px-10 md:pt-16">
        <div className="w-full max-w-[360px] justify-self-center">
          <FounderCard data={context.card} size="lg" tilt priority glow="always" />
        </div>
        <div className="grid gap-4">
          <h1 className="display m-0 text-[clamp(44px,6vw,80px)] leading-[0.95]">
            {founder.name}
          </h1>
          {shared.archetype ? (
            <p className="display text-violet-ink m-0 text-[clamp(22px,2.6vw,30px)] italic">
              {shared.archetype}
            </p>
          ) : null}
          {shared.forWho ? (
            <p className="text-lead text-ink-2 m-0 max-w-[40ch]">
              {copy.building(shared.forWho)}
            </p>
          ) : null}
          <p className="text-ink-3 m-0 max-w-[44ch] text-[15px]">{copy.about}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={`/f/${slug}`} className="btn btn-primary press">
              {copy.open}
            </Link>
            <Link href="/" className="btn btn-secondary press">
              {copy.home}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
