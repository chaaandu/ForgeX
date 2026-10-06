# Copy audit

Every user-facing string in the portal as of 6 Oct, by screen. Each one is checked against `docs/VOICE.md`. Strings marked **owner** are the owner's fixed lines; any proposed change to those is set out in `docs/COPY_CHOICES.md`. The moments chosen there are marked **choice**. "ok" means the string passes and stays.

Common faults this audit found:
- placeholders that give an instruction instead of showing an example;
- numbers spelt out as words;
- "levels" and "steps" both used for the same six things;
- trait lines that drop the subject ("Finds the real question…") while every other line says "you";
- alt text that adds nothing;
- decorative quote marks in the response email;
- strings written inside components rather than in `content/copy.ts`;
- Next.js's built-in English 404 page, which isn't in our voice.

## Global

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Site title | ForgeX | ok | ForgeX |
| Title template | %s · ForgeX | ok | %s · ForgeX |
| Meta description | Find the problem you can't ignore. | Fine for a search snippet, but it gives no context | Find the problem you can't ignore. A 3-week build sprint for Mesa founders. |
| Brand link label | Mesa School of Business, ForgeX | A screen reader hears two names and no destination | ForgeX home |
| 404 page | (Next.js default) This page could not be found. | Not our voice; no next step | Heading: This page isn't here. Body: The link may be old, or have a typo. Button: Go to the start |
| Error page | (none) | A crash leaves a blank screen | Heading: This page didn't load. Body: Nothing you wrote is lost. Try again in a moment. Button: Try again |
| Step bar label (screen reader) | Level 1 of 6, Arrive | Says "level" where every visible line says "step" | Step 1 of 6: Arrive |

## Landing

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Kicker | ForgeX | ok | ForgeX |
| Hero line | Find the problem you can't ignore. | **choice** | See COPY_CHOICES |
| Button | Enter | ok: short, and the outcome is clear | Enter |
| Wall label | The 117 founders of ForgeX | ok | The 117 founders of ForgeX |
| Face label | Aarav, Scout | ok | Aarav, Scout |
| Face not yet placed | Archetype to come | ok | Archetype to come |

## Sign in

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Heading | Sign in | ok | Sign in |
| Lead | Use your Mesa Google account. | ok | Use your Mesa Google account. |
| Button | Continue with Google | ok | Continue with Google |
| Refused, wrong domain | That account isn't on the ForgeX list. Use your forge27 Mesa account. | "List" is vague, and "forge27 Mesa account" isn't how anyone says it | That's not a Mesa founder account. Sign in with your @forge27.mesaschool.co address. |
| Refused, off roster | That account isn't in the ForgeX cohort. If that's wrong, tell the team. | "Cohort" is our word; "tell the team" names no way to do it | This account isn't on the ForgeX roster. If it should be, message the Mesa team. |
| Refused, other | Sign-in didn't finish. Try again. | ok; a little bare | Sign-in didn't finish. Try again in a moment. |
| Button after refusal | Use another account | ok | Use another account |
| Page title | Sign in | ok | Sign in |

## Step 1: Arrive

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Heading | Hi, Diya. | ok | Hi, Diya. |
| Lead | Six steps. By the last one, you'll have a problem worth building. | Number spelt out | 6 steps. By the last one, you'll have a problem worth building. |
| Steps list label | The six levels | Says "levels"; number spelt out | The 6 steps |
| Step 1 line | You're here. | ok | You're here. |
| Step 2 line | What kind of builder you are. | ok | The kind of builder you are. |
| Step 3 line | You, in your own words. | ok | You, in your own words. |
| Step 4 line | Where you already have an edge. | Clever and vague; doesn't say what the step does | Tell us where to look for your problem. |
| Step 5 line | Four problems picked for you. | Number spelt out | 4 problems picked for you. |
| Step 6 line | Make your case. We reply to every one. | ok | Make your case. We reply to every one. |
| Button | Let's go | A mood, not an outcome | Find my archetype |
| While numbering | Numbering your card | ok | Numbering your card |
| Page title | Arrive | ok | Arrive |

## Step 2: Archetype

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Intro heading | What kind of builder are you? | ok | What kind of builder are you? |
| Intro lead | Seven questions. Answer on instinct. | Number spelt out | 7 questions. Answer on instinct. |
| Intro button | Start | Bare | Find out |
| Retake heading | One more go | ok | One more go |
| Retake lead | Your new result replaces the old one. This is your only retake. | ok | Your new result replaces the old one. This is your only retake. |
| Q1 | Three days in a city you've never seen. First move? | Number spelt out at the start of the sentence | You have 3 days in a new city. What do you do first? |
| Q1 options | Read up before you go · Walk out and see · Plan all three days | Number spelt out | Read up before you go · Walk out and see · Plan all 3 days |
| Q2 | The last time you learned a new tool, what did you do first? | ok | ok |
| Q2 options | Read how it worked · Used it till it clicked · Followed a tutorial | Inconsistent voice; "till" is informal | Read how it worked · Played with it until it clicked · Followed a tutorial |
| Q3 | A messy task and an AI. What do you type first? | ok | ok |
| Q4 | In a team of four, what do you do without being asked? | Number spelt out | In a team of 4, what do you do without being asked? |
| Q4 options | Get everyone agreeing on what we're building · Make the first rough version · Split up who does what | ok | ok |
| Q5 | The instructions look wrong. What do you do? | ok | ok |
| Q5 options | Work out why · Try your own way · Follow them, then say so | ok | ok |
| Q6 | It worked yesterday. Today it doesn't. | Not a question | It worked yesterday. Today it doesn't. What do you do? |
| Q6 options | Find what changed · Change things till it works · Roll back to the last good version | "Till" again | Find what changed · Change things until it works · Go back to the version that worked |
| Q7 | Halfway in, you see a better way. | Not a question | Halfway through, you see a better way. What now? |
| Q7 options | Finish this part, then decide · Stop and think it through · Scrap it and rebuild | ok | ok |
| Keyboard hint | Press 1, 2 or 3 | ok | Press 1, 2 or 3 |
| While scoring | Placing you | Says what's done to them, not what's happening | Working out your archetype |
| Error | That didn't save. Your answers are still here. Try again. | ok | ok |
| Retry button | Try again | ok | Try again |
| Back | Back | ok | Back |
| Reveal line | You're a Scout. | **choice**; the reveal is allowed its exclamation mark | You're a Scout! |
| Identity lines | 6 lines | **choice** | See COPY_CHOICES |
| H1 note | In Hackathon 1 you came out a Cartographer. More precisely, a Scout. | "Came out" is loose | Hackathon 1 placed you as a Cartographer. More precisely, a Scout. |
| Traits | Fragments with no subject ("Finds the real question…") | Every other line says "you" | Second person throughout: "You find the real question under the obvious one." |
| Card heading | Your founder card | ok | Your founder card |
| Card lead | It fills in as you go. Download it now, or wait until it carries your problem. | ok | ok |
| Confirm button | That's me | ok | That's me |
| Next button | Next | Bare | Next: your profile |
| Retake link | Retake it | "It" is vague | Retake the quiz |
| Portrait alt, Cartographer | Cartographer portrait | Adds nothing | Cartographer, holding a compass, a map under one arm |
| Portrait alt, Alchemist | Alchemist portrait | Adds nothing | Alchemist, in goggles, holding a glowing flask |
| Portrait alt, Architect | Architect portrait | Adds nothing | Architect, in a visor, beside a glowing blueprint |
| Page title | Archetype | ok | Archetype |

## Step 3: Profile

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Heading | This is you so far. Change anything that doesn't feel like you. | **owner** | See COPY_CHOICES |
| Add bio | Add one line about you | ok | Add one line about you |
| Bio label | One line about you | ok | One line about you |
| Bio placeholder | One line a stranger should know about you. | An instruction, not an example | I sell my mum's pickles on Instagram and want it to be a real business. |
| Bio required | One line is all we need. | Doesn't say what to do | Add one line about you to carry on. |
| City label | Lives in | ok | Lives in |
| City placeholder | Your city | ok, but an example works better | Pune |
| Degree label | Studies | ok | Studies |
| Degree placeholder | Your degree | Same | BBA, Commerce and Management |
| Languages label | Speaks | ok | Speaks |
| Languages placeholder | Add a language | Same | Marathi |
| Good at label | Good at today | ok | Good at today |
| Good at placeholder | Add something | Same | Cold calling |
| Learn label | Wants to learn | ok | Wants to learn |
| Learn placeholder | Add something | Same | Voice AI |
| Links heading | Find me | ok | Find me |
| GitHub placeholder | github.com/you or @you | "You" as a username reads oddly | github.com/ananya |
| LinkedIn placeholder | linkedin.com/in/you | Same | linkedin.com/in/ananya-rao |
| Portfolio label | Portfolio or personal site | **owner**, ok | Portfolio or personal site |
| Portfolio placeholder | yoursite.com | Same | ananya.dev |
| Link error | That doesn't look like a link we can use. | Doesn't say what to do | That link won't work here. Paste the full address, like github.com/ananya. |
| Edit button, onboarding | Edit | Bare | Edit profile |
| Edit button, own page | Edit profile | ok | Edit profile |
| Done editing | Done editing | ok | Done editing |
| Empty value | Not added yet | ok | Not added yet |
| Saving, saved | Saving · Saved | ok | ok |
| Save failed | That didn't save. Try again. | ok | ok |
| Primary button | Looks like me | ok | Looks like me |
| Remove chip label | Remove Sales | ok | ok |
| Suggestions label | Good at today, suggestions | ok | ok |

## Step 4: Your world

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Q1 | Which industries pull you in? | ok | ok |
| Count label | 2 of 3 picked | ok | ok |
| Other placeholder | Which one? | A question, not an example | Sports |
| Q2 | Who do you want to build for? | ok | ok |
| Q3 | Who can you reach this week? | ok | ok |
| Q3 hint | People you can talk to beat ideas you are excited about. | Uncontracted, stiff | People you can talk to beat ideas you're excited about. |
| Q3 follow-up | What world is your family business in? | "World" is vague | Which industry is your family business in? |
| Q3 Other placeholder | Who? | Same as above | My cricket club |
| Q3 Somewhere else placeholder | Where? | Same | Pharma distribution |
| Q3 none | Nobody yet | ok | Nobody yet |
| Q4 | What do you want to learn by building? | ok | ok |
| Q4 Other placeholder | What? | Same | Blockchain |
| Q5 | What are you here for? | ok | ok |
| Q6 | How comfortable are you with tech today? | ok | ok |
| Q6 hint | No wrong answer. It only decides how big a problem we suggest. | "Big" sounds like a test | There's no wrong answer. It sets how ambitious your matches are. |
| Q6 stops | I use apps. I haven't built one. … I write code comfortably. | ok | ok |
| Back · Next | Back · Next | ok | ok |
| Finish button | Show my matches | ok | Show my matches |
| While saving | Finding your matches | ok | ok |
| Error | That didn't save. Your answers are still here. Try again. | ok | ok |

## Step 5: Matches

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Heading | Four problems picked for you. | Number spelt out | 4 problems picked for you. |
| Lead | Each one is open. Who has it, what they would pay for, and what to build is yours to find. | 19 words; three ideas in one sentence | All 4 are open. Who has it, and what to build, is yours to find. |
| Gentle heading | Good places to start. | ok | Good places to start. |
| Gentle lead | Your answers were specific, so these are open problems that suit a first build. | Vague "these" | Your answers were specific, so here are 4 open problems that make a strong first build. |
| After Try another | Fresh matches, with the team's suggestions first. | ok | ok |
| Empty heading | The problem bank opens soon. | ok | ok |
| Empty lead | Your four will appear here as soon as it does. You can write your own now if one is already on your mind. | Number spelt out; long | Your 4 matches appear here when it does. If a problem is already on your mind, write it up now. |
| Waiting notice | You've sent your why for X. Picking another replaces it. | ok | You sent your why for X. Picking another one replaces it. |
| Write your own | None of these? Write your own. | **owner**, ok | None of these? Write your own. |
| Write your own lead | Same shape as ours: a title, what is broken, and the challenge. | "What is broken" is stiff | Same shape as ours: a title, what's broken and the challenge. |
| Change answers | Change my answers | ok | ok |
| Chips label | Why this fits you | ok | ok |
| Chip, access | You can reach this user | "User" is our word | You know someone who has this |
| Chip, industry | Retail, your pick | ok | ok |
| Chip, side | Built for businesses | Implies a product already exists | Businesses, your pick |
| Chip, stretch | A stretch you can finish | ok | ok |
| Chip, sized | Sized for where you are | ok | ok |
| Chip, demand | Lots of people want this fixed | "Lots" is loose | Many people want this fixed |
| Chip, portfolio | Two skills in one build | Number spelt out | 2 skills in 1 build |
| Chip, archetype | Suits a Scout | ok | ok |
| Chip, suggested | Suggested by the team | Passive | The team suggested this |
| Chip, gentle | A good place to start | ok | ok |
| Card label | Challenge | ok | ok |
| Sheet: learn | What you'll learn | ok | ok |
| Sheet: button | I'll build this | **owner**, ok | I'll build this |
| Sheet: close | Close | ok | ok |

## Step 6: Your why, and Write your own

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Heading | Tell us why you want to build this. We'll tell you if it's the right fit for you. | **owner** | See COPY_CHOICES |
| Picked label | You picked | ok | ok |
| Pick another | Pick another | ok | ok |
| Prompt 1 | Why this problem? | **owner**, ok | ok |
| Prompt 1 placeholder | What did you see, hear or live through that makes this one matter to you? | An instruction | My uncle's shop runs out of its best sellers every week, and he only finds out at the counter. |
| Prompt 2 | Who would use what you build, and why? | **owner**, ok | ok |
| Prompt 2 placeholder | Picture one real person. What do they do today, and what does it cost them? | An instruction | Shop owners like him, who restock from memory and lose a few sales every day. |
| Prompt 3 | Why would they pay for it, or how would it make money? | **owner**, ok | ok |
| Prompt 3 placeholder | Who hands over money, how much, and for what? | An instruction | He already pays ₹500 a month for billing software. Lost sales cost him more. |
| Prompt 4 | Who could you talk to about it this week? | ok | ok |
| Prompt 4 placeholder | A name, a shop, a group. Anyone you can actually reach. | An instruction | My uncle, and the 2 shops either side of his |
| Nudge, short | A little more. Two or three sentences is plenty. | Numbers spelt out | A little more. 2 or 3 sentences is plenty. |
| Other nudges | That's a solution. What's broken before it exists? · Picture one person. Who are they? · Who hands over money, and for what? | ok | ok |
| Word count | 25 words | ok | ok |
| Send button | Send it | "It" relies on context | Send my why |
| While sending | Sending | ok | ok |
| Send failed | That didn't send. Everything you wrote is still here. Try again. | ok | ok |
| Picks closed | Picks are closed now. | Not specific | Picks closed on 15 Oct at 11:59 pm IST. |
| Pick settled | The team has already answered your pick, so it is settled. | Stiff | The team has answered this pick, so it's settled. |
| Sent heading | Sent. | ok | Sent. |
| Sent lead | Your card now carries your problem. We read every why and answer each one personally. You'll see our response on your page. | ok | Your card now carries your problem. We read every why and reply to each one. You'll see our reply on your page. |
| Sent button | Go to your page | ok | See my page |
| Composer heading | Write your own | ok | ok |
| Composer lead | Same shape as ours. Say what is broken, not what you will build. | Stiff | Same shape as ours. Say what's broken, not what you'll build. |
| Title placeholder | Under ten words, concrete | An instruction | Weekend markets lose their regulars by Monday |
| Problem placeholder | Two or three sentences on what is broken in the world, and what it costs. | An instruction | Stall owners can't tell regulars where they'll be next week, so footfall depends on luck. |
| Challenge placeholder | One line that sets the task without naming the product. | An instruction | Help a stall keep its regulars between markets. |
| Industry question | Which world is it in? | Vague | Which industry is it in? |
| Side question | Who lives with it? | Odd | Who has this problem? |
| Next button | Next: your why | ok | ok |
| Back link | Back to matches | ok | ok |
| Nudge, title | Under ten words. | Number spelt out | Under 10 words. |

## Step 7: Your page

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Continue button | Continue: Your world | ok | ok |
| Pick label | Your pick | ok | ok |
| Waiting | You'll see our response here. | **owner** | See COPY_CHOICES |
| Withdraw | Pick another instead | ok | ok |
| Response headlines | Go · Go, with a tweak · Let's talk · Try another | **choice**: a label alone gives no next step | See COPY_CHOICES |
| Suggestions | Try one of these | ok | ok |
| Back to matches | Back to matches | ok | ok |
| Thread heading | The thread | Our word, not theirs | Your why and our replies |
| Sent stamp | Sent 6 Oct, 2:30 pm | No time zone | Sent 6 Oct, 2:30 pm IST |
| Withdrawn | Withdrawn 6 Oct, 2:30 pm | Passive, no time zone | You withdrew this on 6 Oct, 2:30 pm IST |
| Reply author | The ForgeX team | ok | ok |
| Own problem label | Your own problem | ok | ok |
| About heading | About | ok | ok |
| Console link (team) | Console | Says where, not what | Back to console |
| Card: download | Download card | ok | Download card |
| Card: share | Share | ok | Share |
| Page title | Founder | Not the person | {Name} · ForgeX |

## Emails

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Subject | ForgeX: we read your why for X | **choice**; one subject for four very different replies | See COPY_CHOICES (one per reply) |
| Body | Hi Diya, We've answered your why for "X": Go. … Read it on your page | Decorative quotes; status pasted in as a label | Hi Diya, … the reply's headline, the note, then "Read the full reply on your page:" and the link. Signed "The ForgeX team". |

## Console

| Element | Current | What's wrong | Proposed |
| --- | --- | --- | --- |
| Nav | Founders · Queue · Bank | ok | ok |
| Founders: search | Search by name | A placeholder doing a label's job | Label: Search founders. Placeholder: Ananya |
| Export | Export CSV | ok | ok |
| No results | No founders match. | ok | ok |
| Queue: empty | Nobody is waiting. Every why has an answer. | ok | No one is waiting. Every why has a reply. |
| Queue: send | Send | Bare | Send reply |
| Queue: their own | Their own | Fragment | Their own problem |
| Queue: facts | Industries: … For: … Can reach: … (inline) | In the component | Moved to copy; same words |
| Queue: suggest placeholder | Search the bank | Placeholder doing a label's job | kirana |
| Bank: status | draft · approved · rejected (raw values) | Lower case code values | Draft · Approved · Rejected |
| Bank: players | Who is there already | Stiff | Who's there already |
| Bank: empty | Nothing here. | No reason | No problems with this status. |
| Bank: edit field labels | Title · Problem · Challenge · Rarity (inline) | In the component | Moved to copy |

## Problem bank

All 250 statements are checked by `pnpm bank:lint`, and every flagged one is rewritten by hand against its own evidence. See `data/research/BANK_LINT.md` for the before and after counts.
