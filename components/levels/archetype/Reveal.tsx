'use client'

import Image from 'next/image'
import { useState, type ReactNode } from 'react'
import { archetypeFlow as copy, archetypes, families } from '@/content/copy'
import { ARCHETYPES, FAMILIES, type ArchetypeId } from '@/lib/archetype'
import { Relic } from '@/components/relic/Relic'

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
  const [run, setRun] = useState(0)
  const kind = ARCHETYPES[archetype]
  const family = FAMILIES[kind.family]
  const words = archetypes[archetype]
  return (
    <section
      key={run}
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
            width={720}
            height={960}
            priority
          />
        </div>
        <div className="rv-who">
          <div className="rv-relic">
            <Relic id={archetype} tint={family.tint} />
          </div>
          <p className="meta m-0">
            {families[kind.family].name} · {families[kind.family].line}
          </p>
          <h1 id="rv-name" className="display m-0 text-[clamp(56px,8vw,112px)] leading-[0.92]">
            {copy.reveal.youAre} <em>{words.name}</em>.
          </h1>
          <p className="display m-0 max-w-[24ch] text-[clamp(22px,2.4vw,28px)] leading-[1.25]">{words.identity}</p>
          {fromH1 ? (
            <p className="m-0 text-[15px] text-ink-2">{copy.reveal.h1(families[kind.family].name, words.name)}</p>
          ) : null}
          <dl className="m-0 mt-2 grid gap-4 border-t border-line-2 pt-5 sm:grid-cols-3">
            <div>
              <dt className="rv-dt">{copy.reveal.strengths}</dt>
              <dd className="m-0 text-[14px] leading-relaxed text-ink-2">{words.strengths.join('. ')}.</dd>
            </div>
            <div>
              <dt className="rv-dt">{copy.reveal.blindSpot}</dt>
              <dd className="m-0 text-[14px] leading-relaxed text-ink-2">{words.blindSpot}</dd>
            </div>
            <div>
              <dt className="rv-dt">{copy.reveal.loves}</dt>
              <dd className="m-0 text-[14px] leading-relaxed text-ink-2">{words.loves}</dd>
            </div>
          </dl>
        </div>
      </div>
      {children ? <div className="rv-after">{children}</div> : null}
      <button type="button" className="rv-replay btn btn-quiet press" onClick={() => setRun((value) => value + 1)}>
        {copy.reveal.replay}
      </button>
    </section>
  )
}
