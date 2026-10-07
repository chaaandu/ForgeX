# Build plan

From 7 Oct 2026, this replaces the problem bank, matching, Your world, Your why and the four team replies. Where PRODUCT.md or ARCHITECTURE.md disagree with this file, this file wins.

## The challenge

One open problem for all 117 founders:

> Most small businesses in India still run on WhatsApp, phone calls and a notebook. Orders get missed, credit goes unwritten, and at the end of the day the owner can't say what sold or who owes them. Pick who you're building for. Find out where it really breaks. Build what fixes it.

There is no niche list and no cap. Each founder names who they're building for in their research, in their own words. It shows on their profile and on the landing.

## Tracks

Founders never see a track's name or a level. Their plan simply differs.

| | Guided (42) | Structured (45) | Autonomous (30) |
| --- | --- | --- | --- |
| Builds | One core flow that fixes what they found | 2 or 3 connected flows, plus a view the owner checks daily | A full product with AI at the centre, plus 2 stretch features they choose |
| Has | Google sign-in, real data, works on a phone | Plus staff access, a UPI link, and tests | Plus many shops kept apart, AI measured on 50 messages, error monitoring |
| Real users | 1 owner | 3 owners, through 30 Oct | 5 or more, with numbers |
| AI | Optional extra | Optional extra | Claude API for those with keys, Gemini for the rest |
| Help | The starter's 15 build cards, a pod and a peer mentor | Direction in each step | Occasional |

Guided founders sit in 5 pods with daily standups, each with a peer mentor from the autonomous volunteers.

## Calendar

All in `lib/plan.ts`. The workshops are fixed.

| Date | What |
| --- | --- |
| Fri 9, Sat 10 Oct | Research. Figma introduction on Sat 10 (optional) |
| Sun 11 Oct | Building opens for anyone who has sent research |
| Tue 13 Oct | Workshop: Cursor and GitHub Copilot |
| Fri 16 Oct, 6 pm | Stop 1 · Prototype |
| Wed 21 Oct | Workshop: Google Cloud Console and Supabase |
| Fri 23 Oct, 6 pm | Workshop: Vercel. Stop 2 · Live product |
| Mon 26 Oct, 6 pm | Stop 3 · Real users and demo |
| Tue 27 to Fri 30 Oct | Keep building. 1:1 check-ins with Pragati and Chandu |
| Mon 2 Nov | Venture building, for those who committed to tech and AI |

## Founder flow

1. **Onboarding, as before:** landing, sign in, arrive, archetype, profile.
2. **The challenge:** the statement, set to land on a phone. One button: Start your research.
3. **Research**, days 1 and 2:
   - secondary: 3 apps owners use and what they get wrong, plus anything read online;
   - primary, if they can: 1 or 2 owners, each as one short entry;
   - in their own words: who it's for, the problem in 3 lines, the moment it breaks.

   It saves as a draft. Sending it opens the plan, with nobody approving it. It stays editable.
4. **Today**, home from then on:
   - the day number and a countdown to the next stop;
   - the team's fix list, as ticks;
   - still open: anything overdue;
   - today's steps, or the next day's when today has none;
   - workshop and check-in notices.
5. **Plan:** every step to 30 Oct, by week and day, with workshops and tools. Work ahead freely.
6. **Each step:** a tick, the tool, what to do, what done means, a bakery example, the build card for guided founders, and a field when the step asks for a link or an answer. Steps that ask for something won't tick without it.
7. **Stops:** exactly the fields their track's table asks for, filled in from their steps' links. Drafts save. Editable until 6 pm, then locked. If never sent, it can be sent once, flagged late. The team's rating shows as words, with notes and fixes.
8. **Stuck? Message the team:** on every step, 3 lines at most, with an optional Google Drive screenshot link. Replies come back in the thread and by email.
9. **Profile:** their portfolio. Who it's for, the problem, the moment, the live app, the code, the design, the demo, steps done and the 3 stops. It opens to the cohort once research is sent.
10. **Pod**, for mentors only: their pod's founders, today's steps and how far behind. No ratings, no messages.

## What each stop asks for

Defined field by field in `content/plan.ts` (`STOP_FIELDS`).

| Stop | Everyone | Guided | Structured | Autonomous |
| --- | --- | --- | --- | --- |
| 1 · Prototype | Repo, live link, sketches or Figma (optional). Research is already in | Which screen first, and why | How many of 10 real examples work | Architecture note, 2 stretch features |
| 2 · Live product | Live link, sign-in works, real data, what an owner can do | Did you add AI (optional) | Did you add AI (optional) | Accuracy on 50 messages, which stretch shipped |
| 3 · Real users | Live link, repo with README case study, 3-minute demo video, owners using it, what they did | | | |

## Team console

- **Founders:** track, pod, who they're building for, steps done against due, how far behind, the 3 stops, and who is waiting on a reply. Filter by track, pod, behind and waiting. CSV export.
- **Messages:** waiting on us first, oldest first. Reply in the thread.
- **Stops 1, 2, 3:** filter by track, pod and rating. Rate green, amber or red with notes and a fix list. The reviewer and the time go into Reviews and Events. Amber means a fix list and a check-in within 2 days; red means a 1:1 the next day and a smaller scope.
- **Pods:** seat guided founders in 5 pods, and add mentors from the autonomous founders.
- **Founder page:** the team panel holds track, pod, research in full, the thread link and check-in notes for 27 to 30 Oct.
- **Bank:** hidden unless `PROBLEM_BANK=on`.

## Data

New tabs, all append-only, where the newest row stands: Research, Steps, Messages, Submissions, Reviews and Pods. Picks and Responses are kept but no longer written. `pnpm sheet:init` adds the new tabs and headers.

## The starter

`github.com/chaaandu/mesa-starter` is a template guided founders copy into their own GitHub. It covers Next.js, Tailwind, Supabase with Google sign-in, row-level security, and optional AI order reading (Gemini by default, Claude by `AI_PROVIDER`). Its `cards/` folder holds the 15 build cards the plan links to (`CARD_FILES` in `lib/steps.ts`).
