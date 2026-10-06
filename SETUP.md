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
- shows mock sign-in buttons on `/login`;
- `POST /api/mock/reset` puts that memory back to the seed.

Mock mode never runs on a Vercel production deploy, whatever the flag says.

## 2. Environment variables

| Name | What it is |
| --- | --- |
| `AUTH_SECRET` | Run `npx auth secret` and paste the result |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | The OAuth client from Google Cloud Console |
| `SHEET_ID` | The Sheet's ID, from its URL |
| `GOOGLE_SA_EMAIL` | The service account email |
| `GOOGLE_SA_KEY` | The `private_key` from the service account JSON, `\n` escapes included, in quotes |
| `PICKS_CLOSE_AT` | When picks lock: `2026-10-15T23:59:00+05:30` (15 Oct, 11:59 pm IST) |
| `RESEND_API_KEY`, `EMAIL_FROM` | Response emails. Optional; without them nothing is sent and nothing breaks |
| `NEXT_PUBLIC_SITE_URL` | The public URL, for example `https://forgex.mesaschool.co`. Used in email links |
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
pnpm sheet:sync        # after a bank rewrite: rewords problems nobody on the team has edited
```

Neither script overwrites a cell you've edited or removes anything.

**What each tab holds:**

| Tab | What it holds |
| --- | --- |
| Founders | One row per founder: profile, archetype, answers, level, status. `Track` and the `H1` columns are team only |
| Problems | The bank. Only rows with `Status` set to `approved` reach founders. Anything else reads as a draft |
| Problems internal | Evidence, scores, why now and existing players, for the team |
| Picks | Every why, append-only |
| Responses | Every answer from the team, append-only |
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

## 7. Email, when you want it

1. Create a Resend account and verify a sending subdomain, such as `mail.mesaschool.co`.
2. Set `RESEND_API_KEY` and `EMAIL_FROM` (for example `ForgeX <forgex@mail.mesaschool.co>`) in Vercel.
3. Each response then emails the founder a link to their page. The `Emailed at` cell in Responses records it.

## 8. Photos and the roster

| What | Where | How to update |
| --- | --- | --- |
| Photos | `public/students/<slug>.webp`, joined in `data/students.json` | Run `pnpm data:students` after updating `data/Emails.xlsx` and `data/the-117-c1/` |
| Cohort | Founder-domain rows that have a photo | Adding a photo brings that founder in |
| A new founder | — | Run `pnpm sheet:init` to append their row |

## 9. Running ForgeX day to day

| Task | Where |
| --- | --- |
| Answer whys | `/team/queue`, oldest first. `G` Go, `W` Go with a tweak, `L` Let's talk, `A` Try another, `N` note, `⌘↵` send |
| See everyone | `/team`, with CSV export |
| A founder's page | `/f/<slug>`, which shows the team-only panel to you |
| Close picks | Change `PICKS_CLOSE_AT` and redeploy |
| Undo a response | Delete its row in Responses, then set the founder's `Status` cell to match their latest remaining response, or `waiting` |

## 10. Checks before launch

```sh
pnpm lint && pnpm typecheck && pnpm test:unit && pnpm test:archetype && pnpm build && pnpm test
```

`pnpm test` builds and runs the Playwright suite in mock mode, including a check that no roster email reaches a browser.

`/lab` holds the three design directions, the component sheet and the relic renderer (`pnpm art:relics`). It returns 404 in any production build, so it is safe to leave in place.
