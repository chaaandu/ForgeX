'use client'

import { useState } from 'react'
import { ComfortSlider } from '@/components/ui/ComfortSlider'
import { OtherField } from '@/components/ui/OtherField'
import { ProblemSheet } from '@/components/problem/ProblemSheet'
import type { Problem } from '@/lib/problem'

export function Controls({ problem }: { problem: Problem }) {
  const [picked, setPicked] = useState<string[]>(['Retail and local shops'])
  const [choice, setChoice] = useState('b')
  const [other, setOther] = useState(false)
  const [otherText, setOtherText] = useState('')
  const [comfort, setComfort] = useState(3)
  const [open, setOpen] = useState(false)
  return (
    <div className="grid content-start gap-8">
      <p className="meta">Controls</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary press" onClick={() => setOpen(true)}>
          I&apos;ll build this
        </button>
        <button type="button" className="btn btn-secondary press">
          Back
        </button>
        <button type="button" className="btn btn-quiet press">
          Skip
        </button>
        <button type="button" className="btn btn-primary press" disabled>
          Disabled
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {['Retail and local shops', 'Health and fitness', 'Creators and media'].map((label) => (
          <button
            key={label}
            type="button"
            className="chip press"
            aria-pressed={picked.includes(label)}
            onClick={() => setPicked((value) => (value.includes(label) ? value.filter((v) => v !== label) : [...value, label]))}
          >
            {label}
          </button>
        ))}
        <OtherField label="Other" on={other} onToggle={() => setOther((v) => !v)} value={otherText} onChange={setOtherText} placeholder="Which one?" />
      </div>
      <div className="grid gap-2" role="radiogroup" aria-label="Sample">
        {[
          ['a', 'Read up before you go'],
          ['b', 'Walk out and see'],
          ['c', 'Plan all three days'],
        ].map(([key, label]) => (
          <button key={key} type="button" role="radio" aria-checked={choice === key} className="choice press" onClick={() => setChoice(key!)}>
            {label}
          </button>
        ))}
      </div>
      <input className="field" placeholder="City" />
      <textarea className="field" placeholder="Why this problem?" />
      <ComfortSlider value={comfort} onChange={setComfort} />
      <div className="grid gap-2">
        <div className="skeleton h-6 w-2/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
      <ProblemSheet
        problem={problem}
        open={open}
        onOpenChange={setOpen}
        action={
          <button type="button" className="btn btn-primary press w-full">
            I&apos;ll build this
          </button>
        }
      />
    </div>
  )
}
