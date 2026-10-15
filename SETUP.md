# Setup

Step by step, for the owner. Everything you need to run ForgeX 2.0 from scratch.

## What already exists

These are done:

| Item | Detail |
| --- | --- |
| Google Sheet | `1fGHRTEQpMm0VAuVYX-QS_09oEKcsereDY3UBmLsJ20w`, with all six tabs and 117 founders seeded |
| Service account | `forgex@forgex-510705.iam.gserviceaccount.com`, an Editor on that Sheet, with the Sheets API enabled in project `forgex-510705` |
| Google sign-in client | The existing OAuth client, reused |
| Code | `github.com/chaaandu/ForgeX`, branch `forgex-2` |

What is left: Vercel, the domain, the OAuth redirect URIs, email, and approving the problem bank.

## 1. Run it locally

```sh
pnpm install
cp .env.example .env.local   # then fill it in, see below
pnpm dev                     # http://localhost:3000
```

Set `MOCK_BACKEND=true` in `.env.local` to run without Google or the Sheet. Mock mode:
- uses an in-memory copy of the Sheet;
- shows mock sign-in buttons on `/login`: Aarav (placed in Hackathon 1), Diya (takes the quiz), Aadishwar and the team;
- A fresh dev server starts with 24 demo founders who have picked a problem, 9 of whom have sent their build, so the landing's **What they're building** and the console have something to show. They are placeholder picks on real names, in memory only, never in the Sheet.
- `POST /api/mock/reset` puts that memory back to a clean seed (what the tests use). `POST /api/mock/reset?demo=1` brings the demo founders back.
- The clock can be moved, to see the event at any hour. Start with `PLAN_NOW=2026-10-21T14:00:00+05:30`, or move it while running: `curl -X POST 'localhost:3000/api/mock/reset?now=2026-10-23T13:05:00%2B05:30'`.
- On the live site the section is always there; until the first pick it says so.

Mock mode never runs on a Vercel production deploy, whatever the flag says.

## 2. Environment variables

| Name | What it is |
| --- | --- |
| `AUTH_SECRET` | Run `npx auth secret` and paste the result |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | The OAuth client from Google Cloud Console |
| `SHEET_ID` | The Sheet's ID, from its URL |
| `GOOGLE_SA_EMAIL` | The service account email |
| `GOOGLE_SA_KEY` | The `private_key` from the service account JSON, `\n` escapes included, in quotes |
| `NEXT_PUBLIC_SITE_URL` | The public URL, for example `https://forgex.mesaschool.co.in`. Used in links |
| `MOCK_BACKEND` | `false` everywhere except your laptop |

**Keep the service account key out of git and out of chat.** It lives only in `.env.local` and in Vercel. The key was pasted into a chat during setup, so once the site is live:
1. Create a new key in Google Cloud Console under IAM, Service accounts, `forgex`, Keys.
2. Update Vercel with the new key.
3. Delete the old key.

## 3. Google sign-in

In Google Cloud Console, open the existing OAuth client (APIs & Services, Credentials). Under **Authorised redirect URIs**, add:

```
http://localhost:3000/api/auth/callback/google
https://<your-domain>/api/auth/callback/google
https://<your-vercel-project>.vercel.app/api/auth/callback/google
```

Who can get in depends only on the email domain:

| Domain | Role |
| --- | --- |
| `@forge27.mesaschool.co`, on the roster with a photo | Founder |
| `@mesaschool.co` | Team |
| Anything else | Refused, with a message |

## 4. The Sheet

```sh
pnpm sheet:init        # tabs, headers, any founder not yet listed. Safe to re-run.
pnpm sheet:problems    # adds the research bank as drafts. Safe to re-run.
pnpm sheet:hackathon   # adds new problems as drafts, and each problem's 2-day version where those cells are empty. Safe to re-run.
pnpm sheet:sync        # after a bank rewrite: rewords problems nobody on the team has edited
pnpm sheet:migrate     # once, on a Sheet made before tracks: renames Rarity to Difficulty, fixes Track cells. Safe to re-run.
pnpm sheet:approve --by you@mesaschool.co [--write]  # approves every draft at once, logged under your name. Without --write it only counts.
```

None of the first three overwrites a cell you've edited or removes anything. `sheet:migrate` rewrites only the Difficulty column and any Track cell that differs from `data/students.json`, and prints each Track it changes.

**What each tab holds:**

| Tab | What it holds |
| --- | --- |
| Founders | One row per founder: profile, archetype, answers, level, status. `Track` and the `H1` columns are team only. `Track` is `autonomous` (no matches, writes their own), `structured` (hard and medium problems) or `guided` (medium and easy); anything else counts as structured |
| Problems | The bank. Only rows with `Status` set to `approved` reach founders. Anything else reads as a draft. `Difficulty` is `easy`, `medium` or `hard`, and founders never see it. `Edited by` and `Edited at` record the last team change |
| Problems internal | Evidence, scores, why now and existing players, for the team |
| Picks | Every why, append-only |
| Responses | Every answer from the team, append-only. `Author` is the teammate's email |
| Events | The audit log |

**Editing by hand:**
- Columns are read by header name, so reorder or add columns freely.
- Never rename a header. The app fails loudly if one goes missing.
- Problem IDs (`P001`…) must never change once founders can see them.

## 5. Approve the problem bank

1. Sign in with a `@mesaschool.co` account.
2. Open `/team/bank`.
3. Read each draft. Use `Y` to approve, `R` to reject, `E` to edit, and `J`/`K` to move. The evidence and scores sit beside each problem.
4. Nothing reaches a founder until it is approved. "Approve all drafts" exists for after a full read-through.

## 6. Deploy to Vercel

1. Import `github.com/chaaandu/ForgeX` into Vercel. The framework is Next.js and the package manager is pnpm.
2. Add every variable from section 2 to **Production** and **Preview**, with `MOCK_BACKEND=false`.
3. Deploy, then add your domain under Settings, Domains, and point DNS as Vercel tells you.
4. Add the domain's redirect URI to the OAuth client (section 3).

**Before go-live:** run `pnpm sheet:migrate --dry`, read what it says, then `pnpm sheet:migrate`, `pnpm sheet:init` and `pnpm sheet:groups`, in the same hour you deploy this version. The last one fills Group, Reviewer and POC from `data/groups.json`. It renames Rarity to Difficulty, and lays the Hackathon tab out in its new, shorter set of columns, moving every filled cell with its header. It refuses if a column it would drop still holds anything. `sheet:init` then adds the Submissions and Problem history tabs with a row for every founder, formats all three, and hides every other tab. The old site cannot read the new layout, so do not run it ahead of the deploy.

## 7. The hackathon's times

Every date is in `lib/hackathon.ts`, not in Vercel. Change one there and redeploy; `/team/setup` shows them as the site reads them.

| Time | Now set to | What it does |
| --- | --- | --- |
| Opens | Thu 15 Oct 2026 | The portal opens to founders. Before it, a founder who signs in sees the day it opens and nothing else. No hour is shown |
| Problems close | Tue 20 Oct, 11:59 pm IST | Nobody can send or resend a problem. Ones already sent are still answered |
| Bank opens | Wed 21 Oct, 12 am IST | Anyone without an approved problem picks one of ours |
| MVP scope | Wed 21 Oct, 11:59 pm IST | One Doc. Due then, but it never locks: one sent late is still taken, and marked late |
| Prototype | Thu 22 Oct, 1 pm IST | GitHub repo, prototype link, proof of progress |
| Launch | Thu 22 Oct, 7:30 pm IST | Vercel live link, LinkedIn post, documentation |
| Pitch | Fri 23 Oct, 1 pm IST | Pitch deck and a Loom of at least 5 minutes |

Each one but the MVP scope locks for everyone not reopened for that step.

## 8. Photos and the roster

| What | Where | How to update |
| --- | --- | --- |
| Photos | `public/students/<slug>.webp`, joined in `data/students.json` | Run `pnpm data:students` after updating `data/Emails.xlsx` and `data/the-117-c1/` |
| Cohort | Founder-domain rows that have a photo | Adding a photo brings that founder in |
| A new founder | — | Run `pnpm sheet:init` to append their row |

## 9. Running ForgeX day to day

Only the reviewers and `chandu@mesaschool.co` can answer problems, and only `chandu@mesaschool.co` edits the bank or reopens a deadline. Anyone else with a Mesa email can look. Reviewers are named in `lib/staff.ts`. Saurabh and Ebrahim sign in with their @mesaschool.co addresses. Param signs in with param@joinsquareup.com, which `lib/roles.ts` lets in by name; any other reviewer from outside Mesa goes in both files. Someone outside Mesa can only use Google sign-in if the OAuth consent screen's user type is External, not Internal.

| Task | Where |
| --- | --- |
| Groups, reviewers and POCs | They come from the Mentor groups tab of the AI Hackathon 2 workbook. After a change there, run `pnpm data:groups "/path/to/AI Hackathon 2.xlsx"`, then `pnpm sheet:groups`, which fills only empty cells. Or type straight into the `Group`, `Reviewer` and `POC` columns. Reviewer must read Saurabh, Param or Ebrahim |
| Answer problems | `/team/reviews`: what is waiting, oldest first, with every earlier version and answer. A reviewer sees their own students, and **Everyone** shows the rest. Approve, Approve with changes or Reject; the last two need a note, which the founder sees |
| Every version and answer | `/team/history`, sortable by time or name, or the `Problem history` tab in the Sheet |
| How far everyone has got | `/team`: status and progress for every founder. Each link icon opens it; hover anything cut short to read it in full. **Export CSV** has every link |
| Put it on the projector | `/team/screen`: the count for the next deadline, the time left, and faces |
| What people picked | `/team/picks`: bank problems with who is on them, and approved own problems |
| A founder's page | `/f/<slug>`, which shows the team-only panel to you |
| Let someone in after a deadline | Open their page and press **Reopen** for that step. Only deadlines that have passed are shown. Press **Close** to shut it again. Or write the step in their `Reopened` cell, like `Launch` |
| Put a problem in the bank | `/team/bank`: it must be **Live** and have a 2-day version |
| See it all in the Sheet | `Hackathon`: who everyone is and where they stand. `Submissions`: every link each founder has handed in, with when. `Problem history`: every version and answer. Filter the first two freely, but do not sort or insert rows while the event runs, because the site writes to rows by position. `Problem history` only ever gets new lines, so sorting it is safe |
| Let a founder pick from the bank again | Clear `Problem` and `Problem no.` on their `Hackathon` row |
| Undo a stage submission | Clear its `… at` cell in `Submissions` (Scope at, Prototype at, Launch at or Pitch at); the links stay |

## 10. Checks before launch

```sh
pnpm lint && pnpm typecheck && pnpm test:unit && pnpm test:archetype && pnpm build && pnpm test
```

`pnpm test` builds and runs the Playwright suite in mock mode, including a check that no roster email reaches a browser.

`/lab` holds the three design directions, the component sheet and the relic renderer (`pnpm art:relics`). It returns 404 in any production build, so it is safe to leave in place.
