import { profile as copy } from '@/content/copy'
import { linkLabel, LINK_FIELDS } from '@/lib/links'
import type { Profile } from '@/lib/profile'

/** The profile, read-only, for the team. */
export function ProfileFacts({ profile }: { profile: Profile }) {
  const rows: [string, string][] = [
    [copy.facts.city.label, profile.city],
    [copy.facts.degree.label, profile.degree],
    [copy.facts.languages.label, profile.languages.join(', ')],
    [copy.goodAt.label, profile.goodAt.join(', ')],
    [copy.wantToLearn.label, profile.wantToLearn.join(', ')],
  ]
  return (
    <dl className="m-0 grid gap-5 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1">
          <dt className="meta">{label}</dt>
          <dd className="m-0 text-[16px]">{value || '—'}</dd>
        </div>
      ))}
      {LINK_FIELDS.map((field) => (
        <div key={field} className="grid gap-1">
          <dt className="meta">{copy.links[field]}</dt>
          <dd className="m-0 text-[16px]">
            {profile[field] ? (
              <a href={profile[field]} target="_blank" rel="noreferrer" className="text-ink-1 underline decoration-line-2 underline-offset-4 hover:decoration-pink">
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
