'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { finishProfile, saveProfile, setWall } from '@/app/actions/founder'
import { ChipList } from '@/components/ui/ChipList'
import { InlineField, type SaveResult } from '@/components/ui/InlineField'
import { profile as copy } from '@/content/copy'
import { linkLabel, LINK_FIELDS, type LinkField } from '@/lib/links'
import type { Profile as ProfileData, ProfilePatch } from '@/lib/profile'

/**
 * Level 3, and the founder's page after it. Everything we know is already
 * here; every field edits in place and saves on its own, so the page reads as
 * someone's page rather than a settings screen. Only the bio is required.
 */
export function Profile({
  name,
  photo,
  initial,
  wall: initialWall,
  next,
}: {
  name: string
  photo: string
  initial: ProfileData
  wall: boolean
  next: string | null
}) {
  const router = useRouter()
  const [data, setData] = useState(initial)
  const [wall, setWallState] = useState(initialWall)
  const [bioError, setBioError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const bioButton = useRef<HTMLButtonElement>(null)

  async function save(patch: ProfilePatch): Promise<SaveResult> {
    const result = await saveProfile(patch)
    if (!result.ok) {
      const field = Object.keys(result.fields ?? {})[0]
      return { ok: false, message: field && LINK_FIELDS.includes(field as LinkField) ? copy.links.invalid : copy.failed }
    }
    setData((current) => ({ ...current, ...patch, ...result.links }))
    return { ok: true }
  }

  function saveList(key: 'languages' | 'goodAt' | 'wantToLearn', items: string[]) {
    const before = data[key]
    setData((current) => ({ ...current, [key]: items }))
    void saveProfile({ [key]: items }).then((result) => {
      if (!result.ok) setData((current) => ({ ...current, [key]: before }))
    })
  }

  return (
    <div className="grid gap-12">
      <h1 className="display rise m-0 max-w-[18ch] text-[clamp(36px,5vw,60px)] leading-[1.02]">{copy.heading}</h1>

      <section className="grid gap-6 md:grid-cols-[120px_1fr] md:items-start">
        <div className="relative size-24 overflow-hidden rounded-2xl shadow-[0_0_0_1px_var(--color-line-2)] md:size-[120px]">
          <Image src={photo} alt={name} fill sizes="120px" className="object-cover" />
        </div>
        <div className="grid gap-3">
          <p className="display m-0 text-[clamp(34px,4vw,48px)] leading-none">{name}</p>
          <p className="m-0 text-[13px] text-ink-3">{copy.fromMesa}</p>
          <InlineField
            label={copy.bio.label}
            value={data.bio}
            placeholder={copy.bio.placeholder}
            multiline
            maxLength={120}
            className="display mt-2 text-[clamp(22px,2.6vw,30px)] leading-snug italic"
            inputRef={bioButton}
            error={bioError}
            onSave={async (bio) => {
              setBioError(null)
              return save({ bio })
            }}
          />
        </div>
      </section>

      <dl className="m-0 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
        <div className="grid gap-2">
          <dt className="meta">{copy.facts.city.label}</dt>
          <dd className="m-0 text-[18px]">
            <InlineField label={copy.facts.city.label} value={data.city} placeholder={copy.facts.city.placeholder} maxLength={60} onSave={(city) => save({ city })} />
          </dd>
        </div>
        <div className="grid gap-2">
          <dt className="meta">{copy.facts.degree.label}</dt>
          <dd className="m-0 text-[18px]">
            <InlineField label={copy.facts.degree.label} value={data.degree} placeholder={copy.facts.degree.placeholder} maxLength={80} onSave={(degree) => save({ degree })} />
          </dd>
        </div>
        <div className="grid gap-2">
          <dt className="meta">{copy.facts.languages.label}</dt>
          <dd className="m-0">
            <ChipList label={copy.facts.languages.label} items={data.languages} placeholder={copy.facts.languages.placeholder} onChange={(items) => saveList('languages', items)} />
          </dd>
        </div>
      </dl>

      <section className="grid gap-10 border-t border-line pt-8 md:grid-cols-2">
        <div className="grid content-start gap-3">
          <h2 className="meta m-0">{copy.goodAt.label}</h2>
          <ChipList label={copy.goodAt.label} items={data.goodAt} suggestions={copy.goodAt.suggestions} placeholder={copy.goodAt.placeholder} onChange={(items) => saveList('goodAt', items)} />
        </div>
        <div className="grid content-start gap-3">
          <h2 className="meta m-0">{copy.wantToLearn.label}</h2>
          <ChipList label={copy.wantToLearn.label} items={data.wantToLearn} suggestions={copy.wantToLearn.suggestions} placeholder={copy.wantToLearn.placeholder} onChange={(items) => saveList('wantToLearn', items)} />
        </div>
      </section>

      <section className="grid gap-4 border-t border-line pt-8">
        <h2 className="meta m-0">{copy.links.label}</h2>
        <dl className="m-0 grid gap-4 sm:grid-cols-3">
          {LINK_FIELDS.map((field) => (
            <div key={field} className="grid gap-1.5">
              <dt className="text-[13px] text-ink-3">{copy.links[field]}</dt>
              <dd className="m-0 text-[16px]">
                <InlineField
                  label={copy.links[field]}
                  value={data[field]}
                  placeholder={copy.links.placeholder[field]}
                  maxLength={200}
                  display={(url) => linkLabel(field, url)}
                  onSave={(value) => save({ [field]: value })}
                />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <label className="flex cursor-pointer items-start gap-4 border-t border-line pt-8">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={wall}
          onChange={(event) => {
            const on = event.target.checked
            setWallState(on)
            void setWall(on).then((result) => {
              if (!result.ok) setWallState(!on)
            })
          }}
        />
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-6 w-10 shrink-0 items-center rounded-full bg-s3 p-0.5 transition-colors duration-150 peer-checked:bg-pink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pink [&>span]:transition-transform [&>span]:duration-150 peer-checked:[&>span]:translate-x-4"
        >
          <span className="size-5 rounded-full bg-ink-1" />
        </span>
        <span className="grid gap-1">
          <span className="text-[16px]">{copy.wall.label}</span>
          <span className="text-[14px] text-ink-3">{copy.wall.hint}</span>
        </span>
      </label>

      {next ? (
        <div>
          <button
            type="button"
            className="btn btn-primary press min-h-[52px] px-9 text-[16px]"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const result = await finishProfile()
                if (result.ok) router.push(next)
                else {
                  setBioError(copy.bio.required)
                  bioButton.current?.focus()
                }
              })
            }
          >
            {copy.done}
          </button>
        </div>
      ) : null}
    </div>
  )
}
