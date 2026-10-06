import Image from 'next/image'
import { archetypes, card, families, landing, problem as problemCopy } from '@/content/copy'
import { ARCHETYPES, FAMILIES } from '@/lib/archetype'
import { RARITY_LABEL } from '@/lib/problem'
import { labelOf } from '@/lib/taxonomy'
import { Relic } from '@/components/relic/Relic'
import { faces, family, founder, sampleChips, sampleProblem } from '../_shared/data'
import { Replay } from '../_shared/Replay'
import { TiltCard } from '../_shared/TiltCard'
import { Wall } from '../_shared/Wall'
import './c.css'

export default function LabC() {
  const kind = archetypes[founder.archetype]
  const fam = FAMILIES[family]
  return (
    <main className="c">
      {/* ------------------------------------------------------------ hero */}
      <section className="c-hero">
        <Wall faces={faces} className="c-wall" faceClassName="c-face" tagClassName="c-tag" />
        <div className="c-heat" aria-hidden="true" />
        <div className="c-hero-copy">
          <p className="c-kicker">ForgeX 2.0 · Mesa School of Business</p>
          <h1 className="c-display">
            Find a problem worth <span className="c-molten">three weeks</span> of your life.
          </h1>
          <div className="c-hero-row">
            <a className="c-btn" href="#problem">
              {landing.enter}
            </a>
            <p className="c-live">
              <span aria-hidden="true" />
              {landing.open(214)}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- problem */}
      <section id="problem" className="c-section">
        <p className="c-label">Problem card · match and opened</p>
        <div className="c-problems">
          <article className="c-plate" data-r={sampleProblem.rarity}>
            <div className="c-band">
              <span>{RARITY_LABEL[sampleProblem.rarity]}</span>
            </div>
            <h2 className="c-title">{sampleProblem.title}</h2>
            <p className="c-body c-clamp">{sampleProblem.problem}</p>
            <p className="c-challenge">
              <span>Challenge</span>
              {sampleProblem.challenge}
            </p>
            <ul className="c-chips">
              {sampleChips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </article>

          <article className="c-plate c-sheet" data-r={sampleProblem.rarity}>
            <div className="c-band">
              <span>{RARITY_LABEL[sampleProblem.rarity]}</span>
              <span className="c-gauge" aria-label={`Signal ${sampleProblem.signal.strength} of 5`}>
                {[1, 2, 3, 4, 5].map((bar) => (
                  <i key={bar} data-on={bar <= sampleProblem.signal.strength || undefined} />
                ))}
              </span>
            </div>
            <h2 className="c-title c-title-lg">{sampleProblem.title}</h2>
            <p className="c-body">{sampleProblem.problem}</p>
            <p className="c-challenge">
              <span>Challenge</span>
              {sampleProblem.challenge}
            </p>
            <dl className="c-facts">
              <div>
                <dt>{problemCopy.learn}</dt>
                <dd>{sampleProblem.learn.map(labelOf.learn).join(', ')}</dd>
              </div>
              <div>
                <dt>Signal</dt>
                <dd>{sampleProblem.signal.line}</dd>
              </div>
            </dl>
            <button type="button" className="c-btn c-btn-block">
              {problemCopy.build}
            </button>
          </article>
        </div>
      </section>

      {/* -------------------------------------------------------- reveal */}
      <section
        className="c-reveal"
        style={{ ['--tint' as string]: fam.tint, ['--ground' as string]: fam.ground }}
        aria-label="Archetype reveal"
      >
        <Replay className="c-replay">
          <div className="c-forge">
            <div className="c-whitehot" aria-hidden="true" />
            <div className="c-sparks" aria-hidden="true">
              {Array.from({ length: 14 }, (_, index) => (
                <i key={index} style={{ ['--s' as string]: index }} />
              ))}
            </div>
            <div className="c-strike">
              <Image className="c-portrait" src={fam.art} alt={`${families[family].name} portrait`} width={720} height={960} />
            </div>
            <div className="c-who">
              <div className="c-relic">
                <Relic id={founder.archetype} tint={fam.tint} />
              </div>
              <p className="c-kicker">
                {families[family].name} · {families[family].line}
              </p>
              <h2 className="c-name">{kind.name}</h2>
              <p className="c-identity">{kind.identity}</p>
              <dl className="c-traits">
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
      <section className="c-section">
        <p className="c-label">Founder card · Epic and Mythic</p>
        <div className="c-cards">
          {(['epic', 'mythic'] as const).map((rarity) => (
            <TiltCard key={rarity} className="c-card" max={12}>
              <div className="c-card-in" data-r={rarity}>
                <div className="c-card-edge" aria-hidden="true" />
                <div className="c-card-face">
                  <div className="c-card-top">
                    <span>{card.number(founder.number, founder.of)}</span>
                    <span className="c-card-rarity">{RARITY_LABEL[rarity]}</span>
                  </div>
                  <div className="c-card-window">
                    <Image src={founder.photo} alt={founder.name} width={480} height={480} />
                  </div>
                  <p className="c-card-name">{founder.name}</p>
                  <p className="c-card-kind">
                    {families[family].name} · {kind.name}
                  </p>
                  <p className="c-card-line">{kind.identity}</p>
                  <Image className="c-card-relic" src={ARCHETYPES[founder.archetype].relic} alt="" width={96} height={96} />
                </div>
                <div className="c-card-glare" aria-hidden="true" />
              </div>
            </TiltCard>
          ))}
        </div>
      </section>
    </main>
  )
}
