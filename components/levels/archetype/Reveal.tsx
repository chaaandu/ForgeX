import Image from 'next/image'
import type { ReactNode } from 'react'
import { archetypeFlow as copy, archetypes, families } from '@/content/copy'
import { ARCHETYPES, FAMILIES, type ArchetypeId } from '@/lib/archetype'

/**
 * The one moment allowed to be loud. Everything is timed off a single IMPACT:
 * the portrait lands, the light flashes from under it, and only then does the
 * name arrive, so the screen reads as one event and its consequences rather
 * than six things fading in near each other. Anything added here hangs off
 * IMPACT too.
 */
export function Reveal({
  archetype,
  fromH1,
  children,
}: {
  archetype: ArchetypeId
  fromH1: boolean
  children?: ReactNode
}) {
  const kind = ARCHETYPES[archetype]
  const family = FAMILIES[kind.family]
  const words = archetypes[archetype]
  const traits: [string, string][] = [
    [copy.reveal.strengths, `${words.strengths.join('. ')}.`],
    [copy.reveal.blindSpot, words.blindSpot],
    [copy.reveal.loves, words.loves],
  ]
  return (
    <section
      className="rv"
      style={{ ['--tint' as string]: family.tint, ['--ground' as string]: family.ground } as React.CSSProperties}
      aria-labelledby="rv-name"
    >
      <div className="rv-world" aria-hidden="true" />
      <div className="rv-stage">
        <div className="rv-figure">
          <p className="rv-family" aria-hidden="true">
            {families[kind.family].name}
          </p>
          <div className="rv-slot" aria-hidden="true" />
          <div className="rv-flash" aria-hidden="true" />
          <Image
            className="rv-portrait"
            src={family.art}
            alt={`${families[kind.family].name} portrait`}
            width={768}
            height={768}
            sizes="(max-width: 960px) 64vw, 40vw"
            priority
          />
        </div>
        <div className="rv-who">
          <p className="rv-chip">
            <span aria-hidden="true" />
            {families[kind.family].name}
            <em>{families[kind.family].line}</em>
          </p>
          <h1 id="rv-name" className="display m-0 text-[clamp(52px,8vw,112px)] leading-[0.92]">
            {copy.reveal.youAre} <em>{words.name}</em>.
          </h1>
          <p className="display m-0 max-w-[24ch] text-[clamp(22px,2.4vw,30px)] leading-[1.2]">{words.identity}</p>
          {fromH1 ? <p className="m-0 text-[14px] text-ink-3">{copy.reveal.h1(families[kind.family].name, words.name)}</p> : null}
          <dl className="rv-traits">
            {traits.map(([label, text]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {children ? <div className="rv-after">{children}</div> : null}
    </section>
  )
}
