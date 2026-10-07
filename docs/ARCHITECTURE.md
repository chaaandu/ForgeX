# Architecture

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 App Router, TypeScript strict, Server Components and server actions | Kept from the current build |
| Styling | Tailwind CSS v4, with tokens in `@theme` in `app/globals.css` | No config file |
| Motion | `motion` for UI, the View Transitions API between levels, GSAP on the landing only | `motion` replaces `framer-motion` (same API, new package) |
| 3D | React Three Fiber for the founder wall, loaded after LCP | Only if the lab proves it earns its weight. The DOM mosaic is always the fallback |
| Auth | Auth.js v5 (`next-auth@beta`), Google provider, JWT sessions | Kept |
| Validation | Zod at every boundary: server actions, route handlers, Sheet rows, JSON seeds | |
| Store | **Google Sheets**, via the Sheets API v4 and a service account | The owner's decision. A new Sheet, created for this project |
| Email | Resend, from a verified `mesaschool.co` subdomain | Response notifications only |
| Card images | `next/og` at `/api/card/[slug]` | Rendered on request and cached. Nothing stored |
| Research | Anthropic SDK, used only in `scripts/research/` | Optional; see RESEARCH.md |
| Tests | Vitest for units, Playwright end-to-end in mock mode | |
| Hosting | Vercel, pnpm | |

**Retired:** Apps Script (`apps-script/Code.gs`), `lib/sheet.ts`, the `globalThis` caches and read queue in `lib/backend/`, and the bets, board and modal system.

The script lock existed to stop two students taking the same problem. With no exclusivity, nothing is left to protect, and the direct API is roughly ten times faster.

## Data model (the Sheet)

**One spreadsheet, one tab per entity.**
- Columns are read by header name, never by position.
- Every row is parsed through a Zod codec in `lib/sheet/codecs.ts`, so a column a person has renamed fails loudly instead of being read as empty.
- JSON cells are versioned, for example `{"v":1,...}`.

### Founders

One row per founder. The rows are seeded once by `pnpm sheet:init`, and their order never changes.

| Column | Notes |
| --- | --- |
| Email | Key, lowercase |
| Slug | Frozen at seed time |
| Name, First name, Photo | From the roster |
| Number | Set once on first arrival (see below) |
| Track | Team only. `autonomous`, `structured` or `guided` (`lib/tracks.ts`); anything else reads as `structured`. It decides which problems a founder is offered |
| Wall | `yes` or `no` |
| Level | The furthest level reached, 1–7 |
| Archetype, Archetype source, Axes, Retakes used | Source is `h1`, `quiz` or `retake`. Axes is JSON `{u,e,s}` |
| H1 archetype | Their Hackathon 1 class |
| H1 outcome | Team only |
| Bio, City, Languages, Degree, Good at, Want to learn | |
| GitHub, LinkedIn, Portfolio | |
| World | JSON: the Level 4 answers, versioned |
| Pick ID, Status | Denormalised from Picks and Responses so the team can read the Sheet at a glance |
| Last active, Updated at | |

### Problems

The published bank, seeded from `data/problems.json`.

| Column | Notes |
| --- | --- |
| ID | `P001`… Frozen once founders can see it |
| Status | `draft`, `approved` or `rejected`. A value the app doesn't recognise is read as `draft` |
| Title, Problem, Challenge | |
| Difficulty | `easy`, `medium` or `hard`. Team only: never sent to a founder's browser. Was `Rarity`; `pnpm sheet:migrate` renames it on an older Sheet |
| Industries, Side, Learn | Tags from `lib/taxonomy.ts` |
| Signal count, Signal line, Signal strength | |
| Edited by, Edited at | The team member's email and the time, written on approve, reject and edit, and shown in the bank |

### Problems internal

ID, evidence links (JSON), why now, existing players and their gaps, and the seven scores with notes. **Team only.**

### Picks

Append-only. One row for every submission.

| Column | Notes |
| --- | --- |
| Pick ID | ULID |
| Email | |
| Problem ID | Empty if the founder wrote their own |
| Custom title, Custom problem, Custom challenge, Custom industry, Custom side | Only for problems the founder wrote |
| Why problem, Why user, Why pay | |
| Contact | Optional |
| Submitted at | |
| Withdrawn at | Written once, in place, by the founder |

### Responses

Append-only. Pick ID, Author (the team member's email), Type (`go`, `tweak`, `talk` or `another`), Note, Suggested IDs, Booking link, Sent at, Emailed at.

### Events

Append-only audit log: At, Email, Kind, Data (JSON). The Email is whoever acted, so every response and every bank change records who made it.

Kinds:
- `arrived`
- `level`
- `archetype`
- `profile`
- `world`
- `pick`
- `withdraw`
- `response`
- `wall`
- `bank`
- `export`

The status of a pick is the type of its newest response, or `waiting` if it has none.

## Writes and concurrency

The Sheets API has no transactions, so the design avoids any need for them.

| Write | Who | How |
| --- | --- | --- |
| Picks, Responses, Events | Many writers | `values.append` only. Appends are serialised by Google, so they cannot collide |
| A Founders row | That founder, or the team | `values.update` on the founder's fixed row. Last write wins, and the only possible conflict is between a founder's own two tabs |
| Problems row | Team | `values.update` on the problem's row, plus a `bank` event |

**Founder numbers** need no lock:
1. On first sign-in, the app appends an `arrived` event.
2. It reads the Events tab and ranks founders by their first `arrived` row.
3. It writes that rank to the founder's `Number` cell.

The rank is deterministic, so a duplicate append from a second tab gives the same number.

## Reads, caching and quota

A service account gets about 60 read requests and 60 write requests per minute.

- **Reads** fetch whole tabs with `values.batchGet` and go through `unstable_cache`, which Vercel shares across instances.
  - Founders, Picks and Responses are cached for 15 seconds.
  - Problems is cached for 5 minutes.
  - Each read is tagged by tab, and a write calls `revalidateTag` for the tabs it touched, so a founder always sees their own change straight away.
- **Writes** retry on 429 and 5xx with jittered backoff, up to 4 tries. After that the founder sees the error state, and their input is kept.
- **Load test:** `pnpm test:quota` replays 117 founders onboarding within five minutes against the mock, with the real quota simulated. It must stay under the limits with headroom.
- **Pages** load seed data from the build: the roster, photos and H1 archetypes. They only call the Sheet for live state.

## Routes

| Route | Who | Kind |
| --- | --- | --- |
| `/` | Public | Landing, founder wall, and below it the founders who are building. Static, revalidated every five minutes and whenever the team responds. Signed-in users can come back to it at any time |
| `/enter` | Anyone | Where the landing's Enter goes: a relative redirect to sign-in, the founder's furthest level, or the console |
| `/login` | Public | Google sign-in, and the refused state |
| `/arrive`, `/archetype`, `/profile`, `/world`, `/matches`, `/matches/new`, `/why` | Founder | The levels. A server-side guard redirects to the furthest level reached. An autonomous founder's `/matches` redirects to `/matches/new` |
| `/f/[slug]` | Founder (own page), Team; any signed-in user once the founder is building | The founder and the team see everything. Once the founder's current pick is Approved (`go`; a tweak does not count), other signed-in users see the card, archetype, bio, problem title and challenge, and profile facts; never the thread, team note, team panel or card download. 404 otherwise |
| `/team`, `/team/queue`, `/team/bank` | Team | The console |
| `/api/card/[slug]` | Founder (own card), Team | PNG of the founder card |
| `/api/team/export.csv` | Team | CSV export |
| `/lab/a`, `/lab/b`, `/lab/c`, `/lab/bank` | Team | Phase 3 only. Deleted before launch |

## Server actions

Every action follows the same order:
1. Get the viewer from the session.
2. Check the role.
3. Parse the input with Zod.
4. Check that the viewer owns the resource.
5. Write.
6. Append an event.
7. Revalidate the affected tags.

Identity always comes from the session. It is never accepted as input.

| Action | Role |
| --- | --- |
| `arrive()` | Founder |
| `saveArchetype(answers)` | Founder. The server re-scores the answers and never trusts a client result. Retakes are limited to one |
| `saveProfile(patch)` | Founder. Links are normalised on the server |
| `saveWorld(answers)` | Founder |
| `submitPick(input)` | Founder |
| `withdrawPick(pickId)` | Founder. Only while the pick has no response |
| `setWall(on)` | Founder |
| `respond(pickId, type, note, suggested)` | Team. Records the author, sends the email, revalidates `/` |
| `setProblemStatus(id, status)` | Team. Writes Edited by and Edited at |
| `editProblem(id, patch)` | Team. Title, problem, challenge and difficulty. Writes Edited by and Edited at |

## Security and privacy

- **Middleware** only redirects the signed-out, by the presence of the session cookie, which keeps Auth.js off the edge. Every page, route handler and action verifies the session itself on the server.

- **Roles** come from the email domain only (`lib/roles.ts`). The matching is suffix-exact, so `evilmesaschool.co` is refused.
- **`server-only`** guards everything that touches the roster, the cohort sheet, H1 data, the Sheet client or secrets.
  - Data that crosses to the browser is built as a named public type, field by field, never by deleting private fields.
  - Seed JSON is only ever imported from `server-only` modules. This fixes a leak in the current build, where `lib/profile.ts` shipped all 119 seed profiles to the client.
- **Never sent to a founder:** track, H1 outcome, internal level, team notes, other founders' picks, `problems.internal`, and a problem's difficulty and signal. `forFounder` in `lib/problem.ts` builds the `FounderProblem` that crosses to the browser by naming fields. A test greps the built client chunks for roster emails and these field names, and fails if it finds any.
- **Mock mode** requires `MOCK_BACKEND=true` and a deploy that is not Vercel production (`VERCEL_ENV !== 'production'`), so the Playwright suite can still run against a production build locally. `.env.example` defaults it to `false`.
- **Public wall:** shows first name, photo and archetype only. Founders can switch themselves off it.
- **What they're building** (`lib/building.ts`): founders on the wall whose current pick is Approved (`go` only). Only the card and the problem title travel, never the why or the team's note.
- **The team in the thread:** the team sees *Name, for the team* on each response; founders see *The ForgeX team*.
- **Secrets** (`GOOGLE_SA_EMAIL`, `GOOGLE_SA_KEY`, `RESEND_API_KEY`, `AUTH_SECRET`) are read only in `server-only` modules.

## Matching (`lib/match.ts`)

Matching is pure, deterministic, and has no network calls. It runs on the server, and the browser only ever receives the problems chosen, through `forFounder`.

**Tracks** (`lib/tracks.ts`) decide the pool before anything is scored, through `allowed`:

| Track | Offered |
| --- | --- |
| `autonomous` | No bank. They write their own problem, and step 5 is called *Your problem* |
| `structured` | Hard and medium |
| `guided` | Medium and easy |

The team's **Try another** suggestions skip the track filter, because a person chose them.

**Score.** Each factor is normalised to 0–1, weighted, and summed:

| Factor | Weight |
| --- | --- |
| Access (a world they can reach is the problem's first industry; 0.3 if only a secondary one) | 30 |
| Industry (the problem's first industry; 0.3 for a secondary one) | 20 |
| Learn (overlap with what the problem teaches) | 15 |
| Comfort fit (problem difficulty against the target for their comfort and intent) | 15 |
| Side | 10 |
| Intent (company → market openness, career → learning value) | 5 |
| Archetype affinity | 5 |

**Comfort fit.** Difficulty ranks easy 0, medium 1, hard 2. The target is `[0, 0, 0.5, 1, 1.4, 1.8][comfort]`, plus 0.3 for *company*, 0.15 for *both* and −0.15 for *exploring*, clamped to 0–2 (`difficultyTarget`). Fit is `1 − |rank − target| / 1.5`, floored at 0.

**Chips:**
- Each factor scoring above its threshold produces one chip, written in the founder's own words.
- Only real factors produce chips.
- The top two or three are kept on each match, for tests and the team. Match cards no longer show them; a team-suggested card shows the note *The team suggested this* instead.

**Choosing the four:**
1. Take the best-scoring problem first.
2. Each next pick pays 12 for every card already showing its first industry and 6 for every card already at its difficulty, and earns 14 if its first industry is one the founder chose or can reach but is not yet on screen.
3. Exclude problems the founder has already tried.
4. If fewer than four score at all, fill from the gentlest open problems in the track's pool (easiest first) and mark them `gentle`.

`lib/taxonomy.ts` is the single source of the industries, sides, learn tags and difficulties. The questions, the research pipeline and the matcher all import it, so a renamed tag can't break the join silently. A test checks that every problem's tags exist in the taxonomy. Every Level 4 option must map one to one onto a bank value, or it matches nothing: the bank's `creator` side means anyone who earns on their own, so the question says that, and its short label is *Self-employed*.

## Seed data and what carries over

**From the current repo:**

| Source | Becomes |
| --- | --- |
| `data/students.json` | The Founders seed |
| `public/students/*.webp` | Founder photos |
| `data/profiles.json` | Degree and prior work, used for prefill |
| `data/archetypes.json` | Axes, H1 class and H1 outcome |
| `scripts/import-students.ts`, `scripts/import-profiles.ts`, `scripts/import-archetypes.ts` | Kept, including the BANNED-column guard |

**Six archetypes:** `lib/archetype.ts` keeps the recovered rubric. A founder's archetype is their top axis followed by their second, with ties broken in the order `e`, `u`, `s`. `pnpm test:archetype` keeps checking the H1 rubric. A Vitest test checks the six-way mapping for all 110 founders: Cartographer 20, Scout 39, Alchemist 15, Tinkerer 13, Architect 11, Engineer 12.

## Testing

- **Vitest:**
  - matching (determinism, chip truthfulness, spread, the gentle fallback)
  - archetype mapping
  - slugs
  - roles
  - `normaliseLink`
  - the writing nudges
  - Sheet codecs
- **Playwright, in mock mode:**
  - the full founder journey, for both a new founder and one already placed in H1
  - the team review loop for all four response types
  - the refused domain
  - founder page visibility
  - the bundle leak grep
  - screenshots at 390, 1080 and 1440
- **Lighthouse CI on mobile:** performance, accessibility and best practices must each score at least 95.

## Environment variables

`AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `SHEET_ID`, `GOOGLE_SA_EMAIL`, `GOOGLE_SA_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `BOOKING_URL`, `PICKS_CLOSE_AT`, `MOCK_BACKEND`, and optionally `ANTHROPIC_API_KEY` (research only).

## Folder layout

```
app/                 routes (see above)
components/          shared UI, from the design system
components/levels/   one folder per level
content/copy.ts      every user-visible string
lib/                 roles, session, taxonomy, tracks, archetype, match, building, slug, links, nudges
lib/sheet/           client, codecs, tabs, mock
scripts/             seed and import scripts; sheet:init, sheet:migrate
scripts/research/    the problem-bank pipeline
data/                seeds, problems.json, problems.internal.json, research/
docs/                these four documents
```
