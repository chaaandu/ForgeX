# Build plan

From 7 Oct 2026, this replaces the problem bank, matching, Your world, Your why and the four team replies. Where PRODUCT.md or ARCHITECTURE.md disagree with this file, this file wins.

## The challenge

One problem for everyone, from the bank (P045), final on 7 Oct:

> **2 lakh kiranas closed in a single year.** A retailer federation says 2 lakh kiranas closed in a year, and 60% of Mumbai grocery stores near quick-commerce dark stores saw volumes fall. Buying through distributors and stocking only 1,000–1,500 items, a kirana cannot match dark-store prices or range. It needs hundreds of loyal households to survive on thin margins, so a handful of defections can be enough to close it.
>
> **Help a kirana keep its loyal households ordering from it rather than from the nearest dark store.**

Nothing in the portal or the starter names a solution. Founders research kirana owners and their regulars, write their own solution, and build it. Each founder says exactly who they are building for (which kiranas, where) in their research.

## Tracks

Founders never see a track's name or a level. Their plan simply differs.

| | Guided (42) | Structured (45) | Autonomous (30) |
| --- | --- | --- | --- |
| Builds | One core flow that fixes what they found | 2 or 3 connected flows, plus a view the owner checks daily | A product, not a project: a website and an app, an AI agent that acts once approved, a second channel beyond the browser, subscriptions, and 2 stretch features they propose |
| Has | Google sign-in, real data, works on a phone | Plus a second role, a test payment, and tests | Plus many shops kept apart, AI measured on 50 real inputs, CI on every push, analytics, error monitoring, and a new shop set up alone in 5 minutes |
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
| Fri 16 Oct, 6 pm | Phase 1 · MVP version 1 |
| Sat 17 Oct | AI Sprint · Pitch day for phase 1 |
| Wed 21 Oct | Workshop: Google Cloud Console and Supabase |
| Fri 23 Oct, 6 pm | Workshop: Vercel. Phase 2 · Live product |
| Mon 26 Oct, 6 pm | Phase 3 · Real users and demo; launched on Product Hunt |
| Tue 27 to Fri 30 Oct | Keep building. 1:1 check-ins with Pragati and Chandu |
| Mon 2 Nov | Venture Building launch, for those going further with tech and AI |

## Founder flow

1. **Onboarding, 4 steps:** arrive, archetype, profile, the challenge. The challenge page is only the problem: headline, 3 facts as one chain, the stakes, the challenge, sources. One button: Take the challenge.
2. **Kickoff (`/start`):** their card, "Go keep a kirana open.", what they'll do, and the 3 weeks as a calendar. One button: See what's on today.
3. **Today**, home from here: day number, countdown to the next phase, the team's fixes, then one list (anything overdue, marked with its due date, then today's steps).
4. **Research is days 1 and 2 of the plan:** talk to kirana owners and their regulars (with the research template in the starter), get the mentor's yes, then send it: who exactly it's for, what they found in 3 lines, the doc link, and the mentor's tick. Until it's sent, the build days show but stay locked, and so do the phases.
5. **Plan:** every step to 30 Oct, a week at a time; the current week open. Blanks to fill show in italics.
6. **Phases 1 to 3:** the fields their track's plan asks for, filled in from their steps. Drafts save, edits until 6 pm, then locked; one late send allowed, flagged.
7. **Help is in person:** mentors every day; nothing to message in the portal.
8. **Profile:** card, social icons (GitHub, LinkedIn, live app, portfolio), profile, then the build, with the month as a day-by-day grid.

## What each phase asks for

Defined field by field in `content/plan.ts` (`STOP_FIELDS`). Everyone builds a website as well as the app; Structured and Autonomous build more of it.

| Phase | Everyone | Guided | Structured | Autonomous |
| --- | --- | --- | --- | --- |
| **1 · MVP version 1** · Fri 16 Oct, 6 pm (pitch Sat 17) | Research sent; what makes the solution different; website v1 (the problem and the solution); repo; a prototype on a live link | 1-page website; first screen of the core flow | 4–5 section website; every screen of 2–3 flows; 10 real cases tested | Full website with a working waitlist; a working product with a real database and AI; architecture note; 2 stretch proposals |
| **2 · Live product** · Fri 23 Oct, 6 pm | App live with Google sign-in and real data; website v2 with video testimonials (owners, and households who switched to Blinkit, Zepto or Swiggy Instamart) | Core flow done on real data; 2 testimonials and app screenshots | 2–3 flows, owner's daily view, a second role, a test payment, tests; 4 testimonials, features, pricing | Agent that acts once approved, many shops, subscriptions, CI, analytics, a second channel, stretch 1, AI measured on 50 inputs; 6 testimonials, pricing, sign-up straight into the app |
| **3 · Real users** · Mon 26 Oct, 6 pm | Owners using it, with numbers; website v3 with the results; README case study; 3-minute Loom; Product Hunt launch | 1 owner | 3 owners, for a week through 30 Oct; stretch 1 (proposed Sun 18 Oct) | 5 or more owners, a new shop set up alone in 5 minutes, stretch 2 |

## Team console

- **Founders:** track, pod, who they're building for, steps done against due, how far behind, the 3 phases, and Filter by track, pod and behind. CSV export.
- **Phases 1, 2, 3:** filter by track, pod and rating. Rate green, amber or red with notes and a fix list. The reviewer and the time go into Reviews and Events. Amber means a fix list and a check-in within 2 days; red means a 1:1 the next day and a smaller scope.
- **Pods:** seat guided founders in 5 pods, and add mentors from the autonomous founders.
- **Founder page:** the team panel holds track, pod, research in full, the thread link and check-in notes for 27 to 30 Oct.
- **Bank:** hidden unless `PROBLEM_BANK=on`.

## Data

New tabs, all append-only, where the newest row stands: Research, Steps, Submissions, Reviews and Pods. Picks and Responses are kept but no longer written. `pnpm sheet:init` adds the new tabs and headers.

## The starter

`github.com/chaaandu/forgex-starter` is a baseline, not an app: Next.js, Tailwind, Supabase with Google sign-in and row-level security, one neutral example screen to copy, `frameworks/` (research doc, your solution, flows, data, scope, pitch, case study) and `prompts/` with [brackets] to fill from their own solution. Its `cards/` folder holds the 15 build cards the plan links to (`CARD_FILES` in `lib/steps.ts`). Optional AI is one generic helper, Gemini by default, Claude by `AI_PROVIDER`.
