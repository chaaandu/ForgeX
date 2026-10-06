# ForgeX 2.0 Bets

119 Forge students each claim one of 212 problem statements for a 17-day
venture-building hackathon. First claim wins, one problem per student, and every
bet is written straight onto that problem's row in a Google Sheet.

`SETUP.md` is for the owner: Sheet, Apps Script, OAuth, Vercel. This file is for
whoever is changing the code.

## Stack

- Next.js 15 App Router, TypeScript strict, Server Components by default
- Tailwind CSS v4 (`@theme` in `app/globals.css`, no config file)
- Radix for Dialog, Select and Popover. Nothing else from any UI kit
- Motion (framer-motion) for the modal and the stamp only
- Auth.js v5 (`next-auth@beta`), Google provider, JWT sessions
- Zod on every payload crossing a boundary
- Google Apps Script web app as the only writer to the Sheet
- pnpm, Vercel, Playwright

## Commands

```sh
pnpm dev             # localhost:3000
pnpm build           # must pass with zero warnings
pnpm lint            # eslint
pnpm typecheck       # tsc --noEmit
pnpm test            # playwright, mock mode, builds first
pnpm data:problems   # data/problems.json from the xlsx
pnpm data:students   # data/students.json and public/students/*.webp
pnpm data:profiles   # data/profiles.json from the cohort exports in data/
pnpm data:archetypes # data/archetypes.json from the Hackathon 1 export
pnpm test:archetype  # the trial still places people the way Hackathon 1 did
pnpm test:script     # the Apps Script rules, in node, against a fake Sheet
```

## Where things live

| What                                  | Where                                    |
| ------------------------------------- | ---------------------------------------- |
| Every user-visible string             | `lib/copy.ts`                            |
| Colours, radii, type scale            | `app/globals.css` under `@theme`         |
| Tag colour helpers                    | `lib/utils.ts` (`TAG_COLOR`, `tagStyle`) |
| Role from email domain                | `lib/roles.ts`                           |
| Sheet parsing, shared with the script | `lib/parse.ts`                           |
| Zod schemas                           | `lib/schema.ts`                          |
| Apps Script client                    | `lib/sheet.ts`                           |
| Mock / live switch, caching, fallback | `lib/backend/`                           |
| Who may see a bettor's email          | `lib/visibility.ts`                      |
| Server actions                        | `app/actions.ts`                         |
| The Sheet backend                     | `apps-script/Code.gs`                    |
| Onboarding questions and their options | `lib/taxonomy.ts`                       |
| The three classes, and the trial      | `lib/archetype.ts`                       |
| Class artwork and the brand marks     | `public/art/`, `public/brand/`           |
| The ground every flow screen sits on  | `components/World.tsx`                   |
| Where a student can be found          | `LINK_FIELDS` in `lib/profile.ts`        |
| Per-student class data, and what is hidden | `lib/archetype-data.ts`             |
| A student's profile, seed and answers | `lib/profile.ts`                         |
| Which problems to recommend, and why  | `lib/match.ts`                           |
| What the cohort sheets know           | `data/profiles.json`                     |
| The five acts                         | `components/onboarding/`                 |

## How state flows

- The grid is a Server Component. Filters live in the URL and are applied on the
  server, so the browser never receives all 212 problems.
- **The modal is pure client state** (`components/ModalState.tsx`). It holds the
  open problem ID, mirrors it into the URL with `history.pushState`, and fetches
  the detail from `GET /api/problem/[id]`. This is deliberate: a router
  navigation that unmounts the open dialog stalls and never commits, so opening,
  closing and the arrow keys deliberately avoid the router.
- **A call to Apps Script costs about three seconds and 227KB, so no request
  ever waits on one if it can help it.** Problems come from the build's own
  snapshot and refresh in the background; bets are cached ten seconds and served
  stale while revalidating, blocking only on a server's very first request. The
  `bets` action returns the bet map alone, which is why polling is cheap.
  Serving slightly stale bet state is safe: the Sheet decides who gets a
  problem, inside the script lock, not this cache.
- Bet state lives in `components/BetsProvider.tsx`: seeded from the server,
  polled from `GET /api/bets` every 15 seconds and on window focus, and updated
  optimistically for the viewer's own actions with a rollback on any error.
- Only `components/CardBet.tsx` re-renders when a stamp arrives. The cards
  themselves stay server rendered.
- `lib/problem-cache.ts` holds problem detail for the session. Cards warm it on
  hover and focus, so the modal almost never shows its skeleton.

## Archetypes

Every student has a class: **cartographer** (understands first), **alchemist**
(experiments first) or **architect** (structures first). It is the first thing
the flow shows them, because it is the only part that gives something before
asking for anything.

- 110 of them were classified in Hackathon 1 and that result is used as-is. The
  other nine sit **the trial**: the same seven questions, scored by the same
  rubric.
- **That rubric was recovered, not invented.** `lib/archetype.ts` carries
  weights fitted against the 117 people already classified, and they reproduce
  every one of those students' axis scores and classes exactly. `pnpm
  test:archetype` re-checks it and fails if it ever drifts. Without that, the
  trial would be a lookalike quiz and the nine would be second-class.
- Ties break experiments, then understands, then structures. That is not a
  preference, it is what the six tied students in the source actually got.
- The class is **re-derived on the server** in `saveOnboarding` rather than
  trusted from the client, so a forged payload cannot hand somebody a class
  they did not sit for.
- A class changes which problems are recommended, through
  `ARCHETYPE_MECHANICS` in `lib/match.ts`. It never restricts the board.

## What a student actually sees

A student never sees the board. They answer, they are shown four problems
chosen for them, they pick one, and from then on `/` is the one they picked.

- `app/page.tsx` branches on role: a student gets `Chosen`, the team gets the
  grid. The grid, the filters, the modal and the arrow keys are all **team
  surfaces now** — `tests/grid.spec.ts` signs in as staff for that reason.
- A grid of 177 is the right tool for choosing and the wrong thing to leave
  somebody looking at for seventeen days afterwards, because all it shows them
  then is the roads they did not take.
- Nothing a student sees ranks a problem: no rarity, no tier, no type. Rarity
  still exists in the data and still pitches difficulty through `LEVEL_TARGET`
  in `lib/match.ts`, but a visible label that ranks the options changes which
  one somebody picks, and that is not a thumb we want on the scale.
- Confirming goes through `placeBet`, the same action as before, so the script
  lock, the one-problem-per-student rule and the race handling are unchanged.
  The flow is a nicer doorway to it, not a second way in.

## Onboarding

A student answers three questions before the board opens: which industries,
what they would change about a business, and what they can already build with.
Then they get four matched problems, or they write their own.

- **The questions are derived from the bank, not invented.** The ten industries
  are the ten clusters, the four focuses are the fourteen mechanics grouped by
  what they change, and the nine kits are the `Tools to use` column. Changing a
  cluster or a mechanic name in the Sheet without changing `lib/taxonomy.ts`
  breaks the join silently, so there is a check for it: see the verification in
  `lib/taxonomy.ts`'s header comment.
- **Matching is deterministic and explains itself.** `lib/match.ts` scores on
  industry, focus, tool comfort and anything in their seed, and every match
  carries the reasons it scored in the student's own words. No model, no
  network, no randomness. A recommendation a student cannot interrogate is
  worth nothing when they are about to spend seventeen days on it.
- The four cards are spread across cluster, mechanic **and rarity**. Without the
  rarity spread, dozens of rows tie on score and the nudge quietly becomes the
  sort key, so every student gets four legendaries they never asked for.
- The acts are client state mirrored into the URL by hand, the same as the
  modal, so moving between them never waits on the server. **Nothing is saved
  until the reveal**: a half-answered profile would skew every match forever.
- The reveal links to the board rather than offering a second bet button.
  Betting has one home, with the change-counting and the race handling in it.

## Rules that must not drift

- **A student's first pick is free, then they get three changes.** Counted from
  the Bet log, in the script, inside the lock: `picksFromLog` counts every bet
  and move per email, and one less than that is changes used. `MAX_CHANGES` is a
  script property, so the number can change without a deploy. At zero left, a
  student can neither move nor take their bet back: taking it back would leave
  them with nothing and nothing left to spend.
  Clearing a `Bet by` cell frees the problem but refunds nothing, because the
  count comes from the log and not from the Problems tab. Refunding a change
  means deleting that student's last `bet` or `move` row from the Bet log.

- Identity for a bet comes from the session and nowhere else. `placeBet` takes a
  problem ID and nothing more.
- A student may see an email only on their own bet. The team sees every email.
  Both the route handler and the server actions go through `visibleBets`.
- The close time is enforced in three places and all three must stay: the server
  actions, the route handler's `closed` flag, and the Apps Script.
- Every write in `Code.gs` takes `LockService.getScriptLock()` and re-reads its
  rows inside the lock. That is the only thing standing between two students and
  the same problem.
- Columns are read by header name, never by position.
- **A student is never told that nothing matched them.** `topMatches` falls back
  to the gentlest open rows — lowest rarity, fewest kits — and marks them
  `gentle` so the card can say it is a place to start rather than pretend to be
  a match. A narrow set of answers, or a board that is nearly gone, must not
  produce an empty screen for somebody who just spent two minutes on this.

- **Problem IDs are frozen.** They run P001 to P177 with no gaps. An ID is what
  a deep link, a screenshot and every row of the Bet log point at, so once
  betting opens nothing may renumber. `data/id-crosswalk.csv` maps the current
  IDs back to the original 212-problem numbering.
- The Problems tab carries one app-written column, `Bet by`, holding a name.
  The email and the time come from the Bet log; the photo comes from the roster
  in `lib/students.ts`, joined on email and falling back to the name, which is
  unique across all 119 students. `enrich()` in `lib/backend/index.ts` is where
  that join happens.
- Never let `APPS_SCRIPT_URL` or `APPS_SCRIPT_SECRET` reach the browser. Both
  `lib/sheet.ts` and `lib/backend/index.ts` import `server-only` to enforce it.

- **A profile holds facts and the student's own words, and nothing else.** The
  cohort sheets that feed `data/profiles.json` also carry staff assessment:
  segmentation, confidence, top-student and priority-pool flags, readiness
  tiers, biggest-gap-to-close, Sherpa and mentor notes, and a loan flag. None
  of it is imported. `scripts/import-profiles.ts` keeps a `BANNED` list and
  **fails the run** if a mapping ever reaches for one of those columns. The
  reason is that every field in this file is shown back to the student it
  describes, on their own profile screen. What they told us is theirs. What
  somebody concluded about them is not ours to hand over.

- **Two things about a student are used and never shown.** `level` (the source
  calls it the internal tier) pitches how hard a problem should be; `track`
  (autonomous, structured, guided) is the roster's. Both live behind
  `lib/archetype-data.ts`, which is `server-only`, and the one shape that
  crosses to a browser — `PublicArchetype` — is built by naming its fields
  rather than by deleting the private ones, so a field added there stays
  private until somebody deliberately exposes it. A student is told their
  level, because a level is about them. They are never told which group that
  level put them in, because that is a staffing decision about rooms and
  mentors, not a fact about them. There is a test that greps the rendered page
  for all five words.

- A student is sent to `/start` until they have answered. That gate is one
  redirect at the top of `app/page.tsx` and nothing else, so it is easy to find
  and easy to lift if you decide browsing should come first.

- The Problems tab is not the only thing the script writes any more. `Profiles`
  holds one row per student, overwritten in place, with `Completed at` written
  once and never moved. `Challenges` is append-only like the Bet log, and the
  newest row per email is that student's current submission. A `Status` cell
  the script does not recognise reads as `pending`, so a typo can never look
  like an approval.

## The design language

The flow at `/start`, `/me` and the composer are built on **Mesa Forge's own
brand**, taken from `mesa_forge_design_system` in the archetypes repo rather
than invented here. Two earlier attempts — dark SaaS, then dark editorial —
were both competent and both wrong: this is a screen a nineteen-year-old meets
once, at the start of something they are meant to be excited about, and
restraint is not the feeling it should leave.

- **Palette is the Forge purple system.** `--color-ink` through
  `--color-highlight` are the brand's named values. Vivid Violet is for CTAs
  only, about 5% of a page. Orchid carries the motifs.
- **Type is Newsreader and Manrope**, which is what the brand book specifies.
  Newsreader for anything addressed to a student, Manrope for everything else,
  mono only for indexing.
- **Each class owns a world, for the whole flow.** `worldOf()` returns a ground
  and a tint; every screen after the reveal is painted in them, and so is every
  surface on it — `.choice`, `.pill`, `.panel` are all the ground darkened
  rather than a fixed aubergine, which read as a sticker from another brand the
  moment the page turned amber. Anyone not yet placed gets `FORGE_WORLD`, the
  house purple. A flow that reveals you as an Alchemist and then turns purple
  has taken the thing back a screen later.
- **The character is the point.** `public/art/*.webp` are the class portraits.
  They are the hero of the reveal and a small companion in the corner of every
  act afterwards. `Silhouette` stands in for anyone not yet placed — during the
  trial, and as the fallback if art is ever missing.
- **`components/World.tsx` owns the ground.** Every screen in the flow is
  wrapped in it: the class colour, the drifting light under it, the grain over
  it, and the brand's comma mark cropped off an edge. Screens that set their
  own background by hand is how three of them ended up aubergine on a teal
  page, and why `.choice[data-on]` mixed its fill into a fixed purple instead
  of into the world. Anything that needs a surface colour mixes with
  `--world-bg`.
- **`LivingGround` is a canvas, drawn at a sixth of device resolution.** Four
  lights on mutually prime sine paths, capped at 30fps, stopped entirely when
  the tab is hidden or it scrolls out of view, one static frame under reduced
  motion. A still background is the clearest tell that a page was assembled
  rather than designed.
- **Chunky, and it moves when you press it.** `.chunk` is a solid cap on a
  darker base that travels 4px down on `:active`; `.choice` and `.pill` are the
  same idea at other sizes. That one detail is most of why a game feels like a
  game and a form feels like a form.
- Motion uses `--ease-pop` (a little overshoot) for anything meant to feel good
  to press, and `--ease-out-quiet` for everything else. All of it respects
  `prefers-reduced-motion`.
- **The reveal is the one moment that is allowed to be loud.** `IMPACT` in
  `ClassReveal` is when the character hits the ground, and every other element
  on that page is timed off it, so the screen reads as one event with
  consequences rather than six things fading in near each other. If you add
  something there, hang it off `IMPACT` too.

**A link is normalised on the server, never on the client.** `normaliseLink`
takes whatever was pasted — a full URL, a bare handle, an `@handle`, a profile
address with tracking on it — and returns a whole `http(s)` URL on the expected
host, or null. A bare handle has to match `[A-Za-z0-9][A-Za-z0-9._-]{0,38}`,
without which anything at all gets pasted onto the end of a profile URL and
stored as though it meant something.

**Nothing in the flow ranks a problem.** No rarity, no tier, no type on any
card a student sees. Rarity still exists in the data and still shapes which
problems get picked — `LEVEL_TARGET` in `lib/match.ts` pitches difficulty — but
a visible label that ranks the options changes which one somebody chooses, and
that is not a thing we want to put a thumb on.

**Static assets must stay out of the middleware matcher.** It once named
`students` and nothing else, so the day class art landed in `public/art` every
character redirected to the login screen and rendered as a broken image. The
matcher now exempts by file extension, and there is a test for it.

## Conventions

- No `any`. `noUncheckedIndexedAccess` is on, so index into arrays carefully.
- Prettier: no semicolons, single quotes, 100 columns.
- Icons: lucide-react at `size={16} strokeWidth={1.5}`, used sparingly.
- Motion: 150 to 200ms, ease-out, no bounce. Respect `prefers-reduced-motion`.
- Add a string to `lib/copy.ts` rather than inlining it in a component.
- Keyboard: `/` focuses search, Escape leaves it, the arrow keys walk the
  filtered list inside the modal. The modal also carries visible prev and next
  controls, both so touch users have them and so the shortcut is discoverable.

## Mock mode

`MOCK_BACKEND=true` swaps the Sheet for an in-memory store with the same rules,
including the profile and challenge ones (`lib/backend/mock.ts`) and adds a credentials provider to the login screen
listing two students and one team member. `POST /api/mock/reset` clears the
board and exists only in mock mode. The whole UI and the whole test suite run
without Google or the Sheet.
