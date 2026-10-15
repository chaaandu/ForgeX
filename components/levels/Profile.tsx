'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { finishProfile, saveProfile } from '@/app/actions/founder'
import { InlineField, type SaveResult } from '@/components/ui/InlineField'
import { profile as copy } from '@/content/copy'
import { linkLabel, LINK_FIELDS, type LinkField } from '@/lib/links'
import type { Profile as ProfileData, ProfilePatch } from '@/lib/profile'

/**
 * Level 3, and the founder's page after it: where to find their work. GitHub
 * and LinkedIn are required and edit in place; Edit opens the optional
 * portfolio link too.
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
  const [linkError, setLinkError] = useState<string | null>(null)
  const [openLinks, setOpenLinks] = useState(0)
  const [pending, start] = useTransition()
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

  function finish() {
    start(async () => {
      const result = await finishProfile()
      if (result.ok && next) router.push(next)
      else if (!result.ok) {
        const missing = result.fields ?? {}
        if (missing.github || missing.linkedin) {
          setLinkError(copy.links.needed)
          setOpenLinks((value) => value + 1)
        }
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
        <div className="rise grid gap-3">
          <h1 className="page-title m-0 max-w-[22ch]">{copy.heading}</h1>
          <p className="text-lead text-ink-2 m-0 max-w-[52ch]">{copy.lead}</p>
        </div>
      ) : null}

      {onboarding ? (
        <section className="grid grid-cols-[72px_1fr] items-center gap-6 md:grid-cols-[120px_1fr]">
          <div className="relative size-[72px] overflow-hidden rounded-2xl shadow-[0_0_0_1px_var(--color-line-2)] md:size-[120px]">
            <Image src={photo} alt={name} fill sizes="120px" className="object-cover" />
          </div>
          <p className="display m-0 min-w-0 text-[clamp(30px,4vw,48px)] leading-none">{name}</p>
        </section>
      ) : null}

      <section
        className={`grid gap-4 ${onboarding ? 'border-line border-t pt-8' : ''}`}
        aria-label={copy.links.label}
      >
        <dl className="m-0 grid gap-5 sm:grid-cols-3">
          {LINK_FIELDS.map((field) => {
            const required = field === 'github' || field === 'linkedin'
            // An optional link nobody added is left out, unless they are editing.
            if (!required && !editing && !data[field]) return null
            return (
              <div key={field} className="grid content-start gap-1.5">
                <dt className="text-ink-3 text-[13px]">
                  {copy.links[field]}
                  {required ? <span className="text-ink-2"> {copy.links.required}</span> : null}
                </dt>
                <dd className="m-0 min-w-0 text-[16px]">
                  {/* Required links edit in place: never behind Edit. */}
                  {editing || required ? (
                    <InlineField
                      label={copy.links[field]}
                      value={data[field]}
                      placeholder={copy.links.placeholder[field]}
                      maxLength={200}
                      display={(url) => linkLabel(field, url)}
                      emptyLabel={
                        field === 'github'
                          ? copy.links.addGithub
                          : field === 'linkedin'
                            ? copy.links.addLinkedin
                            : undefined
                      }
                      openKey={required && !data[field] ? openLinks : 0}
                      onSave={(value) => {
                        setLinkError(null)
                        return save({ [field]: value })
                      }}
                    />
                  ) : data[field] ? (
                    <a
                      href={data[field]}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ink-1 decoration-line-2 hover:decoration-violet break-words underline underline-offset-4"
                    >
                      {linkLabel(field, data[field])}
                    </a>
                  ) : (
                    <Value text="" />
                  )}
                </dd>
              </div>
            )
          })}
        </dl>
        {linkError ? (
          <p role="alert" className="text-error m-0 text-[14px]">
            {linkError}
          </p>
        ) : null}
      </section>

      {actions}
    </div>
  )
}

function Value({ text }: { text: string }) {
  return text ? <span>{text}</span> : <span className="text-ink-3">{copy.empty}</span>
}
