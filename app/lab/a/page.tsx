import Image from 'next/image'
import { archetypes, card, families, landing, problem as problemCopy } from '@/content/copy'
import { ARCHETYPES, FAMILIES } from '@/lib/archetype'
import { RARITY_LABEL } from '@/lib/problem'
import { labelOf } from '@/lib/taxonomy'
import { Relic } from '@/components/relic/Relic'
import { faces, family, founder, sampleChips, sampleProblem } from '../_shared/data'
import { Pointer } from '../_shared/Pointer'
import { Replay } from '../_shared/Replay'
import { TiltCard } from '../_shared/TiltCard'
import { Wall } from '../_shared/Wall'
import './a.css'

export default function LabA() {
  const kind = archetypes[founder.archetype]
  const fam = FAMILIES[family]
  return (
    <main className="a">
      {/* ------------------------------------------------------------ hero */}
      <Pointer className="a-hero">
        <Wall
          faces={faces}
          className="a-wall"
          faceClassName="a-face"
          tagClassName="a-tag"
        />
        <div className="a-hero-fade" aria-hidden="true" />
        <div className="a-hero-copy">
          <p className="a-kicker">ForgeX 2.0 · Mesa School of Business</p>
          <h1 className="a-display">
            Find a problem worth <em>three weeks</em> of your life.
          </h1>
          <div className="a-hero-row">
            <a className="a-btn" href="#problem">
              {landing.enter}
            </a>
            <p className="a-live">
              <span className="a-dot" aria-hidden="true" />
              {landing.open(214)}
            </p>
          </div>
        </div>
      </Pointer>

      {/* ------------------------------------------------------- problem */}
      <section id="problem" className="a-section">
        <p className="a-label">Problem card · match and opened</p>
        <div className="a-problems">
          <article className="a-problem" data-r={sampleProblem.rarity}>
            <header className="a-problem-head">
              <span className="a-rarity">{RARITY_LABEL[sampleProblem.rarity]}</span>
            </header>
            <h2 className="a-title">{sampleProblem.title}</h2>
            <p className="a-body clamp-3">{sampleProblem.problem}</p>
            <p className="a-challenge">
              <span>Challenge</span>
              {sampleProblem.challenge}
            </p>
            <ul className="a-chips">
              {sampleChips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </article>

          <article className="a-sheet" data-r={sampleProblem.rarity}>
            <header className="a-problem-head">
              <span className="a-rarity">{RARITY_LABEL[sampleProblem.rarity]}</span>
              <span className="a-signal" aria-label={`Signal ${sampleProblem.signal.strength} of 5`}>
                {[1, 2, 3, 4, 5].map((bar) => (
                  <i key={bar} data-on={bar <= sampleProblem.signal.strength || undefined} />
                ))}
              </span>
            </header>
            <h2 className="a-title a-title-lg">{sampleProblem.title}</h2>
            <p className="a-body">{sampleProblem.problem}</p>
            <p className="a-challenge">
              <span>Challenge</span>
              {sampleProblem.challenge}
            </p>
            <dl className="a-facts">
              <div>
                <dt>{problemCopy.learn}</dt>
                <dd>{sampleProblem.learn.map(labelOf.learn).join(', ')}</dd>
              </div>
              <div>
                <dt>Signal</dt>
                <dd>{sampleProblem.signal.line}</dd>
              </div>
            </dl>
            <button type="button" className="a-btn a-btn-block">
              {problemCopy.build}
            </button>
          </article>
        </div>
      </section>

      {/* -------------------------------------------------------- reveal */}
      <section
        className="a-reveal"
        style={{ ['--tint' as string]: fam.tint, ['--ground' as string]: fam.ground }}
        aria-label="Archetype reveal"
      >
        <Replay className="a-replay">
          <div className="a-stage">
            <p className="a-family" aria-hidden="true">
              {families[family].name}
            </p>
            <div className="a-slot" aria-hidden="true" />
            <div className="a-flash" aria-hidden="true" />
            <Image
              className="a-portrait"
              src={fam.art}
              alt={`${families[family].name} portrait`}
              width={720}
              height={960}
              priority={false}
            />
            <div className="a-who">
              <div className="a-relic">
                <Relic id={founder.archetype} tint={fam.tint} />
              </div>
              <p className="a-kicker">
                {families[family].name} · {families[family].line}
              </p>
              <h2 className="a-display a-name">
                You&apos;re a <em>{kind.name}</em>.
              </h2>
              <p className="a-identity">{kind.identity}</p>
              <dl className="a-traits">
                <div>
                  <dt>Strengths</dt>
                  <dd>{kind.strengths.join('. ')}.</dd>
                </div>
                <div>
                  <dt>Blind spot</dt>
                  <dd>{kind.blindSpot}</dd>
                </div>
                <div>
                  <dt>Loves</dt>
                  <dd>{kind.loves}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Replay>
      </section>

      {/* --------------------------------------------------------- cards */}
      <section className="a-section a-cards-wrap">
        <p className="a-label">Founder card · Epic and Mythic</p>
        <div className="a-cards">
          {(['epic', 'mythic'] as const).map((rarity) => (
            <TiltCard key={rarity} className="a-card" max={14}>
              <div className="a-card-in" data-r={rarity}>
                <div className="a-card-photo">
                  <Image src={founder.photo} alt={founder.name} width={480} height={480} />
                </div>
                <div className="a-card-foil" aria-hidden="true" />
                <div className="a-card-glare" aria-hidden="true" />
                <div className="a-card-meta">
                  <div className="a-card-top">
                    <span>{card.number(founder.number, founder.of)}</span>
                    <span className="a-card-rarity">{RARITY_LABEL[rarity]}</span>
                  </div>
                  <p className="a-card-name">{founder.name}</p>
                  <p className="a-card-kind">
                    {families[family].name} · {kind.name}
                  </p>
                  <p className="a-card-line">{kind.identity}</p>
                </div>
                <div className="a-card-relic" aria-hidden="true" style={{ ['--tint' as string]: fam.tint }}>
                  <Image src={ARCHETYPES[founder.archetype].relic} alt="" width={96} height={96} />
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>
    </main>
  )
}
