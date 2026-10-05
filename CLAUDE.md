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

## How state flows

- The grid is a Server Component. Filters live in the URL and are applied on the
  server, so the browser never receives all 212 problems.
- **The modal is pure client state** (`components/ModalState.tsx`). It holds the
  open problem ID, mirrors it into the URL with `history.pushState`, and fetches
  the detail from `GET /api/problem/[id]`. This is deliberate: a router
  navigation that unmounts the open dialog stalls and never commits, so opening,
  closing and the arrow keys deliberately avoid the router.
- Bet state lives in `components/BetsProvider.tsx`: seeded from the server,
  polled from `GET /api/bets` every 15 seconds and on window focus, and updated
  optimistically for the viewer's own actions with a rollback on any error.
- Only `components/CardBet.tsx` re-renders when a stamp arrives. The cards
  themselves stay server rendered.
- `lib/problem-cache.ts` holds problem detail for the session. Cards warm it on
  hover and focus, so the modal almost never shows its skeleton.

## Rules that must not drift

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

`MOCK_BACKEND=true` swaps the Sheet for an in-memory store with the same rules
(`lib/backend/mock.ts`) and adds a credentials provider to the login screen
listing two students and one team member. `POST /api/mock/reset` clears the
board and exists only in mock mode. The whole UI and the whole test suite run
without Google or the Sheet.
