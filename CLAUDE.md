# ForgeX 2.0

117 first-year founders at Mesa School of Business each build one product, alone, in an AI hackathon in October 2026. The portal opens at the announcement. Onboarding is three steps: arrive, archetype, profile. Then each founder sends their own problem (an industry, a short title, the 3Ps: Person, Problem, Promise, why them, a plan, a link to secondary research and, optionally, to primary research) for one of 3 reviewers to approve, approve with changes, or reject with a note, as often as it takes, until the problem window shuts on 20 Oct. Anyone without an approved problem then picks one of 4 matched problems from the bank (3 questions first). Then 4 stages: MVP scope (due 21 Oct, never locks), then Prototype, Launch and Pitch, each with a hard deadline. Progress is 10% sent, 20% approved, then 30%, 55%, 80%, 100%. The team reviews and watches in the console.

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
pnpm test:unit          # vitest: matcher, hackathon clock and links, archetypes, roles, codecs, copy lint
pnpm test:archetype     # the rubric still reproduces Hackathon 1 exactly
pnpm test               # playwright, mock mode, builds first
pnpm sheet:init         # tabs, headers, founders. Only ever adds
pnpm sheet:problems     # adds the bank as drafts
pnpm sheet:hackathon    # new problems as drafts, plus each problem's 2-day version where those cells are empty
pnpm research           # cluster → score → drop → balance → write → validate
pnpm bank:list         # docs/PROBLEMS.md, the whole bank, readable
pnpm bank:lint         # every problem statement against docs/VOICE.md; fails on any flag
pnpm sheet:sync        # push reworded problems to the Sheet, only on rows nobody has edited
pnpm sheet:migrate     # once: Rarity → Difficulty, Track cells, and the Hackathon tab laid out in the new columns (--dry first)
```

## Where things live

| What | Where |
| --- | --- |
| Every user-visible string | `content/copy.ts` |
| Tokens, type, controls, motion | `app/globals.css` |
| Founder card (DOM) and its CSS | `components/card/` |
| Founder card (PNG) | `app/api/card/[slug]/route.tsx` |
| Levels | `app/(founder)/*` and `components/levels/` |
| Home, the problem form, the stage forms | `app/(founder)/build`, `app/(founder)/problem`, `app/(founder)/submit/[stage]`, `components/build/`, `components/problem/` |
| Every date: opens, problem window, bank, the 3 stages, the clock | `lib/hackathon.ts` |
| What each stage hands in, and progress | `lib/submission.ts` |
| An own problem, the 3 answers, who may build | `lib/own-problem.ts` |
| The 4 steps on a founder's home, and the next deadline | `lib/steps.ts` |
| Reviewers and the super admin | `lib/staff.ts` |
| Whether a shared link is open to everyone | `lib/link-check.ts` |
| Founder page | `app/f/[slug]/page.tsx` |
| Team console | `app/team/` and `components/team/` |
| Founder actions | `app/actions/founder.ts` |
| Team actions | `app/actions/team.ts` |
| Sheet tabs and header-keyed codecs | `lib/sheet/tabs.ts` |
| Store: cache, mock, writes | `lib/store/` |
| Founders, the hackathon rows, problems, events | `lib/data/` |
| Each founder's group, reviewer and POC | `data/groups.json`, from `pnpm data:groups` |
| The bank, and each problem's 2-day version | `data/problems.json`, `data/problems.scope.json` |
| Seed for the Sheet and for mock | `lib/seed.ts` |
| Archetype rubric, families, the six | `lib/archetype.ts` |
| Shared vocabulary for questions, bank and matcher | `lib/taxonomy.ts` |
| Matching | `lib/match.ts` |
| Who may enter which level | `lib/journey.ts` |
| What they're building (landing, open founder pages) | `lib/building.ts` |
| Link normalising | `lib/links.ts` |
| Research pipeline | `scripts/research/`, `data/research/` |

## Rules that must not drift

- **Role comes from the email domain** (`lib/roles.ts`): `@forge27.mesaschool.co` is a founder, `@mesaschool.co` is the team, plus the few reviewers outside Mesa named one by one in `TEAM_GUESTS`. On the team only the reviewers and the super admin (`chandu@mesaschool.co`) act (`lib/staff.ts`); a reviewer answers their own group (the Reviewer column); only the super admin edits the bank and reopens a deadline. Everyone else at Mesa only looks. A founder must also be in `cohort` (`lib/students.ts`): on the roster, with a photo. Identity in every action comes from the session, never from input.
- **Every server action follows the same order:** viewer, then role, then Zod, then ownership, then write, then event, then revalidate. The archetype is scored on the server from the answers. The browser never says what someone is.
- **Columns are read by header name** (`lib/sheet/tabs.ts`). A missing header throws, naming the column, rather than reading as empty.
- **Concurrency without locks.** Events and Problem history are append-only. The hackathon itself is one row a founder in the Hackathon tab and one in the Submissions tab (`lib/data/hackathon.ts`), and each founder writes only their own rows, in place. Every founder gets a Submissions row up front (`sheet:init`), so two quick saves never both append one. Where a problem stands (in review, approved, with changes, rejected) is read from Problem history, never from the row: the newest version's newest answer.
- **Three tabs are made for a person to read.** Hackathon is the overview: name, email, group, reviewer, POC, a Status dropdown (`lib/status-words.ts`), Progress, the problem's name, Reopened, and the bank's number for a bank pick in the last column. Submissions is everything handed in: name, email, group, the problem's name, the research links, then each stage's links and when it was submitted, in the order they are due. `write` in `lib/data/hackathon.ts` sends each cell to the tab that has its column. No ids and no blobs go into either. The site writes Status and Progress; the team writes Group, Reviewer and POC. Problem history holds one line for every version sent and every answer, with the notes. `pnpm sheet:init` keeps all three formatted: header bold, rows regular, every column wrapped. Every other tab is hidden in the Sheet; the site reads and writes hidden tabs the same, but a renamed tab or header breaks it. The only in-place writes are a founder's own row and a problem row. A founder's number is the rank of their first `arrived` event, which is why two people arriving in the same second can't collide.
- **Problem IDs are frozen** once founders can see them. A founder is only offered a problem that is `approved` and has a 2-day version (Task, Expect, Further): `isOpen` in `lib/data/problems.ts`. Any status the app doesn't recognise reads as `draft`.
- **The team's data never reaches a founder:** track, the H1 outcome and level, prior work, team notes, other founders' picks, a problem's difficulty and signal, and `Problems internal`. Data that crosses to the browser is built field by field (`forFounder`, `cardFor`). The leak test greps the built client chunks, and seed JSON is imported only from `server-only` modules.
- **No tracks.** Every founder gets the same pool. The app reads only the columns in `lib/sheet/tabs.ts`; nothing else belongs in the Sheet.
- **Matching is deterministic** (`lib/match.ts`), for the bank only: industries carry the most weight, then what they want to build with, then who for. A founder sees 4 at a time, in a fixed mix of levels (`MIXES`): the first 4 are 1 easy, 2 medium, 1 hard; Show 4 others gives 2 easy, 1 medium, 1 hard; pressing it again gives 2 easy, 2 medium, and that is the last set (`matchSets`). No set repeats a problem from an earlier one, the sets are the same every time, and a founder can go back and pick from any of the 12. The level is never shown to a founder.
- **A problem's headline is its 2-day challenge**, with what is broken under it, on every screen: the student's cards, sheet and build page, and the team's board, picks and bank (`buildingOf`, `forFounder`). The old title and the old open challenge stay in the Sheet for the record and are shown only for a problem with no 2-day version.
- **Difficulty means how hard a problem is to build in 2 days**, alone, with n8n and Claude Code. Only problems with a 2-day version are Live; the rest are archived, kept for their evidence.
- **Two verbs: a problem is sent, a stage is submitted.** A step on the home opens its form (Add my links); the form's button submits that stage. A founder never gets an empty screen: the gentle fallback fills in and says so.
- **A founder's own problem is reviewed.** Sending it (`submitProblem`) appends a version; a reviewer answers the newest version in the console (`review`): Approved, Approved with changes, or Rejected, the last two always with a note. A founder may change and send it again as often as they like until `problemsClose`; after it, a founder with nothing sent or a rejected problem has until `problemsExtended` (`problemWindow` in `lib/steps.ts`, used by every screen and the server). Approved and Approved with changes both open the stages (`mayBuild`). After the window nothing can be sent, but a pending one is still answered.
- **The bank is the fallback.** It opens at `bankOpens` and only to a founder with nothing sent or a rejected problem (`mayUseBank`). A problem still in review waits for its answer, and nothing tells the founder otherwise; to move one to the bank anyway, the team rejects it in the console. There is no own idea from the bank. A bank problem is final the moment it is picked; the sheet says so before the button. A bank pick still adds its own research. Only the team can undo a pick, by clearing the Problem and Problem no. cells.
- **Closed before it opens.** Until `opens`, `app/(founder)/layout.tsx` shows every founder one screen saying when it opens, and every founder action refuses (`guarded`).
- **Every deadline is hard but one.** The problem and each stage lock at their own time (`phaseAt(...).locked`); the MVP scope (`SOFT_STAGES`) is due but never locks, unless the founder's Reopened cell names that step (the super admin's Reopen switch on a founder's page writes it); a founder who missed one talks to Pragati or the Forge team. Fields save in place as they are filled; submitting a stage stamps its time, and after that a field can change until the deadline but a required one cannot be emptied. Shared doc and Drive links are checked and the founder is warned if they are not open to everyone.
- **Every date of the event is in `lib/hackathon.ts`.** Only mock mode may move the clock (`PLAN_NOW`, or `POST /api/mock/reset?now=`).
- **A founder's group, reviewer and POC are the Group, Reviewer and POC cells of their row.** They come from the team's workbook (`pnpm data:groups` writes `data/groups.json`, `pnpm sheet:groups` fills empty cells); the app reads them and never writes them. The POC is their point of contact at Mesa, shown to them as Your POC. The workbook's Mentor and Pitch evaluator columns are not used.
- **Who did what is recorded.** Problems Edited by holds the team member's email; Events logs every action.
- **A founder page opens to the cohort** once that founder has a problem to build, and then with only the live link and the repo of what they sent. The deck, the post, the video and the team panel are the founder's and the team's. Otherwise it is a 404 for anyone else.
- **Six archetypes, three families.** The family is the Hackathon 1 class and keeps its portrait (`public/art/`). The card and the wall's flip side show the full figure, never a crop. The wall only shows founders who have an archetype. The second-strongest axis splits it. Ties break experiment, understand, structure. `pnpm test:archetype` must stay at 117/117.
- **Mock mode** needs `MOCK_BACKEND=true` and a deploy that is not Vercel production (`lib/store/mode.ts`).
- **Copy:** second person, short. No decorative quote or comma glyphs anywhere. The fixed lines in `docs/PRODUCT.md` are the owner's, so use them verbatim.

## Copy

Copy is as important as the design. Every string is written to `docs/VOICE.md`.

- Every string lives in `content/copy.ts`. The copy lint (`tests/unit/copy.test.ts`, run by `pnpm test:unit`) fails the build on:
  - banned words;
  - buttons of 24 characters or more;
  - headings over 8 words;
  - stray exclamation marks or decorative quotes;
  - images without alt text;
  - any word written directly into a component.
- What we expect is a list of bullets (`components/problem/Bullets.tsx`), never a paragraph. The floor for every build is `problem.everyone` in the copy, and is the owner's wording.
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

- **The founder card is the progress bar.** Every level adds a layer. Change what the card shows in `lib/card.ts`, not in the component. One finish, `picked` (violet, with foil), for any pick. The bottom line is always the archetype's identity line, never the bio or the problem.
- **One progress bar.** Levels with questions report to it through `setLevelProgress` (`components/shell/progress.ts`), so the current segment fills; never add a second bar. The onboarding shows no logo. Founders never get a sign-out at all; the team signs out from the account menu (`components/shell/Account.tsx`).
- **Nothing a founder sees ranks a problem.** Difficulty (easy, medium, hard) and signal never reach a founder's browser; difficulty still pitches matching, and the team sees it in the bank and the queue. Rarity survives only as the research pipeline's input, mapped by `DIFFICULTY_OF_RARITY`.
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
