'use client'

import { copy } from '@/lib/copy'
import type { Problem } from '@/lib/types'
import { TagPill } from './TagPill'

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="label">{label}</h3>
      {children}
    </section>
  )
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-secondary text-[15px] leading-[1.6]">{children}</p>
}

/** The full problem, server rendered and handed to the dialog shell as children. */
export function ProblemDetail({ problem }: { problem: Problem }) {
  const s = copy.modal.sections
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3 [[data-stamped='true']_&]:pr-24 sm:[[data-stamped='true']_&]:pr-28">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <TagPill tag={problem.tag} />
          <span className="text-muted text-[13px]">
            {problem.cluster}
            <span className="text-muted/50 px-1.5">·</span>
            {problem.region}
            <span className="text-muted/50 px-1.5">·</span>
            <span className="font-mono text-[11px] tracking-[0.1em]">{problem.id}</span>
          </span>
        </div>
        <h2
          id="problem-title"
          className="text-primary text-[22px] leading-tight font-semibold tracking-[-0.02em]"
        >
          {problem.title}
        </h2>
      </div>

      <Section label={s.problem}>
        <Body>{problem.problem}</Body>
      </Section>

      <Section label={s.who}>
        <Body>{problem.who}</Body>
      </Section>

      <Section label={s.why}>
        <Body>{problem.whyItMatters}</Body>
      </Section>

      <Section label={s.challenge}>
        <Body>{problem.challenge}</Body>
      </Section>

      <Section label={s.northStar}>
        <p className="border-line text-primary rounded-xl border bg-white/[0.03] px-4 py-3 text-[15px]">
          {problem.northStar}
        </p>
      </Section>

      <Section label={s.directions}>
        <ul className="flex list-none flex-col gap-2">
          {problem.directions.map((direction, index) => (
            <li key={`${index}-${direction}`} className="text-secondary flex gap-3 text-[15px]">
              <span aria-hidden className="bg-muted mt-[0.6em] h-1 w-1 shrink-0 rounded-full" />
              <span>{direction}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section label={s.constraints}>
        <Body>{problem.constraints}</Body>
      </Section>

      <Section label={s.build}>
        <Body>{problem.buildExpectation}</Body>
      </Section>

      <Section label={s.tools}>
        <dl className="flex flex-col gap-2">
          {problem.tools.map((row, index) => (
            <div key={`${index}-${row.kit}`} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="text-muted shrink-0 font-mono text-[12px] sm:w-28">{row.kit}</dt>
              <dd className="text-secondary text-[14px]">{row.tools}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  )
}
