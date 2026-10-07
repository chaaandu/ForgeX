import Image from 'next/image'
import { archetypes, card as copy, families } from '@/content/copy'
import { ARCHETYPES, FAMILIES, type ArchetypeId } from '@/lib/archetype'
import { Tilt } from './Tilt'
import './card.css'

/**
 * The founder card. It is also the progress bar: every level adds a layer, and
 * the slots not yet filled are drawn as empty, so a founder can always see what
 * is left to earn. Photo and number on arrival, archetype and portrait after the
 * quiz, and the finish when they send their
 * why. The team's answer lives on their profile, not stamped across their face.
 * The archetype stands in the corner whole, never cropped. The bottom line is always the
 * archetype's own line: never their bio, never their problem.
 *
 * Everything inside is sized in container units, so one component serves the
 * corner companion, the reveal and the profile without three layouts.
 */

/** One finish for any pick: a finish per difficulty would tell a founder how hard theirs is. */
export type CardFinish = 'picked'

export type FounderCardData = {
  name: string
  photo: string
  number: number | null
  of: number
  archetype: ArchetypeId | null
  bio?: string
  problemTitle?: string
  finish?: CardFinish | null
}

export function FounderCard({
  data,
  size = 'md',
  tilt = false,
  priority = false,
  glow = 'hover',
  className,
}: {
  data: FounderCardData
  size?: 'sm' | 'md' | 'lg'
  tilt?: boolean
  priority?: boolean
  /** When a picked card's frame comes alive: always, or only under the pointer. */
  glow?: 'always' | 'hover'
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
      <div className="fc-spark" aria-hidden="true" />
      <div className="fc-face">
        <div className="fc-top">
          <span>{data.number ? copy.number(data.number, data.of) : copy.unnumbered}</span>
        </div>
        <div className="fc-photo">
          <Image
            src={data.photo}
            alt={data.name}
            fill
            sizes={size === 'sm' ? '140px' : '360px'}
            priority={priority}
          />
          <div className="fc-figure" data-empty={!kind || undefined} aria-hidden="true">
            {family ? (
              <Image src={family.art} alt="" width={160} height={160} sizes="130px" />
            ) : (
              <span>?</span>
            )}
          </div>
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
          {kind ? <p className="fc-line">{archetypes[kind.id].identity}</p> : null}
        </div>
      </div>
      <div className="fc-glare" aria-hidden="true" />
    </div>
  )
  return (
    <div
      className={['fc-wrap', className].filter(Boolean).join(' ')}
      data-size={size}
      data-glow={glow}
    >
      <div className="fc-halo" aria-hidden="true" />
      {tilt ? <Tilt>{body}</Tilt> : body}
    </div>
  )
}
