import Image from 'next/image'
import { archetypes, card, families, landing, problem as problemCopy } from '@/content/copy'
import { ARCHETYPES, FAMILIES } from '@/lib/archetype'
import { RARITY_LABEL } from '@/lib/problem'
import { labelOf } from '@/lib/taxonomy'
import { faces, family, founder, sampleChips, sampleProblem } from '../_shared/data'
import { Replay } from '../_shared/Replay'
import { TiltCard } from '../_shared/TiltCard'
import { Wall } from '../_shared/Wall'
import './b.css'

/** Riso inks, one per family, for printing the portrait. */
const FAMILY_INK = { cartographer: '#00838A', alchemist: '#E8890C', architect: '#0078BF' } as const

export default function LabB() {
  const kind = archetypes[founder.archetype]
  const fam = FAMILIES[family]
  const relic = ARCHETYPES[founder.archetype].relic
  return (
    <main className="b">
      {/* ------------------------------------------------------------ hero */}
      <section className="b-hero">
        <header className="b-mast">
          <span>ForgeX 2.0</span>
          <span>Mesa School of Business</span>
          <span>Issue 02</span>
        </header>
        <h1 className="b-display">
          Find a problem worth <span className="b-over">three weeks</span> of your life.
        </h1>
        <div className="b-hero-row">
          <a className="b-btn" href="#problem">
            {landing.enter}
          </a>
          <p className="b-stamp" aria-live="polite">
            {landing.open(214)}
          </p>
        </div>
        <Wall faces={faces} className="b-wall" faceClassName="b-face" tagClassName="b-tag" />
      </section>

      {/* ------------------------------------------------------- problem */}
      <section id="problem" className="b-section">
        <p className="b-label">Problem card / match and opened</p>
        <div className="b-problems">
          <article className="b-problem" data-r={sampleProblem.rarity}>
            <span className="b-rarity">{RARITY_LABEL[sampleProblem.rarity]}</span>
            <h2 className="b-title">{sampleProblem.title}</h2>
            <p className="b-body b-clamp">{sampleProblem.problem}</p>
            <p className="b-challenge">{sampleProblem.challenge}</p>
            <ul className="b-chips">
              {sampleChips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </article>

          <article className="b-problem b-sheet" data-r={sampleProblem.rarity}>
            <span className="b-rarity">{RARITY_LABEL[sampleProblem.rarity]}</span>
            <h2 className="b-title b-title-lg">{sampleProblem.title}</h2>
            <p className="b-body">{sampleProblem.problem}</p>
            <p className="b-challenge">{sampleProblem.challenge}</p>
            <dl className="b-facts">
              <div>
                <dt>{problemCopy.learn}</dt>
                <dd>{sampleProblem.learn.map(labelOf.learn).join(', ')}</dd>
              </div>
              <div>
                <dt>Signal</dt>
                <dd>
                  <span className="b-meter" aria-label={`${sampleProblem.signal.strength} of 5`}>
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <i key={dot} data-on={dot <= sampleProblem.signal.strength || undefined} />
                    ))}
                  </span>
                  {sampleProblem.signal.line}
                </dd>
              </div>
            </dl>
            <button type="button" className="b-btn b-btn-block">
              {problemCopy.build}
            </button>
          </article>
        </div>
      </section>

      {/* -------------------------------------------------------- reveal */}
      <section className="b-reveal" style={{ ['--fam' as string]: FAMILY_INK[family] }} aria-label="Archetype reveal">
        <Replay className="b-replay">
          <div className="b-poster">
            <i className="b-reg b-reg-tl" aria-hidden="true" />
            <i className="b-reg b-reg-tr" aria-hidden="true" />
            <i className="b-reg b-reg-bl" aria-hidden="true" />
            <i className="b-reg b-reg-br" aria-hidden="true" />
            <p className="b-poster-family" aria-hidden="true">
              <span>{families[family].name}</span>
              <span>{families[family].name}</span>
            </p>
            <div
              className="b-portrait"
              style={{ WebkitMaskImage: `url(${fam.art})`, maskImage: `url(${fam.art})` }}
            >
              <Image src={fam.art} alt={`${families[family].name} portrait`} width={720} height={960} />
            </div>
            <div className="b-poster-copy">
              <Image className="b-relic" src={relic} alt="" width={160} height={160} />
              <p className="b-label">
                {families[family].name} / {families[family].line}
              </p>
              <h2 className="b-name">
                <span>{kind.name}</span>
                <span aria-hidden="true">{kind.name}</span>
              </h2>
              <p className="b-identity">{kind.identity}</p>
              <dl className="b-traits">
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
      <section className="b-section">
        <p className="b-label">Founder card / Epic and Mythic</p>
        <div className="b-cards">
          {(['epic', 'mythic'] as const).map((rarity) => (
            <TiltCard key={rarity} className="b-card" max={10}>
              <div className="b-card-in" data-r={rarity}>
                <div className="b-card-top">
                  <span>{card.number(founder.number, founder.of)}</span>
                  <span>{RARITY_LABEL[rarity]}</span>
                </div>
                <div className="b-card-photo">
                  <Image src={founder.photo} alt={founder.name} width={480} height={480} />
                </div>
                <p className="b-card-name">{founder.name}</p>
                <p className="b-card-kind">
                  {families[family].name} / {kind.name}
                </p>
                <p className="b-card-line">{kind.identity}</p>
                <Image className="b-card-relic" src={relic} alt="" width={96} height={96} />
                <div className="b-card-foil" aria-hidden="true" />
              </div>
            </TiltCard>
          ))}
        </div>
      </section>
    </main>
  )
}
