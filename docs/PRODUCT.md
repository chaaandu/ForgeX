# Product

ForgeX 2.0 is a three-week build sprint for 117 first-year founders at Mesa School of Business. This portal is where each founder:
- arrives,
- finds out what kind of builder they are,
- tells us about themselves,
- picks a real problem,
- and tells us why they want to build it.

We answer every one of them personally.

What we optimise for, in order:
1. Every founder learns modern tech and AI by building.
2. Founders with real founder pull get pushed further.
3. Thinking comes before building.

The portal teaches that order by how it is sequenced, never by lecturing.

## Roles

Role comes from the Google account's email domain, and nothing else.

| Domain | Role | Gets |
| --- | --- | --- |
| `@forge27.mesaschool.co` | Founder | The journey, then their own `/f/[slug]` |
| `@mesaschool.co` | Team | `/team`, and every founder page |
| Anything else | Refused | One calm line and a way to try another account |

**The cohort** is the 117 founders on `@forge27.mesaschool.co` who have a photo (the owner's decision, 2026-10-06). Two corrected emails (Aditya Peter, Madhuresh Binzani) are in. Two founder-domain rows without photos are not, and are refused at sign-in with their own message.

## The founder card is the progress bar

Every level adds a layer to the founder's collectible card, so the thing they are building is also the thing that shows them how far they've come. A row of six pips would say less. The card is always visible, small in the corner on mobile and beside the step on desktop.

| Level done | What the card gains |
| --- | --- |
| 1 Arrive | Photo, name, number `#023 / 117` |
| 2 Archetype | The family's character, full length, standing in the photo's corner; *Family · Archetype*; and the archetype's identity line along the bottom |
| 4 Your world | Industry and side marks along the edge |
| 6 Your why | The picked finish: violet, with foil. The same for every problem, so the card never says how hard a pick is |
| 7 Response | Nothing on the card. The answer lives on the founder's page; a card with a Go shows on the landing |

The bottom line of the card is always the archetype's identity line, never the bio and never the problem. The bio and the problem live on the founder page.

The rest of the gamification follows the same rule: progress, reveals and the card. There are no points, no badges and no confetti.

## Founder numbers

A founder's number is their place in the order of arrival: the rank of their first `arrived` event. The first founder to sign in is `#001`. Once given, a number never changes.

## Journey

Each level has its own route. A founder who signs in is sent to the furthest level they have reached. They can step back to an earlier level at any time, but they can't skip ahead.

### Landing `/` (public)

- **Hero:** the founder wall. All 117 faces form a living mosaic. Tapping or clicking a face flips it over, like a card, to show that founder's first name, archetype and family portrait; hovering lifts it. Every founder is on the wall; the team can take someone off by setting `Wall` to `no` in the Sheet.
- **Headline:** *Don't start with an idea.* / *Start with a problem.*
- **Sub:** *Find one. Prove it's real. Then build.*
- **One button:** **Enter**.
- **Below the fold, What they're building:** the cards of founders on the wall whose current pick was **Approved**, newest first. **Needs a tweak** does not count until the team approves the change, each with its problem title only and a link to their profile. It refreshes whenever the team responds. Until the first approval the section says so.
- **No problem bank on the landing page.** Problems are earned by finishing the levels, not browsed from the door. Titles of problems already being built are the only exception.
- **Signed in?** The landing stays open: the logo, and **The wall** on every page header, lead back to it. **Enter** goes straight to the founder's furthest level, or to `/team` for the team.

### Sign in `/login`

- One button: **Continue with Google**.
- **Wrong domain:** *That account isn't on the ForgeX list. Use your forge27 Mesa account.* The button below it reads **Use another account**.

### Level 1 · Arrive `/arrive`

- A large photo and *Hi, Ananya.*
- The card assembles in front of them: the photo drops in, then the number stamps on. This is the first reward, before we have asked for anything.
- **One line:** *Six steps. By the last one, you'll have a problem worth building.*
- **Primary button:** **Let's go**.

### Level 2 · Archetype `/archetype`

**Already placed** (110 founders):
- They see their reveal straight away: *In Hackathon 1 you came out a Cartographer. More precisely, a Scout.*
- **Primary button:** **That's me**.
- **Secondary link:** **Retake it**, offered once.

**Not yet placed** (9 founders):
- Seven questions, one card per screen. Tapping an option, or swiping it on touch, answers and moves on.
- **Undo** goes back one question.
- A thin bar shows 1 to 7.

**The reveal:**
- The family portrait lands first, then the archetype name, the identity line, strengths, blind spot, and what they tend to love.
- The finished front of the card turns over.
- **Primary button:** **Download card**.
- **Secondary:** **Share** (Web Share with the image, where supported), then **Next**.

**Retake:**
- Each founder gets one retake, including those placed in Hackathon 1.
- The newer result replaces the older one.
- The team can see both.

#### Three families, six archetypes

Hackathon 1 scored each founder on three instincts: **understand**, **experiment** and **structure**. The strongest names the **family**, which is the Hackathon 1 class with its portrait, unchanged. The second strongest splits each family in two, giving six **archetypes**. A Scout and a Surveyor share the Cartographer portrait; the archetype name is what tells them apart.

- The 110 placed founders map exactly from their recorded scores. Nobody has to retake anything.
- The quiz is the same recovered rubric, so a new result means what an old one meant.
- Ties break in the Hackathon 1 order: experiment, then understand, then structure.
- Shown as family first, then archetype: *Cartographer · Scout*.

| Family (portrait) | Archetype | Leads → then | H1 count |
| --- | --- | --- | --- |
| Cartographer | **Surveyor** | understand → structure | 20 |
| Cartographer | **Scout** | understand → experiment | 39 |
| Alchemist | **Inventor** | experiment → understand | 15 |
| Alchemist | **Tinkerer** | experiment → structure | 13 |
| Architect | **Strategist** | structure → understand | 11 |
| Architect | **Builder** | structure → experiment | 12 |

The identity line, strengths, blind spot and loves for each archetype live in `content/copy.ts` under `archetypes`.

#### The seven questions

These keep the meaning, and the scoring, of the Hackathon 1 rubric. Only the wording is new. Every option is a tap card, with no quotation marks.

1. **Three days in a city you've never seen. First move?** Read up before you go · Walk out and see · Plan all three days
2. **The last new tool you learned, you…** Read how it worked · Used it till it clicked · Followed a tutorial
3. **A messy task and an AI. You type first:** Here's everything, what do you think? · Break this into steps · Explain this to me first
4. **A team of four. Without being asked, you…** Get everyone agreeing on what we're building · Make the first rough version · Split up who does what
5. **The instructions look wrong. You…** Work out why · Try your own way · Follow them, then say so
6. **It worked yesterday. Today it doesn't.** Find what changed · Change things till it works · Roll back to the last good version
7. **Halfway in, you see a better way.** Finish this part, then decide · Stop and think it through · Scrap it and rebuild

### Level 3 · Profile `/profile`

**Heading:** **This is you so far. Change anything that doesn't feel like you.**

It looks like a personal page, not a settings screen. The card sits beside it, and every field is edited in place.

| Field | Prefilled from | Editable |
| --- | --- | --- |
| Name, photo | Roster | No |
| One-line bio | — | Yes, 120 characters |
| City | — | Yes |
| Languages | — | Yes, chips plus typing |
| Degree | Cohort sheet | Yes |
| Good at today | Cohort sheet (prior work) | Yes, chips plus typing |
| Want to learn | — | Yes, chips. Also used as a prompt in Level 4 |
| GitHub | — | Yes, normalised on the server |
| LinkedIn | — | Yes, normalised on the server |
| Portfolio or personal site | — | Yes, any https URL |

It opens as the profile the team will see. **Edit** turns the same page into fields that save one at a time; **Looks like me** moves on. Nothing on this page is required except the bio. Any link that won't normalise is shown inline, with a fix. The bio edits in place in one tap: **Add one line about you** opens the field, focused, where the invitation was. If **Looks like me** is pressed without one, the field opens with the reason. Field headers carry an emoji: 📍 Lives in, 🎓 Studies, 🗣️ Speaks, 💪 Good at today, 🌱 Wants to learn, 🔗 Find me.

### Level 4 · Your world `/world`

Six questions, one per screen, in about two minutes. Every multiple-choice question has an **Other** (or **Somewhere else**) option that opens a text field, so no question is a dead end. These answers drive matching.

1. **Which industries pull you in?** Pick up to three.
   - Retail and local shops · Food and quick commerce · Money and finance · Health and fitness · Education and careers · Work and teams · Creators and media · Travel and mobility · Farming and food supply · Homes and real estate · Manufacturing and logistics · Fashion and beauty · Other
2. **Who do you want to build for?** Each option has a sublabel.
   - Businesses (*Shops, clinics, factories, offices.*) · People, for themselves (*Patients, parents, renters, job seekers.*) · People who earn on their own (*Drivers, sellers, farmers, freelancers, creators.*) · Not sure yet
   - Each option maps one to one onto a side in the bank, or it would match nothing. The bank's `creator` side means anyone self-employed, so the option says that rather than *Creators*. Short labels, on the card and in the console: Businesses, People, Self-employed.
3. **Who can you reach this week?** Multi-select.
   - Family business · Relatives' work · A past internship or job · Friends' parents · A community you're in · Other
   - For each choice, a follow-up chip row asks **What world are they in?** using the same industry list, plus **Somewhere else**.
   - Prefill: if the cohort sheet says their prior work is a family business, that option starts selected.
   - **Helper line:** *People you can talk to beat ideas you're excited about.*
4. **What do you want to learn by building?** Pick up to three.
   - AI agents · Voice AI · Vision · Data and dashboards · Payments · Mobile apps · Full-stack web · Automation and integrations · Other
5. **What are you here for?**
   - A career in tech and AI · Building a company · Both · Still working it out
6. **How comfortable are you with tech today?** A five-stop slider. No wrong answer. Each stop shows one line:
   1. *I use apps. I haven't built one.*
   2. *I've followed a few tutorials.*
   3. *I've built something small with AI tools.*
   4. *I've shipped something people used.*
   5. *I write code comfortably.*

**What changed from the original list:**
- "Where does the problem live?" is gone. It repeated industry plus side, and every problem would have needed a guessed setting tag.
- Access is now linked to an industry. That link is what makes the *You can reach this user* chip true.
- *Still working it out* is now a valid answer to "What are you here for?", because finding that out is what this hackathon is for.

### Level 5 · Matches `/matches`

- **The founder's track decides the pool.** Track is a team decision in the Sheet, and the founder never sees it.

  | Track | Matches |
  | --- | --- |
  | Autonomous | None. `/matches` goes straight to **Write your own**, and step 5 is called **Your problem** |
  | Structured | Hard and medium problems |
  | Guided | Medium and easy problems |

  A track the app doesn't recognise reads as structured.
- **Four matches,** plus **Write your own.** They're spread across industry and difficulty, so a founder never gets four of the same. On desktop they sit in a two-column masonry grid.
- **Each card shows:** title, problem and challenge. No chips. A card the team suggested says *The team suggested this*.
- **No difficulty and no signal** on anything a founder sees: a label that ranks problems changes which one they pick. Difficulty is stripped on the server before a problem reaches the browser.
- **Matching still explains itself** to the team and the tests: every match carries the factors that scored for it, in the founder's own terms.
- **Opening a card** shows:
  - the full problem and the challenge
  - what you'll learn
  - one primary button, **I'll build this**
- **Below the four**, always: **None of these? Write your own.**
- **Never empty.** If almost nothing scores, the four gentlest open problems fill in, and the heading says so honestly: *Good places to start.*
- **There is no browse-all view** for founders.

#### Write your own `/matches/new`

- It has the same shape as our problems:
  - **Title**, under ten words
  - **Problem**, two or three sentences on what's broken
  - **Challenge**, one line
  - **Industry** and **side**, from the same chips as Level 4
- It has the same live nudges as Level 6.
- Then it continues into Level 6, exactly like a bank problem.

### Level 6 · Your why `/why`

**Heading:** **Tell us why you want to build this. We'll tell you if it's the right fit for you.**

The prompts:
1. **Why this problem?**
2. **Who would use what you build, and why?**
3. **Why would they pay for it, or how would it make money?**
4. *Optional:* **Who could you talk to about it this week?**

**Live guidance** appears under each field as the founder types. It's deterministic, runs in the browser and never blocks. Each nudge is gentle, and disappears once it's addressed:

| Field | Trigger | Nudge |
| --- | --- | --- |
| 1 | The answer describes a solution ("an app that", "a platform", "I will build") | *That's a solution. What's broken before it exists?* |
| 2 | No person or role is named | *Picture one person. Who are they?* |
| 3 | No money words (pay, price, fee, subscription, save, commission, ads) | *Who hands over money, and for what?* |
| Any | Under about 25 words | *A little more. Two or three sentences is plenty.* |

**Submit** is **Send it**. The card flips, and the picked finish sweeps across it: violet, with foil, the same for a bank problem and one the founder wrote.

**Pending picks:** while a pick is waiting, the founder can withdraw it and go back to matches. Once the team has responded, the pick is locked until a **Try another**.

### Level 7 · Response (on `/f/[slug]`)

- **While waiting:** **You'll see our response here.** Nothing else.
- **When the team responds,** the response appears in the thread on the founder's page, and an email goes out.

| Response | Founder sees |
| --- | --- |
| **Approved** | The team's note, if any |
| **Needs a tweak** | The note, which is required, in a **What we asked** box, and one button: **Make the change** |
| **Talk to your mentor** | The note. Mentor names come once mentors are confirmed |
| **Try another** | The note and the suggested problems; **Back to matches** keeps every answer |

No stamp goes on the card: the landing already says who has a go, and the card stays about the person.

After **Try another**:
- The founder is back at Level 5.
- The team's suggestions come first, then fresh matches. Suggestions skip the track filter, because a person chose them.
- Problems they've already tried are excluded.

### Founder page `/f/[slug]`

- **Slug:** built from the full name, with a numeric suffix if two names clash (`/f/ananya-rao`, `/f/ananya-rao-2`). Slugs are frozen once seeded.
- **Who can see it:**
  - **The founder and the team** see everything.
  - **Any other signed-in user** can see it once the founder is building (their current pick was **Approved**): the card, archetype, bio, the problem title and challenge, and profile facts. Never the thread, the team's note, the team panel or the card download.
  - Anyone else gets a 404.
- **What it shows the founder and the team:**
  - the founder card, with download and share
  - *Family · Archetype* under the name (the identity line is already on the card, so it isn't repeated)
  - the profile, edited inline when it's their own
  - their links
  - their pick and its status
  - the full thread of their why and our responses. The team sees each response signed with the name of whoever sent it; the founder sees *The ForgeX team*
- **After onboarding,** this page is the founder's home.

### Team console `/team`

**Founders** (`/team`): a table of all 117 founders.
- **Columns:** photo, name, archetype, level reached, pick, status, last active, link to the page.
- **Sort and filter** by any column.
- **Export CSV.**

**Queue** (`/team/queue`) has two views.
- **Waiting:** submitted whys, oldest first, one at a time. Four plain buttons answer it: **Approve**, **Needs a tweak** (a note is required), **Talk to mentor**, **Try another** (opens the problem picker). Then **Send reply**. There are no keyboard shortcuts anywhere in the product.
- **Replied:** each founder's latest answered pick, newest first, filterable by answer, with who replied, when, their note and a link to the founder's profile. This is where the team checks who is approved. Every row has **Send a new reply**, which opens the same reply form in place: approving a tweak settled on a call, or changing a decision. The newest reply is the one the founder sees. A tweak still out reads *Waiting for their change*.

**The tweak loop.**
1. The team answers **Needs a tweak** with a note.
2. The founder's profile shows *Almost there*, the note in a **What we asked** box, and **Make the change**.
3. That opens their why with every answer as they left it and the note pinned on top (their own problem opens in the composer first, prefilled). **Send the change** sends it back; nothing else about the problem can change.
4. It lands in **Waiting** marked *Revised after a tweak*, with a **You asked** box showing the note, who wrote it and when. Their thread on the profile labels it *The change*.
5. Any answer from there, as usual. Only **Approved** puts them on the landing.

Beside each waiting why sits a brief of the person: who they can reach this week first (access decides most fits), then industries, who they build for, what they want to learn, why they're here, and tech comfort on a five-step meter; then only the profile fields they filled in. The problem's difficulty is on the problem.

**Bank** (`/team/bank`): every problem with its difficulty (Easy, Medium or Hard), evidence and scores, and who last edited it and when.
- Filters by state (Drafts, Live, Archived) and by difficulty (Easy, Medium, Hard).
- The actions follow the state, never offering the state it is already in: a draft is **Approve**, **Edit** or **Archive**; a live problem is **Edit** or **Take down** (back to drafts); an archived one is **Restore to drafts** or **Edit**. A line beside them says what the state means for founders. No keyboard shortcuts: a stray key should never archive a problem.
- Each change records the team member in **Edited by** and **Edited at**, and in Events. In the Sheet the states are still `draft`, `approved` and `rejected`.
- Founders see live (approved) problems only.

**Setup** (`/team/setup`): checks this deploy is wired up — sign-in, each environment variable, mock mode off, the Sheet reachable with every header, how many problems are live, picks not yet closed, and whether reply emails are on. It shows whether each secret is set, never its value.

**Header:** **The wall** opens the landing. The team's photo (or initials) opens their account: name, email and **Sign out**. Founders have no account menu and no way to sign out.

**Team-only data:** track, Hackathon 1 outcome and problem difficulty appear for the team, and are never sent to the founder.

## States every screen must design

| State | Rule |
| --- | --- |
| **Loading** | A skeleton in the final layout, with no shift. |
| **Empty** | It says what will appear and what to do next. Matches are never empty. |
| **Error** | One line on what happened, one button to retry, and the founder's input is kept. |
| **Offline** | A banner. Writes are disabled with a reason. |
| **Closed** (after the pick deadline) | Picks are read-only with the deadline shown. Profile stays editable. |

## Copy

All strings live in `content/copy.ts`. Rules:
- Second person. Short. Every line earns its place.
- No decorative quotes or comma glyphs, anywhere.

These lines are fixed by the owner:

| Where | Text |
| --- | --- |
| Profile heading | This is you so far. Change anything that doesn't feel like you. |
| Primary button on a problem | I'll build this |
| Below the matches | None of these? Write your own. |
| Why heading | Tell us why you want to build this. We'll tell you if it's the right fit for you. |
| Waiting | You'll see our response here. |
| Link field | Portfolio or personal site |
| Escape options | Other / Somewhere else, with a text field |
