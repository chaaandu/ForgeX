import Image from 'next/image'
import { archetypes, card as copy, families } from '@/content/copy'
import { ARCHETYPES, FAMILIES, type ArchetypeId } from '@/lib/archetype'
import type { Rarity } from '@/lib/taxonomy'
import { RARITY_LABEL } from '@/lib/problem'
import { Tilt } from './Tilt'
import './card.css'

/**
 * The founder card. It is also the progress bar: every level adds a layer, and
 * the slots not yet filled are drawn as empty, so a founder can always see what
 * is left to earn. Photo and number on arrival, archetype and relic after the
 * quiz, the bio after the profile, the edge marks after their world, the
 * problem after they pick, the rarity finish when they send their why, and the
 * team's stamp when we answer.
 *
 * Everything inside is sized in container units, so one component serves the
 * corner companion, the reveal and the profile without three layouts.
 */

export type CardFinish = Rarity | 'original'
export type CardStamp = 'go' | 'tweak' | 'talk'

export type FounderCardData = {
  name: string
  photo: string
  number: number | null
  of: number
  archetype: ArchetypeId | null
  bio?: string
  marks?: string[]
  problemTitle?: string
  finish?: CardFinish | null
  stamp?: CardStamp | null
}

const STAMP_TEXT: Record<CardStamp, string> = { go: 'Go', tweak: 'Go, tweak', talk: "Let's talk" }

export function FounderCard({
  data,
  size = 'md',
  tilt = false,
  priority = false,
  className,
}: {
  data: FounderCardData
  size?: 'sm' | 'md' | 'lg'
  tilt?: boolean
  priority?: boolean
  className?: string
}) {
  const kind = data.archetype ? ARCHETYPES[data.archetype] : null
  const family = kind ? FAMILIES[kind.family] : null
  const finish = data.finish ?? null
  const body = (
    <div
      className="fc"
      data-size={size}
      data-finish={finish ?? 'none'}
      style={family ? ({ ['--fam' as string]: family.tint } as React.CSSProperties) : undefined}
    >
      <div className="fc-foil" aria-hidden="true" />
      <div className="fc-face">
        <div className="fc-top">
          <span>{data.number ? copy.number(data.number, data.of) : copy.unnumbered}</span>
          {finish ? <span className="fc-finish">{finish === 'original' ? copy.original : RARITY_LABEL[finish]}</span> : null}
        </div>
        <div className="fc-photo">
          <Image src={data.photo} alt={data.name} fill sizes={size === 'sm' ? '140px' : '360px'} priority={priority} />
        </div>
        <div className="fc-relic" data-empty={!kind || undefined} aria-hidden="true">
          {kind ? <Image src={kind.relic} alt="" width={96} height={96} /> : <span>?</span>}
        </div>
        <div className="fc-meta">
          <p className="fc-name">{data.name}</p>
          {kind ? (
            <p className="fc-kind">
              {families[kind.family].name} · {archetypes[kind.id].name}
            </p>
          ) : (
            <p className="fc-kind fc-empty">{copy.noArchetype}</p>
          )}
          {data.problemTitle ? (
            <p className="fc-line fc-building">
              <span>{copy.building}</span> {data.problemTitle}
            </p>
          ) : data.bio ? (
            <p className="fc-line">{data.bio}</p>
          ) : kind ? (
            <p className="fc-line">{archetypes[kind.id].identity}</p>
          ) : null}
        </div>
        {data.marks?.length ? <p className="fc-marks">{data.marks.join(' · ')}</p> : null}
      </div>
      {data.stamp ? (
        <div className="fc-stamp" data-stamp={data.stamp} aria-label={STAMP_TEXT[data.stamp]}>
          {STAMP_TEXT[data.stamp]}
        </div>
      ) : null}
      <div className="fc-glare" aria-hidden="true" />
    </div>
  )
  return (
    <div className={['fc-wrap', className].filter(Boolean).join(' ')} data-size={size}>
      {tilt ? <Tilt>{body}</Tilt> : body}
    </div>
  )
}
