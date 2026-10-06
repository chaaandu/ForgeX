/**
 * Every word a founder or the team reads. Second person, short, direct.
 * No decorative quote marks or comma glyphs anywhere: a line that needs
 * quoting to land needs rewriting instead.
 */

import type { ArchetypeId, FamilyId } from '@/lib/archetype'

export const families: Record<FamilyId, { name: string; line: string }> = {
  cartographer: { name: 'Cartographer', line: 'Understand it, then build it.' },
  alchemist: { name: 'Alchemist', line: 'Try it and find out.' },
  architect: { name: 'Architect', line: 'See the shape first.' },
}

export const archetypes: Record<
  ArchetypeId,
  { name: string; identity: string; strengths: [string, string]; blindSpot: string; loves: string }
> = {
  surveyor: {
    name: 'Surveyor',
    identity: 'You map it before you move, and your map is precise.',
    strengths: ['Finds the real question under the obvious one', 'Turns a mess into a picture others can follow'],
    blindSpot: 'The map can quietly become the work.',
    loves: 'Problems tangled in information. Search, research, dashboards, AI that reads and explains.',
  },
  scout: {
    name: 'Scout',
    identity: 'You go and look for yourself.',
    strengths: ['Talks to people before deciding anything', 'Notices what everyone else walks past'],
    blindSpot: 'Keeps exploring when it is time to commit.',
    loves: 'Problems you only understand by being there. Communities, voice, WhatsApp, quick prototypes.',
  },
  inventor: {
    name: 'Inventor',
    identity: 'You try it, then work out why it worked.',
    strengths: ['A first version before anyone else', 'At home with tools that came out this month'],
    blindSpot: 'Speed hides the reason it worked.',
    loves: 'AI agents, new models, creative and consumer tools.',
  },
  tinkerer: {
    name: 'Tinkerer',
    identity: 'You build the rough thing, then make it hold.',
    strengths: ['Turns hacks into tools people rely on', 'Improves in small, safe steps'],
    blindSpot: 'Can build before asking whether anyone needs it.',
    loves: 'Automation, integrations and the internal tools small businesses run on.',
  },
  strategist: {
    name: 'Strategist',
    identity: 'You see the whole system before the first move.',
    strengths: ['Plans that survive contact with reality', 'Work a team can split up cleanly'],
    blindSpot: 'A shape drawn too early is the wrong shape.',
    loves: 'Operations for businesses, data models and full-stack products.',
  },
  builder: {
    name: 'Builder',
    identity: 'You plan it, then test the plan.',
    strengths: ['Structure with fast feedback loops', 'Finishes what it starts'],
    blindSpot: 'Can polish the plan longer than the problem deserves.',
    loves: 'Payments, platforms and anything with a hard technical edge.',
  },
}

/** The seven questions, in the founder's words. Scoring lives in lib/archetype.ts. */
export const trial: Record<string, { prompt: string; options: Record<string, string> }> = {
  'new-city': {
    prompt: "Three days in a city you've never seen. First move?",
    options: { read: 'Read up before you go', walk: 'Walk out and see', plan: 'Plan all three days' },
  },
  'new-tool': {
    prompt: 'The last new tool you learned, you',
    options: { read: 'Read how it worked', use: 'Used it till it clicked', tutorial: 'Followed a tutorial' },
  },
  'first-prompt': {
    prompt: 'A messy task and an AI. What do you type first?',
    options: {
      everything: "Here's everything. What do you think?",
      steps: 'Break this into steps',
      explain: 'Explain this to me first',
    },
  },
  'in-a-team': {
    prompt: 'A team of four. Without being asked, you',
    options: {
      agree: "Get everyone agreeing on what we're building",
      rough: 'Make the first rough version',
      split: 'Split up who does what',
    },
  },
  'bad-instructions': {
    prompt: 'The instructions look wrong. You',
    options: { why: 'Work out why', own: 'Try your own way', follow: 'Follow them, then say so' },
  },
  'it-broke': {
    prompt: "It worked yesterday. Today it doesn't.",
    options: {
      changed: 'Find what changed',
      tweak: 'Change things till it works',
      rollback: 'Roll back to the last good version',
    },
  },
  'better-way': {
    prompt: 'Halfway in, you see a better way.',
    options: { finish: 'Finish this part, then decide', think: 'Stop and think it through', scrap: 'Scrap it and rebuild' },
  },
}

export const landing = {
  kicker: 'ForgeX 2.0 · Mesa School of Business',
  lineStart: 'Find a problem worth',
  lineEm: 'three weeks',
  lineEnd: 'of your life.',
  open: (count: number) => `${count} open problems`,
  enter: 'Enter',
}

export const problem = {
  build: "I'll build this",
  writeOwn: 'None of these? Write your own.',
  learn: "What you'll learn",
  challenge: 'Challenge',
  signal: 'Signal',
  signalOf: (n: number) => `Signal strength ${n} of 5`,
  close: 'Close',
}

export const card = {
  number: (n: number, of: number) => `#${String(n).padStart(3, '0')} / ${of}`,
  unnumbered: 'ForgeX 2.0',
  original: 'Original',
  noArchetype: 'Archetype to come',
  building: 'Building',
  download: 'Download card',
  share: 'Share',
  shareText: (name: string) => `${name} on ForgeX 2.0`,
}

/** Why a problem was matched. Each one names a factor that actually scored. */
export const chips = {
  access: 'You can reach this user',
  industry: (short: string) => `${short}, your pick`,
  side: { business: 'Built for businesses', consumer: 'Built for consumers', creator: 'Built for creators' },
  stretch: 'A stretch you can finish',
  sized: 'Sized for where you are',
  demand: 'Lots of people want this fixed',
  portfolio: 'Two skills in one build',
  archetype: (name: string) => `Suits a ${name}`,
  suggested: 'Suggested by the team',
  gentle: 'A good place to start',
}

export const meta = {
  title: 'ForgeX 2.0',
  description: 'Find a problem worth three weeks of your life.',
}

export const wall = {
  face: (first: string, archetype: string | null) => (archetype ? `${first}, ${archetype}` : first),
  unplaced: 'Archetype to come',
  label: 'The 117 founders of ForgeX 2.0',
}

export const levels = {
  names: {
    arrive: 'Arrive',
    archetype: 'Archetype',
    profile: 'Profile',
    world: 'Your world',
    matches: 'Matches',
    why: 'Your why',
  },
  of: (at: number, of: number, name: string) => `Level ${at} of ${of}, ${name}`,
  card: 'Your founder card',
  signOut: 'Sign out',
}

/** Level 4. Six questions, about two minutes, every one with a way out. */
export const world = {
  intro: {
    title: 'Your world',
    lead: 'Six quick questions. Your answers decide which problems you see.',
  },
  industries: {
    ask: 'Which industries pull you in?',
    hint: 'Pick up to three.',
    other: 'Other',
    otherPlaceholder: 'Which one?',
  },
  side: {
    ask: 'Who do you want to build for?',
    options: { business: 'Businesses', consumer: 'Consumers', creator: 'Creators', unsure: 'Not sure yet' },
  },
  access: {
    ask: 'Who can you reach this week?',
    hint: 'People you can talk to beat ideas you are excited about.',
    other: 'Other',
    otherPlaceholder: 'Who?',
    worlds: (who: string) => `What world is ${who} in?`,
    elsewhere: 'Somewhere else',
    elsewherePlaceholder: 'Where?',
    none: 'Nobody yet',
    whoLabel: {
      family: 'your family business',
      relatives: "your relatives' work",
      internship: 'your past internship or job',
      parents: "your friends' parents",
      community: 'your community',
      other: 'them',
    },
  },
  learn: {
    ask: 'What do you want to learn by building?',
    hint: 'Pick up to three.',
    other: 'Other',
    otherPlaceholder: 'What?',
  },
  intent: {
    ask: 'What are you here for?',
  },
  comfort: {
    ask: 'How comfortable are you with tech today?',
    hint: 'No wrong answer. It only decides how big a problem we suggest.',
    stops: [
      "I use apps. I haven't built one.",
      "I've followed a few tutorials.",
      "I've built something small with AI tools.",
      "I've shipped something people used.",
      'I write code comfortably.',
    ],
  },
  next: 'Next',
  back: 'Back',
  done: 'Show my matches',
  saving: 'Finding your matches',
  error: "That didn't save. Your answers are still here. Try again.",
}

export const login = {
  title: 'Sign in',
  lead: 'Use your Mesa Google account.',
  google: 'Continue with Google',
  refused: {
    domain: "That account isn't on the ForgeX list. Use your forge27 Mesa account.",
    roster: "That account isn't in the ForgeX 2.0 cohort. If that's wrong, tell the team.",
    other: "Sign-in didn't finish. Try again.",
  },
  another: 'Use another account',
  mock: 'Mock sign-in',
  mockAs: (who: string) => `Sign in as ${who}`,
}

export const arrive = {
  hi: (first: string) => `Hi, ${first}.`,
  lead: 'About ten minutes. Six steps. At the end, a problem worth building.',
  path: [
    { name: 'Arrive', line: "You're here." },
    { name: 'Archetype', line: 'What kind of builder you are.' },
    { name: 'Profile', line: 'You, in your own words.' },
    { name: 'Your world', line: 'Who you can reach and what you want to learn.' },
    { name: 'Matches', line: 'Four problems picked for you.' },
    { name: 'Your why', line: 'Why you would build it. We answer every one.' },
  ],
  go: "Let's go",
  numbering: 'Numbering your card',
}

export const archetypeFlow = {
  intro: {
    title: 'What kind of builder are you?',
    lead: 'Seven quick questions. Go with your first instinct. There are no right answers.',
    start: 'Start',
    retakeTitle: 'One more go',
    retakeLead: 'Your newest answer replaces your archetype. You get this one retake.',
  },
  question: (at: number, of: number) => `${at} of ${of}`,
  back: 'Back',
  keys: 'Press 1, 2 or 3',
  placing: 'Placing you',
  retry: 'Try again',
  error: "That didn't save. Your answers are still here. Try again.",
  reveal: {
    youAre: "You're a",
    h1: (family: string, kind: string) => `In Hackathon 1 you came out a ${family}. More precisely, a ${kind}.`,
    strengths: 'Strengths',
    blindSpot: 'Blind spot',
    loves: 'Loves',
    keep: "That's me",
    next: 'Next',
    retake: 'Retake it',
    retakeUsed: 'Retake used',
    cardTitle: 'Your founder card',
    cardLead: 'It fills in as you go. Download it now, or wait until it carries your problem.',
    replay: 'Replay',
  },
}

export const profile = {
  heading: "This is you so far. Change anything that doesn't feel like you.",
  fromMesa: 'Your name and photo come from Mesa. Ask the team to change them.',
  bio: {
    label: 'One line about you',
    placeholder: 'One line a stranger should know about you.',
    required: 'One line is all we need.',
  },
  facts: {
    city: { label: 'Lives in', placeholder: 'Your city' },
    languages: { label: 'Speaks', placeholder: 'Add a language' },
    degree: { label: 'Studies', placeholder: 'Your degree' },
  },
  goodAt: {
    label: 'Good at today',
    placeholder: 'Add something',
    suggestions: ['Sales', 'Research', 'Writing', 'Design', 'Excel', 'Video', 'Coding', 'Public speaking', 'Operations'],
  },
  wantToLearn: {
    label: 'Wants to learn',
    placeholder: 'Add something',
    suggestions: ['AI agents', 'Voice AI', 'Full-stack web', 'Data', 'Product design', 'Growth marketing', 'Mobile apps'],
  },
  links: {
    label: 'Find me',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    portfolio: 'Portfolio or personal site',
    add: 'Add',
    placeholder: { github: 'github.com/you or @you', linkedin: 'linkedin.com/in/you', portfolio: 'yoursite.com' },
    invalid: "That doesn't look like a link we can use.",
  },
  edit: 'Edit',
  remove: (item: string) => `Remove ${item}`,
  saving: 'Saving',
  saved: 'Saved',
  failed: "That didn't save. Try again.",
  done: 'Looks like me',
  wall: {
    label: 'Show me on the founder wall',
    hint: 'The public wall on the ForgeX home page. Your first name, photo and archetype.',
  },
}
