'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { finishProfile, saveProfile } from '@/app/actions/founder'
import { ChipList } from '@/components/ui/ChipList'
import { Lines } from '@/components/ui/Lines'
import { InlineField, type SaveResult } from '@/components/ui/InlineField'
import { profile as copy } from '@/content/copy'
import { linkLabel, LINK_FIELDS, type LinkField } from '@/lib/links'
import type { Profile as ProfileData, ProfilePatch } from '@/lib/profile'

/**
 * Level 3, and the founder's page after it. By default it shows the profile
 * the way anyone on the team will see it; Edit turns the same page into fields
 * that save one at a time. Only the bio is required.
 */
export function Profile({
  name,
  photo,
  initial,
  next,
}: {
  name: string
  photo: string
  initial: ProfileData
  next: string | null
}) {
  const router = useRouter()
  const [data, setData] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [bioError, setBioError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const bioButton = useRef<HTMLButtonElement>(null)
  const onboarding = next !== null

  async function save(patch: ProfilePatch): Promise<SaveResult> {
    const result = await saveProfile(patch)
    if (!result.ok) {
      const field = Object.keys(result.fields ?? {})[0]
      return {
        ok: false,
        message:
          field && LINK_FIELDS.includes(field as LinkField) ? copy.links.invalid : copy.failed,
      }
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

  function finish() {
    start(async () => {
      const result = await finishProfile()
      if (result.ok && next) router.push(next)
      else {
        setEditing(true)
        setBioError(copy.bio.required)
        window.setTimeout(() => bioButton.current?.focus(), 50)
      }
    })
  }

  const actions = (
    <div
      className={
        onboarding
          ? 'dock md:border-line md:border-t md:pt-8'
          : 'border-line flex flex-wrap items-center gap-3 border-t pt-8'
      }
    >
      {onboarding ? (
        <button
          type="button"
          className="btn btn-primary press min-h-[52px] text-[16px] md:min-w-[240px]"
          disabled={pending}
          onClick={finish}
        >
          {copy.done}
        </button>
      ) : null}
      <button
        type="button"
        className="btn btn-secondary press"
        onClick={() => setEditing((value) => !value)}
        aria-pressed={editing}
      >
        {editing ? copy.finishEditing : onboarding ? copy.edit : copy.editProfile}
      </button>
    </div>
  )

  return (
    <div className="grid gap-10">
      {onboarding ? (
        <h1 className="display rise m-0 max-w-[22ch] text-[clamp(34px,5vw,60px)] leading-[1.02]">
          <Lines text={copy.heading} />
        </h1>
      ) : null}

      <section
        className={`grid gap-6 ${onboarding ? 'grid-cols-[72px_1fr] items-center md:grid-cols-[120px_1fr]' : ''}`}
      >
        {onboarding ? (
          <div className="relative size-[72px] overflow-hidden rounded-2xl shadow-[0_0_0_1px_var(--color-line-2)] md:size-[120px]">
            <Image src={photo} alt={name} fill sizes="120px" className="object-cover" />
          </div>
        ) : null}
        <div className="grid min-w-0 gap-2">
          {onboarding ? (
            <p className="display m-0 text-[clamp(30px,4vw,48px)] leading-none">{name}</p>
          ) : null}
          {editing ? null : data.bio ? (
            <p className="display text-ink-1 m-0 text-[clamp(20px,2.4vw,28px)] leading-snug italic">
              {data.bio}
            </p>
          ) : (
            <button
              type="button"
              className="press text-pink-ink m-0 w-fit border-0 bg-transparent p-0 text-left text-[16px] underline decoration-1 underline-offset-4"
              onClick={() => setEditing(true)}
            >
              {copy.bio.add}
            </button>
          )}
        </div>
      </section>

      {editing ? (
        <InlineField
          label={copy.bio.label}
          value={data.bio}
          placeholder={copy.bio.placeholder}
          multiline
          maxLength={120}
          className="display -mt-4 text-[clamp(20px,2.4vw,28px)] leading-snug italic"
          inputRef={bioButton}
          error={bioError}
          onSave={async (bio) => {
            setBioError(null)
            return save({ bio })
          }}
        />
      ) : null}

      <dl className="border-line m-0 grid gap-x-10 gap-y-6 border-t pt-8 sm:grid-cols-3">
        <div className="grid content-start gap-2">
          <dt className="meta">{copy.facts.city.label}</dt>
          <dd className="m-0 text-[18px]">
            {editing ? (
              <InlineField
                label={copy.facts.city.label}
                value={data.city}
                placeholder={copy.facts.city.placeholder}
                maxLength={60}
                onSave={(city) => save({ city })}
              />
            ) : (
              <Value text={data.city} />
            )}
          </dd>
        </div>
        <div className="grid content-start gap-2">
          <dt className="meta">{copy.facts.degree.label}</dt>
          <dd className="m-0 text-[18px]">
            {editing ? (
              <InlineField
                label={copy.facts.degree.label}
                value={data.degree}
                placeholder={copy.facts.degree.placeholder}
                maxLength={80}
                onSave={(degree) => save({ degree })}
              />
            ) : (
              <Value text={data.degree} />
            )}
          </dd>
        </div>
        <div className="grid content-start gap-2">
          <dt className="meta">{copy.facts.languages.label}</dt>
          <dd className="m-0 text-[18px]">
            {editing ? (
              <ChipList
                label={copy.facts.languages.label}
                items={data.languages}
                placeholder={copy.facts.languages.placeholder}
                onChange={(items) => saveList('languages', items)}
              />
            ) : (
              <Value text={data.languages.join(', ')} />
            )}
          </dd>
        </div>
      </dl>

      <section className="border-line grid gap-10 border-t pt-8 md:grid-cols-2">
        {(['goodAt', 'wantToLearn'] as const).map((key) => (
          <div key={key} className="grid content-start gap-3">
            <h2 className="meta m-0">{copy[key].label}</h2>
            {editing ? (
              <ChipList
                label={copy[key].label}
                items={data[key]}
                suggestions={copy[key].suggestions}
                placeholder={copy[key].placeholder}
                onChange={(items) => saveList(key, items)}
              />
            ) : data[key].length ? (
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {data[key].map((item) => (
                  <li key={item} className="tag text-[14px]">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <Value text="" />
            )}
          </div>
        ))}
      </section>

      <section className="border-line grid gap-4 border-t pt-8">
        <h2 className="meta m-0">{copy.links.label}</h2>
        <dl className="m-0 grid gap-5 sm:grid-cols-3">
          {LINK_FIELDS.map((field) => (
            <div key={field} className="grid content-start gap-1.5">
              <dt className="text-ink-3 text-[13px]">{copy.links[field]}</dt>
              <dd className="m-0 min-w-0 text-[16px]">
                {editing ? (
                  <InlineField
                    label={copy.links[field]}
                    value={data[field]}
                    placeholder={copy.links.placeholder[field]}
                    maxLength={200}
                    display={(url) => linkLabel(field, url)}
                    onSave={(value) => save({ [field]: value })}
                  />
                ) : data[field] ? (
                  <a
                    href={data[field]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-1 decoration-line-2 hover:decoration-pink break-words underline underline-offset-4"
                  >
                    {linkLabel(field, data[field])}
                  </a>
                ) : (
                  <Value text="" />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {actions}
    </div>
  )
}

function Value({ text }: { text: string }) {
  return text ? <span>{text}</span> : <span className="text-ink-3">{copy.empty}</span>
}
