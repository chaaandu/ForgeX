import { FieldHead } from '@/components/ui/FieldHead'
import { profile as copy } from '@/content/copy'
import { linkLabel, LINK_FIELDS } from '@/lib/links'
import type { Profile } from '@/lib/profile'

/** The profile, read-only, for anyone who isn't its owner. */
export function ProfileFacts({ profile }: { profile: Profile }) {
  const rows: [{ label: string; icon: string }, string][] = [
    [copy.facts.city, profile.city],
    [copy.facts.degree, profile.degree],
    [copy.facts.languages, profile.languages.join(', ')],
    [copy.goodAt, profile.goodAt.join(', ')],
    [copy.wantToLearn, profile.wantToLearn.join(', ')],
  ]
  return (
    <dl className="m-0 grid gap-5 sm:grid-cols-2">
      {rows.map(([field, value]) => (
        <div key={field.label} className="grid gap-1">
          <dt className="meta">
            <FieldHead icon={field.icon} label={field.label} />
          </dt>
          <dd className="m-0 text-[16px]">{value || '—'}</dd>
        </div>
      ))}
      {LINK_FIELDS.map((field) => (
        <div key={field} className="grid gap-1">
          <dt className="meta">{copy.links[field]}</dt>
          <dd className="m-0 text-[16px]">
            {profile[field] ? (
              <a
                href={profile[field]}
                target="_blank"
                rel="noreferrer"
                className="text-ink-1 decoration-line-2 hover:decoration-violet underline underline-offset-4"
              >
                {linkLabel(field, profile[field])}
              </a>
            ) : (
              '—'
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
