# Research: the problem bank

The goal is a new bank of 200 to 300 open problem statements, each grounded in real evidence. No previous list is used. A problem reaches founders only after the owner approves it in `/team/bank`.

## What a founder sees, and what the team sees

| Field | Founder | Team | Rule |
| --- | --- | --- | --- |
| Title | ✓ | ✓ | Under ten words. Concrete, a little provocative. |
| Problem | ✓ | ✓ | Two or three sentences on what's broken. Names no target user and no solution. |
| Challenge | ✓ | ✓ | One line that sets the task without prescribing the product. |
| Difficulty | | ✓ | Easy, Medium or Hard: how hard it is to build in 3 weeks. Mapped from the pipeline's rarity (see below). Founders never see it, but their track decides which difficulties they are offered. |
| Industries, side | used for matching | ✓ | Tags from `lib/taxonomy.ts`. |
| What you'll learn | ✓ | ✓ | Learn tags from the taxonomy, for example voice AI or agents. |
| Signal | | ✓ | A 1–5 strength meter, plus a line such as *Seen across 23 posts in 2025 and 2026*. No links. Used in matching; stripped before a problem reaches a founder. |
| Evidence links, signal counts | | ✓ | |
| Why now, existing players and their gaps | | ✓ | |
| All seven scores, with notes | | ✓ | |

## Sources

Every source is reached without credentials. The owner has none to provide, so everything is public.

| Source | How it is reached | Notes |
| --- | --- | --- |
| Razorpay **Fix My Itch** (razorpay.com/m/fix-my-itch) | Public pages, after a robots.txt check | India-specific. Already scored for severity, frequency and whitespace. |
| Hacker News | Algolia API (`hn.algolia.com/api/v1`), free | Ask HN threads such as "what do you wish existed", "what tool do you pay for and hate", and "what problem do you have". |
| Y Combinator | Requests for Startups, plus recent batch themes, from public pages | |
| Reddit | Web search results and public thread pages | Subreddits for founders, small businesses, freelancers, specific professions and Indian audiences. No API key, so no bulk pulls. |
| X, Quora | Public search results only | |
| Product Hunt | Public launch pages found through search | The complaints in launch comments are the most useful part. |
| G2, Capterra, Play Store, App Store | Public review pages and search snippets | Low-star reviews of the incumbents. A complaint about an existing product is strong evidence of a gap. |

### Rules on every source

- Respect `robots.txt` and the site's terms.
- Never log in, and never fetch anything behind a login.
- Rate limit to one request per second per host, and identify with a User-Agent.
- Store a short paraphrase (25 words at most), the URL, the date and the source. Never store usernames or copy long posts.

## Pipeline: `scripts/research/`

| Step | Script | Writes | What it does |
| --- | --- | --- | --- |
| 1 Collect | `collect-hn.ts`, `collect-fixmyitch.ts`, `collect-yc.ts`; web-search signals are added by the research agent through `add-signal.ts` | `data/research/raw/<source>.jsonl` | Each line is one `Signal`: `{ id, source, url, date, paraphrase, industryHint?, geo: 'IN' \| 'global' }`. Duplicates are removed by URL. |
| 2 Cluster | `cluster.ts` | `data/research/candidates.json` | Groups related signals into candidate problems. Each `Candidate` has a draft title, problem, challenge, signal IDs, industries, side and learn tags. |
| 3 Score | `score.ts` | `data/research/scored.json` | Seven 1–5 scores, each with a one-line reason (see the rubric below). |
| 4 Drop | `drop.ts` | `data/research/dropped.json`, each with its reason | Applies the hard filters below. |
| 5 Balance | `balance.ts` | `data/research/shortlist.json` | Selects 200–300 against the quotas below. |
| 6 Write | `write.ts` | `data/problems.json`, `data/problems.internal.json` | Applies the writing rules. Assigns IDs `P001…` in balanced order. Turns each rarity into a difficulty. |
| 7 Validate | `validate.ts` | `data/research/REPORT.md` | Checks both files with Zod and writes the report. Fails the run on any violation. |

`pnpm research` runs steps 2 to 7, and each step can also be run on its own.

### Steps 2 and 3 have two engines

1. **With `ANTHROPIC_API_KEY` set**, `cluster.ts` and `score.ts` call the Anthropic SDK. They use `claude-opus-5-5`, structured JSON output, and the versioned prompts in `scripts/research/prompts/`.
2. **Without a key** (the first run), the research agent in Claude Code follows the same prompt files. It writes the same JSON files and records the prompt version in each record.

Either way, every output is validated by the same Zod schemas, so a later run with a key reproduces the process exactly.

## Score rubric (1 to 5)

| Score | 1 | 3 | 5 |
| --- | --- | --- | --- |
| **Pain** | Mild annoyance | Costs time or money every week | Costs livelihood, health or a lot of money |
| **Frequency** | Rare edge case | Weekly, for a niche | Daily, for many people |
| **Willingness to pay** | Nobody would pay | Would pay if it were cheap | Already pays for a bad fix |
| **Buildability** (an MVP in 3 weeks, by a student learning with AI tools) | Needs data, hardware or partners they can't get | Doable with focus | A working slice by the end of week one |
| **Learning value** | Only CRUD | One modern capability | Agents, voice, vision or data, used in earnest |
| **Novelty** | A known idea, done many times | A known idea with a fresh angle | A rarely named problem |
| **Openness** | Solved well by a dominant or free product | Incumbents exist and are clearly weak | No credible answer, or a clearly underserved group |

Openness scores low when a dominant or free product already solves the problem well, unless a clearly underserved group exists.

## Hard drops

A problem is dropped if any of these is true:

- It needs hardware.
- It needs regulated data the founders can't get, such as clinical records, KYC or credit bureau data.
- Its only buyer is the government.
- It is just a feature that an incumbent is likely to ship next quarter.
- It scores 2 or below on buildability.
- It is backed by fewer than 3 independent signals, or by only one source type.

## Balance quotas

- **Industries:** at least 10 represented, and none above 15% of the bank.
- **Sides:** businesses, consumers and creators each above 15%. `creator` means anyone who earns on their own (drivers, sellers, farmers, freelancers, creators), which is how Level 4 asks it. Every problem has a primary side, and all four sides of the brief are covered through the side tags and "not sure" matching.
- **Geography:** at least 40% relevant to India.
- **Rarity:** about 25% Rare, 45% Epic, 24% Legendary, 6% Mythic, each within ±3 points.
  - Rarity comes from ambition (pain × openness × novelty), adjusted for the inverse of buildability.
  - Rarity is never a measure of quality.
  - Rarity is the pipeline's word only. `write.ts` maps it to the product's difficulty through `DIFFICULTY_OF_RARITY` in `lib/taxonomy.ts`: Rare → Easy, Epic → Medium, Legendary and Mythic → Hard. The bank today is 63 Easy, 112 Medium and 75 Hard.
- **Learn tags:** every learn tag in the taxonomy appears at least 12 times. Without that, a founder's learning goal could find no match.

The balancer is greedy and works by total score within each quota. Anything left over goes to `shortlist.json` as reserve.

## Writing rules (step 6)

- **Title:** under ten words. Concrete nouns. No colons, no question marks, no brand names.
- **Problem:**
  - Two or three sentences on what is broken in the world, and what it costs.
  - No named target persona and no solution words (`app`, `platform`, `AI-powered`, `tool that`).
  - A lint step checks this and fails the run on a violation.
- **Challenge:** one line in the imperative that sets the task without naming the product.
  - Good: *Make the weekly stock check take ten minutes, not two hours.*
  - Bad: *Build an inventory app.*
- **Signal line:** `Seen across {n} posts in {years}`. `n` counts distinct signals. The strength meter (1–5) is the count on a log scale, adjusted for source diversity.

## Review before founders see anything

- **Phase 2:** a temporary team-only page at `/lab/bank` shows the shortlist with its evidence and scores.
- **Phase 9:** that review moves to `/team/bank`. There, `Y`, `E` and `R` approve, edit or reject, and each writes `Problems.Status`, `Edited by` and `Edited at`, and a `bank` event. An edit can also change the difficulty.
- Founders only ever see approved rows.

## REPORT.md

- **Source mix:** signals by source and by year.
- **Coverage:** counts by industry, side, geography, rarity and learn tag, each against its quota.
- **Scores:** the distribution of each of the seven, plus the total.
- **Strongest and weakest:** the 20 strongest and the 20 weakest problems, each with its scores and evidence count.
- **Drops:** dropped candidates, grouped by reason.
