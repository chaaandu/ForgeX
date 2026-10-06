# ForgeX 2.0

117 first-year founders at Mesa School of Business each find one real problem for a three-week build sprint. The portal takes them through seven levels: arrive, archetype, profile, your world, matches, your why, and our response. The team answers every why by hand in a console.

`docs/` is the spec: PRODUCT (flows, states, copy), DESIGN (direction, system, motion), ARCHITECTURE (data model, routes, security) and RESEARCH (the problem bank). `SETUP.md` is for the owner. This file is for whoever changes the code.

## Stack

- Next.js 15 App Router, TypeScript strict, Server Components and server actions
- Tailwind CSS v4: tokens in `@theme` in `app/globals.css`, no config file
- Auth.js v5 (`next-auth@beta`), Google provider, JWT sessions
- Google Sheets as the only store, through a service account (`lib/sheet/google.ts`, no SDK)
- Zod at every boundary
- `motion` for UI and React Three Fiber for the archetype relics. The founder wall is plain DOM on purpose
- `next/og` and `sharp` for the founder card PNG
- Vitest for units, Playwright end to end in mock mode
- pnpm, Vercel

## Commands

```sh
pnpm dev                # localhost:3000
pnpm build              # must pass with zero warnings
pnpm lint && pnpm typecheck
pnpm test:unit          # vitest: matcher, archetypes, nudges, links, roles, codecs
pnpm test:archetype     # the rubric still reproduces Hackathon 1 exactly
pnpm test               # playwright, mock mode, builds first
pnpm sheet:init         # tabs, headers, founders. Only ever adds
pnpm sheet:problems     # adds the bank as drafts
pnpm research           # cluster → score → drop → balance → write → validate
pnpm art:relics <url>   # re-renders public/relics/*.webp from /lab/relics
```

## Where things live

| What | Where |
| --- | --- |
| Every user-visible string | `content/copy.ts` |
| Tokens, type, controls, motion | `app/globals.css` |
| Founder card (DOM) and its CSS | `components/card/` |
| Founder card (PNG) | `app/api/card/[slug]/route.tsx` |
| Levels | `app/(founder)/*` and `components/levels/` |
| Founder page | `app/f/[slug]/page.tsx` |
| Team console | `app/team/` and `components/team/` |
| Founder actions | `app/actions/founder.ts` |
| Team actions | `app/actions/team.ts` |
| Sheet tabs and header-keyed codecs | `lib/sheet/tabs.ts` |
| Store: cache, mock, writes | `lib/store/` |
| Founders, picks, problems, events | `lib/data/` |
| Seed for the Sheet and for mock | `lib/seed.ts` |
| Archetype rubric, families, the six | `lib/archetype.ts` |
| Shared vocabulary for questions, bank and matcher | `lib/taxonomy.ts` |
| Matching | `lib/match.ts` |
| Writing nudges | `lib/nudges.ts` |
| Who may enter which level | `lib/journey.ts` |
| Link normalising | `lib/links.ts` |
| Research pipeline | `scripts/research/`, `data/research/` |

## Rules that must not drift

- **Role comes from the email domain alone** (`lib/roles.ts`): `@forge27.mesaschool.co` is a founder, `@mesaschool.co` is the team. A founder must also be in `cohort` (`lib/students.ts`): on the roster, with a photo. Identity in every action comes from the session, never from input.
- **Every server action follows the same order:** viewer, then role, then Zod, then ownership, then write, then event, then revalidate. The archetype is scored on the server from the answers. The browser never says what someone is.
- **Columns are read by header name** (`lib/sheet/tabs.ts`). A missing header throws, naming the column, rather than reading as empty.
- **Concurrency without locks.** Picks, Responses and Events are append-only. The only in-place writes are a founder's own row and a problem row. A founder's number is the rank of their first `arrived` event, which is why two people arriving in the same second can't collide.
- **Problem IDs are frozen** once founders can see them. Only `approved` problems reach founders. Any status the app doesn't recognise reads as `draft`.
- **The team's data never reaches a founder:** track, the H1 outcome and level, prior work, team notes, other founders' picks, and `Problems internal`. Data that crosses to the browser is built field by field (`publicProblem`, `cardFor`). The leak test greps the built client chunks, and seed JSON is imported only from `server-only` modules.
- **Matching is deterministic and explains itself.** Every chip on a card names a factor that actually scored. Access to users carries the most weight. A founder never gets an empty screen: the gentle fallback fills in and says so.
- **Six archetypes, three families.** The family is the Hackathon 1 class and keeps its portrait. The second-strongest axis splits it. Ties break experiment, understand, structure. `pnpm test:archetype` must stay at 117/117.
- **Picks close** at `PICKS_CLOSE_AT`, checked in `submitPick` and `withdrawPick`.
- **Mock mode** needs `MOCK_BACKEND=true` and a deploy that is not Vercel production (`lib/store/mode.ts`).
- **Copy:** second person, short. No decorative quote or comma glyphs anywhere. The fixed lines in `docs/PRODUCT.md` are the owner's, so use them verbatim.

## Design

The direction is Matte, with Riso's pink:
- graphite ground, one grain, Instrument Serif for display, Geist and Geist Mono;
- white carries the words, pink (`--color-pink`) the moments: the primary action, one italic phrase, the live state;
- rarity colours are accents only, never backgrounds for text.

- **The founder card is the progress bar.** Every level adds a layer. Change what the card shows in `lib/card.ts`, not in the component.
- **The reveal** times everything off one `--impact`. Hang anything new off it.
- **Motion:** 150–250ms on task screens; cinematic only for the reveal, the card and the landing. Everything respects `prefers-reduced-motion`.
- **Self-review loop for any UI change:**
  1. Screenshot at 390, 1080 and 1440 (`node scripts/shoot.mjs <base> <path> <name> --full`).
  2. Check it against the five questions in `docs/DESIGN.md`.
  3. Fix, and repeat.

## Conventions

- No `any`. `noUncheckedIndexedAccess` is on.
- Prettier: no semicolons, single quotes, 100 columns.
- Icons: lucide-react at `size={16} strokeWidth={1.5}`, sparingly.
- Put strings in `content/copy.ts`, not inline.
- `pnpm next typegen` refreshes route types if `tsc` complains about `AppRoutes` after adding a route.
