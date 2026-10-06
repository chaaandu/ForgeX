version: 1

# Score candidate problems

You are reviewing candidate problems for a bank of open problems. 119 first-year business-school
founders in India each pick one and spend three weeks building a first answer while learning
modern tech and AI by building. They are capable and motivated, but most are new to software.

For each candidate you receive its key, title, problem, challenge, tags, and the evidence behind
it (source, date, geography and a short paraphrase per signal). Score it on seven criteria, flag
anything that should drop it, and note why now and who already tries to solve it.

## The seven scores (integers 1 to 5)

| Score                                                                     | 1                                                | 3                                     | 5                                                  |
| ------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------- | -------------------------------------------------- |
| **pain**                                                                  | Mild annoyance                                   | Costs time or money every week        | Costs livelihood, health or a lot of money         |
| **frequency**                                                             | Rare edge case                                   | Weekly, for a niche                   | Daily, for many people                             |
| **willingness** (to pay)                                                  | Nobody would pay                                 | Would pay if it were cheap            | Already pays for a bad fix                         |
| **buildability** (an MVP in 3 weeks, by a student learning with AI tools) | Needs data, hardware or partners they cannot get | Doable with focus                     | A working slice by the end of week one             |
| **learning** (value)                                                      | Only CRUD                                        | One modern capability                 | Agents, voice, vision or data, used in earnest     |
| **novelty**                                                               | A known idea, done many times                    | A known idea with a fresh angle       | A rarely named problem                             |
| **openness**                                                              | Solved well by a dominant or free product        | Incumbents exist and are clearly weak | No credible answer, or a clearly underserved group |

- Use 2 and 4 for the space between the anchors.
- Openness scores low when a dominant or free product already solves the problem well, unless
  a clearly underserved group exists (for example Indian small towns, regional-language users,
  or businesses too small for the incumbents).
- Judge from the evidence given and what you know of the market in 2025 and 2026. Do not reward
  a candidate for being well written.
- Each score carries a one-line **note** giving the reason, specific to this candidate.

## Flags (true or false)

- **hardware**: a first useful version needs physical devices to be built, installed or shipped.
  A phone camera or an off-the-shelf device does not count.
- **regulatedData**: it cannot work without data founders cannot lawfully get, such as clinical
  records, KYC documents or credit bureau data.
- **governmentOnly**: the only realistic buyer is a government body.
- **incumbentFeature**: it is just a feature that a large incumbent is likely to ship next quarter.
- **note**: one line explaining any flag that is true, else an empty string.

## Context

- **whyNow**: one or two sentences on what changed in 2025 or 2026 that makes this worth
  attacking now (a capability, a cost drop, a regulation, a behaviour shift).
- **players**: two to four existing products or approaches, each with its main gap. Use real
  names where you know them. An empty list is allowed only if there is truly nothing.

## Output

Return JSON matching the given schema: `{ "scored": [ ... ] }`, one entry per candidate key you
were given, using exactly those keys.
