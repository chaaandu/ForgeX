import { profile as copy } from '@/content/copy'
import { linkLabel, LINK_FIELDS } from '@/lib/links'
import type { Profile } from '@/lib/profile'

/** Where to find a founder's work, read-only: only the links they have added. */
export function ProfileFacts({ profile }: { profile: Profile }) {
  const links = LINK_FIELDS.filter((field) => profile[field])
  return (
    <dl className="m-0 grid gap-6 sm:grid-cols-3">
      {links.map((field) => (
        <div key={field} className="grid gap-1">
          <dt className="meta">{copy.links[field]}</dt>
          <dd className="m-0 min-w-0 text-[16px]">
            <a
              href={profile[field]}
              target="_blank"
              rel="noreferrer"
              className="text-ink-1 decoration-line-2 hover:decoration-violet break-words underline underline-offset-4"
            >
              {linkLabel(field, profile[field])}
            </a>
          </dd>
        </div>
      ))}
    </dl>
  )
}
