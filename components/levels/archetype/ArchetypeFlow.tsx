'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { keepArchetype } from '@/app/actions/founder'
import { CardActions } from '@/components/card/CardActions'
import { FounderCard, type FounderCardData } from '@/components/card/FounderCard'
import { archetypeFlow as copy } from '@/content/copy'
import type { ArchetypeId } from '@/lib/archetype'
import { Quiz } from './Quiz'
import { Reveal } from './Reveal'

export function ArchetypeFlow({
  archetype,
  fromH1,
  needsConfirm,
  canRetake,
  retaking,
  card,
  slug,
}: {
  archetype: ArchetypeId | null
  fromH1: boolean
  needsConfirm: boolean
  canRetake: boolean
  retaking: boolean
  card: FounderCardData
  slug: string
}) {
  const router = useRouter()
  const [placed, setPlaced] = useState<ArchetypeId | null>(retaking ? null : archetype)
  const [fresh, setFresh] = useState(false)
  const [pending, start] = useTransition()

  if (!placed) {
    return (
      <Quiz
        retake={retaking}
        onPlaced={(next) => {
          setPlaced(next)
          setFresh(true)
          router.replace('/archetype', { scroll: false })
          router.refresh()
        }}
      />
    )
  }

  const confirm = needsConfirm && !fresh
  return (
    <Reveal archetype={placed} fromH1={fromH1 && !fresh}>
      <div className="grid gap-8 sm:grid-cols-[minmax(0,240px)_1fr] sm:items-end">
        <FounderCard data={{ ...card, archetype: placed }} size="md" tilt />
        <div className="grid gap-5">
          <div className="grid gap-2">
            <h2 className="display m-0 text-[clamp(28px,3vw,36px)] leading-tight">{copy.reveal.cardTitle}</h2>
            <p className="m-0 max-w-[40ch] text-[15px] text-ink-2">{copy.reveal.cardLead}</p>
          </div>
          <CardActions slug={slug} name={card.name} />
          <div className="flex flex-wrap items-center gap-3">
            {confirm ? (
              <button
                type="button"
                className="btn btn-primary press min-h-[52px] px-8 text-[16px]"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const result = await keepArchetype()
                    if (result.ok) router.push('/profile')
                  })
                }
              >
                {copy.reveal.keep}
              </button>
            ) : (
              <Link href="/profile" className="btn btn-primary press min-h-[52px] px-8 text-[16px]">
                {copy.reveal.next}
              </Link>
            )}
            {canRetake && !fresh ? (
              <Link href="/archetype?retake=1" className="btn btn-quiet press">
                {copy.reveal.retake}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  )
}
