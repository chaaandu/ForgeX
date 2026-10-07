# ForgeX 2.0

117 first-year founders at Mesa School of Business take one open challenge (small businesses in India run on WhatsApp, calls and a notebook) into a three-week build sprint, 9 to 30 Oct 2026. Onboarding is five steps: arrive, archetype, profile, the challenge, and their research. Sending research opens their plan: Today, Plan, Stops and Messages. Nobody approves anything; the team rates the three hard stops and answers messages in a console. `docs/BUILD_PLAN.md` is the plan.

`docs/` is the spec: PRODUCT (flows, states, copy), DESIGN (direction, system, motion), ARCHITECTURE (data model, routes, security) and RESEARCH (the problem bank). `SETUP.md` is for the owner. This file is for whoever changes the code.

## Stack

- Next.js 15 App Router, TypeScript strict, Server Components and server actions
- Tailwind CSS v4: tokens in `@theme` in `app/globals.css`, no config file
- Auth.js v5 (`next-auth@beta`), Google provider, JWT sessions
- Google Sheets as the only store, through a service account (`lib/sheet/google.ts`, no SDK)
- Zod at every boundary
- CSS for all motion. No animation library and no WebGL: the wall is plain DOM with one delegated listener
- `next/og` and `sharp` for the founder card PNG
- Vitest for units, Playwright end to end in mock mode
- pnpm, Vercel

## Commands

```sh
pnpm dev                # localhost:3000
pnpm build              # must pass with zero warnings
pnpm lint && pnpm typecheck
pnpm test:unit          # vitest: plan, stops, links, archetypes, roles, codecs, copy lint
pnpm test:archetype     # the rubric still reproduces Hackathon 1 exactly
pnpm test               # playwright, mock mode, builds first
pnpm sheet:init         # tabs, headers, founders. Only ever adds
pnpm sheet:problems     # adds the bank as drafts
pnpm research           # cluster → score → drop → balance → write → validate
pnpm bank:list         # docs/PROBLEMS.md, the whole bank, readable
pnpm bank:lint         # every problem statement against docs/VOICE.md; fails on any flag
pnpm sheet:sync        # push reworded problems to the Sheet, only on rows nobody has edited
pnpm sheet:migrate     # once, on a Sheet from before tracks: Rarity → Difficulty, Track cells from the roster
```

## Where things live

| What | Where |
| --- | --- |
| Every user-visible string | `content/copy.ts` |
| Tokens, type, controls, motion | `app/globals.css` |
| Founder card (DOM) and its CSS | `components/card/` |
| Founder card (PNG) | `app/api/card/[slug]/route.tsx` |
| Levels | `app/(founder)/*` and `components/levels/` |
| The build: Today, Plan, Stops, Messages, Pod | `app/(founder)/*` and `components/build/` |
| Every date of the sprint | `lib/plan.ts` |
| Every step and stop field, per track | `content/plan.ts` (words), `lib/steps.ts` (who gets what) |
| Where a founder's build stands | `lib/build.ts`, `lib/stops.ts` |
| Founder page | `app/f/[slug]/page.tsx` |
| Team console | `app/team/` and `components/team/` |
| Founder actions | `app/actions/founder.ts` |
| Team actions | `app/actions/team.ts` |
| Sheet tabs and header-keyed codecs | `lib/sheet/tabs.ts` |
| Store: cache, mock, writes | `lib/store/` |
| Founders, research, steps, messages, stops, reviews, pods, events | `lib/data/` |
| Seed for the Sheet and for mock | `lib/seed.ts` |
| Archetype rubric, families, the six | `lib/archetype.ts` |
| The old bank's vocabulary (bank only) | `lib/taxonomy.ts` |
| Who may enter which level | `lib/journey.ts` |
| Tracks and their console names | `lib/tracks.ts` |
| What they're building (landing, open founder pages) | `lib/building.ts` |
| The problem bank switch | `lib/flags.ts` |
| Link normalising | `lib/links.ts` |
| Research pipeline | `scripts/research/`, `data/research/` |

## Rules that must not drift

- **Role comes from the email domain alone** (`lib/roles.ts`): `@forge27.mesaschool.co` is a founder, `@mesaschool.co` is the team. A founder must also be in `cohort` (`lib/students.ts`): on the roster, with a photo. Identity in every action comes from the session, never from input.
- **Every server action follows the same order:** viewer, then role, then Zod, then ownership, then write, then event, then revalidate. The archetype is scored on the server from the answers. The browser never says what someone is.
- **Columns are read by header name** (`lib/sheet/tabs.ts`). A missing header throws, naming the column, rather than reading as empty.
- **Concurrency without locks.** Research, Steps, Messages, Submissions, Reviews, Pods and Events are append-only; the newest row stands. The only in-place writes are a founder's own row, a problem row, and a message's Emailed at. A founder's number is the rank of their first `arrived` event, which is why two people arriving in the same second can't collide.
- **Step IDs are frozen** once founders can tick them (`content/plan.ts`). Change the words, never reuse an ID.
- **The problem bank is off** (`PROBLEM_BANK`, `lib/flags.ts`). Its tabs stay in the Sheet; founders never see it.
- **The team's data never reaches a founder:** track (not even as a level), the H1 outcome and level, prior work, check-in notes, other founders' ratings and messages, and the problem bank. Track names live in `lib/tracks.ts` (server only) and `content/plan.ts` is server only: a founder's browser gets their own track's steps with the track stripped (`stepsFor`, `stopFieldsFor`). The leak test greps the built client chunks for track names, and seed JSON is imported only from `server-only` modules.
- **Tracks decide the plan** (`lib/tracks.ts`, Founders.Track, team only): guided builds one core flow with the starter's build cards; structured 2 or 3 connected flows; autonomous a full product with AI at the centre and 2 stretch features. AI is optional for guided and structured. An unknown track reads as structured.
- **Nobody approves anything.** Sending research opens the plan. The team rates stops green, amber or red; the founder sees it as words (On track, A few fixes, Let's meet tomorrow) with notes, and the fix list as ticks on Today.
- **Stops close at 6 pm IST** (`lib/plan.ts`). Before that a stop can be saved and resent. After it, a sent stop is locked; an unsent one can be sent once, flagged late (`stopState` in `lib/stops.ts`).
- **Stuck? Message the team** is 3 lines at most; a screenshot is a Google Drive link, never an upload.
- **Who did what is recorded.** Reviews.Author, Messages.From and Problems Edited by hold the team member's email; Events logs every action.
- **A founder page opens to the cohort** once that founder has sent their research, and then without ratings, check-in notes, the team panel or the download. Otherwise it is the founder and the team, and a 404 for anyone else. Live links reach the landing once stop 2 is rated green.
- **Six archetypes, three families.** The family is the Hackathon 1 class and keeps its portrait (`public/art/`). The card and the wall's flip side show the full figure, never a crop. The wall only shows founders who have an archetype. The second-strongest axis splits it. Ties break experiment, understand, structure. `pnpm test:archetype` must stay at 117/117.
- **Mock mode** needs `MOCK_BACKEND=true` and a deploy that is not Vercel production (`lib/store/mode.ts`). Only there may `PLAN_NOW` pin the plan's clock.
- **Copy:** second person, short. No decorative quote or comma glyphs anywhere. The fixed lines in `docs/PRODUCT.md` are the owner's, so use them verbatim.

## Copy

Copy is as important as the design. Every string is written to `docs/VOICE.md`.

- Every string lives in `content/copy.ts`, and the plan's steps in `content/plan.ts`. The copy lint (`tests/unit/copy.test.ts`, run by `pnpm test:unit`) fails the build on:
  - banned words;
  - buttons of 24 characters or more;
  - headings over 8 words;
  - stray exclamation marks or decorative quotes;
  - images without alt text;
  - plan step titles over 8 words;
  - any word written directly into a component.
- A new button or heading is added to the lint's `BUTTONS` or `HEADINGS` list.
- Digits for numbers; "6 Oct"; "6 pm IST"; British spelling as used in India.
- Problem statements follow the rules in `docs/VOICE.md` and pass `pnpm bank:lint`. A rewrite may sharpen a problem but never add a fact its evidence doesn't hold.
- `docs/COPY_CHOICES.md` records the options for the key moments and which one is live. `docs/COPY_AUDIT.md` is the string-by-string audit.
- Two-sentence headings break between sentences through `components/ui/Lines.tsx`. Paragraphs use `text-wrap: pretty` and headings use `balance`.

## Design

The direction is Matte, with Mesa's violet (it replaced Riso's pink on 2026-10-07):
- graphite ground, one grain, Instrument Serif for display, Geist and Geist Mono;
- white carries the words, violet (`--color-violet`, `--color-violet-ink` for text) the moments: the primary action, one italic phrase, the live state;
- difficulty colours are accents only, in the console, never backgrounds for text.

- **The founder card is the progress bar.** Every level adds a layer. Change what the card shows in `lib/card.ts`, not in the component. One finish, `picked` (violet, with foil), once research is sent. The bottom line is always the archetype's identity line, never the bio or the problem.
- **One progress bar.** Levels with questions report to it through `setLevelProgress` (`components/shell/progress.ts`), so the current segment fills; never add a second bar. The onboarding shows no logo. Founders never get a sign-out at all; the team signs out from the account menu (`components/shell/Account.tsx`).
- **Nothing a founder sees ranks them.** No track, no level, no comparison with others. Rating colours (green, amber, red) are console accents only.
- **Nothing rotates** except the landing wall's flip and the founder card's lean. Where a card is the subject (the onboarding steps, the reveal, the Sent screen, a profile), it leans up to 10° toward a mouse pointer and settles back when it leaves (`components/card/Tilt.tsx`). Never on touch, never under reduced motion, never on the landing grid.
- **Sign-in returns you to where you were.** The middleware adds `?next=`, `lib/next-path.ts` keeps it on this site, and `/enter` sends everyone else to their furthest level.
- **The reveal** times everything off one `--impact`. Hang anything new off it.
- **Onboarding buttons sit in a `.dock`:** fixed to the bottom on phones, inline on desktop.
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
