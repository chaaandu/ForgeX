import { consoleCopy } from '@/content/copy'

const copy = consoleCopy.brief

export type Brief = {
  bio: string
  world: {
    industries: string[]
    side: string
    reach: { who: string; where: string[] }[]
    learn: string[]
    intent: string
    comfort: { value: number; label: string }
  } | null
  profile: {
    degree: string
    city: string
    languages: string[]
    goodAt: string[]
    wantToLearn: string[]
  }
}

/**
 * Everything the team needs to judge a fit, read at a glance: who they can
 * reach first, because access decides most fits, then what they care about,
 * then how far they can build. Chips for lists, a meter for comfort, and a
 * dash wherever they left something empty.
 */
export function FounderBrief({ brief }: { brief: Brief }) {
  const { world, profile } = brief
  const profileRows = (
    [
      { icon: copy.icons.studies, label: copy.studies, value: profile.degree },
      { icon: copy.icons.city, label: copy.city, value: profile.city },
      { icon: copy.icons.languages, label: copy.languages, value: profile.languages.join(', ') },
      { icon: copy.icons.goodAt, label: copy.goodAt, value: profile.goodAt },
      { icon: copy.icons.wantToLearn, label: copy.wantToLearn, value: profile.wantToLearn },
    ] as { icon: string; label: string; value: string | string[] }[]
  ).filter((row) => row.value.length > 0)
  return (
    <div className="panel grid gap-6 p-5">
      {brief.bio ? (
        <p className="display m-0 text-[20px] leading-snug italic">{brief.bio}</p>
      ) : null}

      <section className="grid gap-4" aria-labelledby="brief-world">
        <h2 id="brief-world" className="meta m-0">
          {copy.world}
        </h2>
        {world ? (
          <dl className="m-0 grid gap-4">
            <Row icon={copy.icons.reach} label={copy.reach}>
              {world.reach.length ? (
                <ul className="m-0 grid list-none gap-2 p-0">
                  {world.reach.map((entry) => (
                    <li key={entry.who} className="grid gap-1.5">
                      <span className="text-ink-1 text-[14px] font-medium">{entry.who}</span>
                      <Chips items={entry.where} />
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-ink-3 text-[14px]">{copy.nobody}</span>
              )}
            </Row>
            <Row icon={copy.icons.industries} label={copy.industries}>
              <Chips items={world.industries} />
            </Row>
            <Row icon={copy.icons.side} label={copy.side}>
              <Chips items={[world.side]} />
            </Row>
            <Row icon={copy.icons.learn} label={copy.learn}>
              <Chips items={world.learn} />
            </Row>
            <Row icon={copy.icons.intent} label={copy.intent}>
              <span className="text-ink-1 text-[14px]">{world.intent}</span>
            </Row>
            <Row icon={copy.icons.comfort} label={copy.comfort}>
              <div className="grid gap-2">
                <div
                  className="flex gap-1"
                  role="img"
                  aria-label={copy.comfortOf(world.comfort.value)}
                >
                  {[1, 2, 3, 4, 5].map((step) => (
                    <span
                      key={step}
                      className="h-1.5 flex-1 rounded-full"
                      style={{
                        background:
                          step <= world.comfort.value
                            ? 'var(--color-violet)'
                            : 'var(--color-line-2)',
                      }}
                    />
                  ))}
                </div>
                <span className="text-ink-2 text-[13px]">
                  {copy.comfortOf(world.comfort.value)} · {world.comfort.label}
                </span>
              </div>
            </Row>
          </dl>
        ) : (
          <p className="text-ink-3 m-0 text-[14px]">{copy.noWorld}</p>
        )}
      </section>

      <section className="border-line grid gap-4 border-t pt-5" aria-labelledby="brief-profile">
        <h2 id="brief-profile" className="meta m-0">
          {copy.profile}
        </h2>
        {/* Only what they filled in: five dashes in a row read as noise, not as facts. */}
        {profileRows.length ? (
          <dl className="m-0 grid gap-4">
            {profileRows.map((row) => (
              <Row key={row.label} icon={row.icon} label={row.label}>
                {Array.isArray(row.value) ? (
                  <Chips items={row.value} />
                ) : (
                  <span className="text-ink-1 text-[14px]">{row.value}</span>
                )}
              </Row>
            ))}
          </dl>
        ) : (
          <p className="text-ink-3 m-0 text-[14px]">{copy.noProfile}</p>
        )}
      </section>
    </div>
  )
}

function Row({
  icon,
  label,
  children,
}: {
  icon: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <dt className="text-ink-3 text-[12px]">
        <span aria-hidden="true" className="mr-1.5">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="m-0">{children}</dd>
    </div>
  )
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {items.map((item) => (
        <li key={item} className="tag text-[13px]">
          {item}
        </li>
      ))}
    </ul>
  )
}
