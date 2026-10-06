# ForgeX 2.0 Bets — setup

Everything the owner has to do, in order. Steps A to D are once. Step E is the
rehearsal before you share the link. Step F is how you run it during the 17 days.

The app never writes anywhere except the Google Sheet, and the Sheet is the only
admin panel. There is no admin screen in the app, by design.

---

## A. Turn the spreadsheet into a Google Sheet

1. Upload `data/ForgeX_2.0_Problem_Bank.xlsx` to Google Drive with your
   mesaschool.co account.
2. Right-click it, choose **Open with → Google Sheets**, then
   **File → Save as Google Sheets**. Use only this copy from now on.
3. In the **Problems** tab, type one header in `O1`: `Bet by`. That is the only
   column the app writes, and it holds the bettor's name. The script adds the
   header itself if it is missing.

   Who that person is and when they bet is not duplicated here: the **Bet log**
   tab already records the email and the timestamp of every bet, move and
   release, and the app reads them from there.
4. Add a tab named **Bet log** with headers `Timestamp`, `Action`, `Email`,
   `Name`, `Problem ID`, `Previous problem ID` in `A1` to `F1`. The script
   creates this tab too if it is absent.
5. The app also writes two more tabs, **Profiles** and **Challenges**. You do
   not have to create either: the script adds them with their headers the first
   time it needs them. What they hold is in step F.
6. Optional, and worth it: select `A2:O213`, open
   **Format → Conditional formatting**, choose "Custom formula is" with
   `=$O2<>""`, and pick a light fill. Taken rows then stand out at a glance.
7. Do not rename the Problems tab, its headers, or the problem IDs. The app
   reads every column by header name, so the order of columns can change but the
   names cannot.

---

## B. Deploy the Apps Script web app

1. In the Sheet, open **Extensions → Apps Script**. Delete the sample code and
   paste the whole of `apps-script/Code.gs`.
2. Open **Project Settings → Script properties** and add two:
   - `SHARED_SECRET` — a long random string. Generate one with
     `openssl rand -hex 32`. Keep it for step D.
   - `BETS_CLOSE_AT` — when betting closes, ISO 8601 with the offset, for
     example `2026-10-22T23:59:00+05:30`. Use the same value in Vercel.
   - `MAX_CHANGES` — optional, defaults to 3. How many times a student may
     change their pick after their first one. Change it here and it takes effect
     at once, with no deploy.
3. Click **Deploy → New deployment**, choose **Web app**, set
   **Execute as: Me** and **Who has access: Anyone**, then **Deploy** and
   approve the permissions Google asks for.
4. Copy the URL that ends in `/exec`. That is `APPS_SCRIPT_URL`.

   "Anyone" is needed because the website's server calls the script without a
   Google login. The shared secret is what keeps everyone else out: a request
   without it gets `{"ok":false,"error":"unauthorized"}` and nothing else.

5. After any change to the script, use
   **Deploy → Manage deployments → Edit → Version: New version → Deploy**.
   The URL stays the same.

---

## C. Create the Google sign-in

1. At console.cloud.google.com, signed in with your mesaschool.co account,
   create a project called `ForgeX Bets`.
2. In **Google Auth Platform** (older menus call it **OAuth consent screen**):
   - If forge27.mesaschool.co accounts live in the same Google Workspace as
     mesaschool.co, choose **Internal**.
   - If they are a separate Workspace, choose **External** and publish to
     production. The basic email and profile scopes need no verification, and
     the domain check in the code keeps everyone else out. Do not stay in
     testing mode: that caps you at 100 users and you have 119 students.
3. Under **Clients**, create an **OAuth client ID** of type **Web application**:
   - Authorized JavaScript origins:
     `http://localhost:3000` and `https://forge.mesaschool.co`
   - Authorized redirect URIs:
     `http://localhost:3000/api/auth/callback/google` and
     `https://forge.mesaschool.co/api/auth/callback/google`
   - After the first Vercel deploy, add the `*.vercel.app` URL to both lists.
4. Copy the client ID and the client secret.

---

## D. Deploy on Vercel

1. Push this repo to GitHub. On vercel.com choose **Add New → Project** and
   import it. Vercel detects Next.js and pnpm on its own.
2. Add these environment variables:

   | Name                 | Where it comes from                             |
   | -------------------- | ----------------------------------------------- |
   | `AUTH_SECRET`        | `npx auth secret`, or `openssl rand -base64 32` |
   | `AUTH_GOOGLE_ID`     | step C                                          |
   | `AUTH_GOOGLE_SECRET` | step C                                          |
   | `APPS_SCRIPT_URL`    | step B, the `/exec` URL                         |
   | `APPS_SCRIPT_SECRET` | step B, the same value as `SHARED_SECRET`       |
   | `BETS_CLOSE_AT`      | the same value as the script property           |
   | `MOCK_BACKEND`       | `false`                                         |

3. Deploy. Then in **Settings → Domains** add `forge.mesaschool.co`, and add a
   CNAME record in Mesa's DNS from `forge` to `cname.vercel-dns.com`.
4. Go back to step C.3 and add the Vercel preview URL to the OAuth client, so
   preview deployments can sign in too.

---

## E. Test before sharing

Do this with two student accounts and one mesaschool.co account.

1. Student A signs in and bets on a problem. Check the Sheet: that row's
   `Bet by` fills in with their name, and a `bet` row appears in **Bet log**
   with their email and the time.
2. Student B sees the stamp and the name within 15 seconds without reloading,
   and the button on that problem is dead and reads "Backed by {name}".
3. Student A opens another problem and presses **Move my bet here**. The old row
   clears, the new row fills, and Bet log gains a `move` row with the previous
   problem ID.
4. Student A presses **Take it back**. The row clears and Bet log gains a
   `release` row.
5. A mesaschool.co account sees the bettor's name, email and bet time, and has
   no button to press anywhere.
6. A personal Gmail is refused at sign-in and lands on the refused screen:
   "That's not a Mesa account." with a **Try another account** button.

### The onboarding flow

7. Sign in as a student who has never used the site. You should land on
   **Act 1 of 5**, not on the board — the board turns away anyone who has not
   answered yet.
8. Walk the five acts. Act 1 shows what the cohort sheets know about them;
   correct a field and check it sticks. Acts 2 to 4 ask for industries, a
   focus and tool comfort. Act 5 deals four problems, each listing the answers
   that earned it.
9. Check the **Profiles** tab: one row for that student, with their answers as
   ids and a `Completed at` time.
10. Press **None of these are mine** and send in a problem statement — three
    fields: the problem, the industry, and why them. Check the **Challenges**
    tab: one row, `Status` of `pending`.
11. Type `approved` in that row's `Status` and something in `Reviewer note`.
    Within about five minutes the student sees it on `/me` as **Approved** with
    your note. To see it at once, redeploy or wait out the cache.

---

## F. Running it during ForgeX

- **To free a problem by hand**, clear its `Bet by` cell. The site picks that up
  within about ten seconds, and the problem is open to everyone again.

  This does **not** refund the student a change. Changes are counted from the
  **Bet log**, not from the Problems tab, so their next pick still costs one.
  That is deliberate: nobody can get extra picks by asking you to clear a cell.

- **To genuinely give a student a change back**, after clearing the cell, delete
  that student's most recent `bet` or `move` row from the **Bet log**. That is
  the only thing the count reads. Do this only to correct your own mistake: the
  Bet log is the record of what happened, and every row you remove is a piece of
  that record gone.
- **To approve somebody's own problem statement**, open the **Challenges** tab.
  Each row is one submission: their email, the industry they picked, the
  problem, why them, a `Status` and a `Reviewer note`. Type one of `approved`, `changes` or
  `declined` into `Status`, and write the why in `Reviewer note`. The student
  sees both on their profile.

  Anything else in that cell — a typo, a half-typed word, your own shorthand —
  reads as **pending**, on purpose. A misspelt `aproved` must never look to a
  student like permission to start building.

  The tab is append-only, like the Bet log. One submission each: this is the
  idea a student wants to spend seventeen days on, not a pitch round, and three
  attempts only ever produced three thin ones instead of one considered one.

- **An approved challenge does not take a problem off the board**, and it does
  not spend one of their three changes. If you want them to also stop holding a
  listed problem, clear its `Bet by` cell as above and tell them.

- **The Profiles tab** has one row per student: their answers, anything they
  corrected about themselves, and when they finished. Editing a row by hand is
  safe — the app reads it by header name like everything else — but their
  answers drive what gets recommended, so it is usually better to ask them to
  change it themselves from `/me`.

- **To change the deadline**, update `BETS_CLOSE_AT` in both the script
  properties and the Vercel environment variables, then redeploy on Vercel.
  Both are checked, so the earlier of the two wins in practice.
- **To see who has what**, read column `O` of the Problems tab: the name of
  whoever holds each problem, and empty where it is still open. For emails and
  times, read the Bet log.
- **If the site shows "Bets are paused for a minute"**, Apps Script is not
  answering. Browsing still works from a local snapshot of the problems. Open
  the Apps Script editor and check the execution log; usually it is a quota
  blip and resolves itself.

---

## Running it locally

```sh
pnpm install
cp .env.example .env.local        # AUTH_SECRET can be anything in mock mode
pnpm dev                          # http://localhost:3000
```

With `MOCK_BACKEND=true` there is no Google and no Sheet: the login screen
offers two students and one team member, and bets live in memory until the
server restarts. That is the mode the tests run in.

To point a local copy at the real Sheet, set `MOCK_BACKEND=false` and fill in
`APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET`, `AUTH_GOOGLE_ID` and
`AUTH_GOOGLE_SECRET`. Sign-in then goes through Google for real, so
`http://localhost:3000` has to be in the OAuth client from step C.

```sh
pnpm test        # Playwright, mock mode, builds first
pnpm lint
pnpm typecheck
pnpm build
```

### Regenerating the local data

```sh
pnpm data:problems   # data/problems.json from the xlsx, columns A to N
pnpm data:students   # data/students.json and public/students/*.webp
pnpm data:profiles   # data/profiles.json from the cohort exports
```

`pnpm data:students` reads `data/Emails.xlsx` and the portrait repo at
`data/the-117-c1`. Both outputs are committed, so you only need this if the
roster changes.

`pnpm data:profiles` builds what Act 1 shows a student about themselves. Put
the cohort exports in `data/` — it looks for filenames containing
*segmentation*, *readiness* or *evidence book*, and *curation* — and run it. It
joins on the forge email where there is one and on the name where there is not,
prints every row it could not place, and never writes anything but
`data/profiles.json`.

It imports facts and the students' own words: family business, prior work,
degree, the industry they said they want to build in, and their own answer to
what they are good at. It does **not** import the assessment columns that sit
beside them in the same sheets — segmentation, confidence, top-student and
priority-pool flags, readiness tiers, gaps, Sherpa and mentor notes, or
anything financial — and it aborts the run if a mapping ever reaches for one.
Everything in that file is shown back to the student it describes, which is the
whole reason for the line.
