/**
 * Every word a founder or the team reads, in one place. The rules are in
 * docs/VOICE.md and the copy lint enforces them: no banned words, buttons
 * under 24 characters, no exclamation marks outside the reveal and the card,
 * no decorative quote marks. Choices among options are in docs/COPY_CHOICES.md.
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
    identity: 'You map the ground before you take a step.',
    strengths: [
      'You find the real question under the obvious one',
      'You turn a mess into a picture others can follow',
    ],
    blindSpot: 'The map can quietly become the work.',
    loves:
      'Problems tangled in information. Search, research, dashboards, AI that reads and explains.',
  },
  scout: {
    name: 'Scout',
    identity: "You'd rather ask 10 people than guess once.",
    strengths: [
      'You talk to people before you decide anything',
      'You notice what everyone else walks past',
    ],
    blindSpot: "You keep exploring when it's time to commit.",
    loves:
      'Problems you only understand by being there. Communities, voice, WhatsApp, quick prototypes.',
  },
  inventor: {
    name: 'Inventor',
    identity: 'You make the first version while others are still planning.',
    strengths: [
      'You have a working version before anyone else',
      "You're at home with tools that came out this month",
    ],
    blindSpot: 'Speed hides the reason it worked.',
    loves: 'AI agents, new models, creative and consumer tools.',
  },
  tinkerer: {
    name: 'Tinkerer',
    identity: 'You make it work today and make it good tomorrow.',
    strengths: [
      'You turn quick fixes into tools people rely on',
      'You improve things in small, safe steps',
    ],
    blindSpot: 'You can build before asking whether anyone needs it.',
    loves: 'Automation, integrations and the internal tools small businesses run on.',
  },
  strategist: {
    name: 'Strategist',
    identity: 'You see the whole board before your first move.',
    strengths: [
      'Your plans survive contact with reality',
      'You split work so a team can move at once',
    ],
    blindSpot: 'A shape drawn too early is the wrong shape.',
    loves: 'Operations for businesses, data models and full-stack products.',
  },
  builder: {
    name: 'Builder',
    identity: 'You make a plan, then prove it works.',
    strengths: ['You build structure with fast feedback', 'You finish what you start'],
    blindSpot: 'You can polish the plan longer than the problem deserves.',
    loves: 'Payments, platforms and anything with a hard technical edge.',
  },
}

/** The seven questions, in the founder's words. Scoring lives in lib/archetype.ts. */
export const trial: Record<string, { prompt: string; options: Record<string, string> }> = {
  'new-city': {
    prompt: 'You have 3 days in a new city. What do you do first?',
    options: { read: 'Read up before you go', walk: 'Walk out and see', plan: 'Plan all 3 days' },
  },
  'new-tool': {
    prompt: 'The last time you learned a new tool, what did you do first?',
    options: {
      read: 'Read how it worked',
      use: 'Played with it until it clicked',
      tutorial: 'Followed a tutorial',
    },
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
    prompt: 'In a team of 4, what do you do without being asked?',
    options: {
      agree: "Get everyone agreeing on what we're building",
      rough: 'Make the first rough version',
      split: 'Split up who does what',
    },
  },
  'bad-instructions': {
    prompt: 'The instructions look wrong. What do you do?',
    options: { why: 'Work out why', own: 'Try your own way', follow: 'Follow them, then say so' },
  },
  'it-broke': {
    prompt: "It worked yesterday. Today it doesn't. What do you do?",
    options: {
      changed: 'Find what changed',
      tweak: 'Change things until it works',
      rollback: 'Go back to the version that worked',
    },
  },
  'better-way': {
    prompt: 'Halfway through, you see a better way. What now?',
    options: {
      finish: 'Finish this part, then decide',
      think: 'Stop and think it through',
      scrap: 'Scrap it and rebuild',
    },
  },
}

export const landing = {
  kicker: 'ForgeX',
  lineStart: "Don't start with an idea.",
  lineEm: 'Start with a problem.',
  sub: "Find one. Prove it's real. Then build.",
  enter: 'Enter',
  building: {
    title: "What they're building",
    lead: 'They found a problem, made their case, and got the go.',
    empty: 'No one has the go yet. The first founders to get it will show up here.',
    open: (name: string) => `Open ${name}'s page`,
  },
}

export const problem = {
  build: "I'll build this",
  writeOwn: 'None of these? Write your own.',
  learn: "What you'll learn",
  challenge: 'Challenge',
  whyFits: 'Why this fits you',
  close: 'Close',
}

export const card = {
  number: (n: number, of: number) => `#${String(n).padStart(3, '0')} / ${of}`,
  unnumbered: 'ForgeX',
  original: 'Original',
  noArchetype: 'Archetype to come',
  building: 'Building',
  download: 'Download card',
  share: 'Share',
  shareText: (name: string) => `${name} on ForgeX`,
  footer: { brand: 'FORGEX', school: 'MESA SCHOOL OF BUSINESS' },
}

/** Why a problem was matched. Each one names a factor that actually scored. */
export const chips = {
  access: 'You know someone who has this',
  industry: (short: string) => `${short}, your pick`,
  side: {
    business: 'Businesses, your pick',
    consumer: 'Consumers, your pick',
    creator: 'Creators, your pick',
  },
  stretch: 'A stretch you can finish',
  sized: 'Sized for where you are',
  demand: 'Many people want this fixed',
  portfolio: '2 skills in 1 build',
  archetype: (name: string) => `Suits a ${name}`,
  suggested: 'The team suggested this',
  gentle: 'A good place to start',
}

export const meta = {
  title: 'ForgeX',
  template: '%s · ForgeX',
  description:
    "Don't start with an idea. Start with a problem. Find one, prove it's real, then build.",
  brand: 'ForgeX home',
  pages: {
    signIn: 'Sign in',
    arrive: 'Arrive',
    archetype: 'Archetype',
    profile: 'Profile',
    world: 'Your world',
    matches: 'Matches',
    writeOwn: 'Write your own',
    why: 'Your why',
    console: 'Console',
    consoleTemplate: '%s · Console',
    founders: 'Founders',
    queue: 'Queue',
    bank: 'Bank',
    setup: 'Setup check',
  },
}

export const notFound = {
  title: "This page isn't here.",
  lead: 'The link may be old, or have a typo.',
  home: 'Go to the start',
}

export const crashed = {
  title: "This page didn't load.",
  lead: 'Nothing you wrote is lost. Try again in a moment.',
  retry: 'Try again',
}

export const wall = {
  face: (first: string, archetype: string | null) => (archetype ? `${first}, ${archetype}` : first),
  label: 'The founders of ForgeX',
}

export const levels = {
  names: {
    arrive: 'Arrive',
    archetype: 'Archetype',
    profile: 'Profile',
    world: 'Your world',
    matches: 'Matches',
    own: 'Your problem',
    why: 'Your why',
  },
  of: (at: number, of: number, name: string) => `Step ${at} of ${of}: ${name}`,
  card: 'Your founder card',
}

/** Level 4. Six questions, about two minutes, every one with a way out. */
export const world = {
  intro: {
    title: 'Your world',
    lead: 'Six quick questions. Your answers decide which problems you see.',
  },
  industries: {
    ask: 'Which industries pull you in?',
    other: 'Other',
    otherPlaceholder: 'Sports',
  },
  side: {
    ask: 'Who do you want to build for?',
    options: {
      business: { label: 'Businesses', sub: 'Shops, clinics, factories, offices.' },
      consumer: {
        label: 'Everyday people',
        sub: 'Patients, parents, renters, job seekers. Paying for themselves.',
      },
      creator: {
        label: 'People who earn on their own',
        sub: 'Drivers, sellers, farmers, freelancers, creators.',
      },
      unsure: { label: 'Not sure yet', sub: "We'll show you a mix." },
    },
  },
  access: {
    ask: 'Who can you reach this week?',
    hint: "People you can talk to beat ideas you're excited about.",
    other: 'Other',
    otherPlaceholder: 'My cricket club',
    worlds: (who: string) => `Which industry is ${who} in?`,
    elsewhere: 'Somewhere else',
    pickBelow: 'Pick where, below',
    elsewherePlaceholder: 'Pharma distribution',
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
    other: 'Other',
    otherPlaceholder: 'Blockchain',
  },
  intent: {
    ask: 'What are you here for?',
  },
  comfort: {
    ask: 'How comfortable are you with tech today?',
    hint: "There's no wrong answer. It sets how ambitious your matches are.",
    stops: [
      "I use apps. I haven't built one.",
      "I've followed a few tutorials.",
      "I've built something small with AI tools.",
      "I've shipped something people used.",
      'I write code comfortably.',
    ],
  },
  of: (at: number, of: number) => `Question ${at} of ${of}`,
  picked: (n: number, max: number) => `${n} of ${max} picked`,
  next: 'Next',
  back: 'Back',
  done: 'Show my matches',
  doneOwn: 'Next: your problem',
  saving: 'Finding your matches',
  error: "That didn't save. Your answers are still here. Try again.",
}

export const login = {
  title: 'Sign in',
  lead: 'Use your Mesa Google account.',
  google: 'Continue with Google',
  refused: {
    domain: "That's not a Mesa founder account. Sign in with your @forge27.mesaschool.co address.",
    roster: "This account isn't on the ForgeX roster. If it should be, message the Mesa team.",
    other: "Sign-in didn't finish. Try again in a moment.",
  },
  another: 'Use another account',
  mock: 'Mock sign-in',
  mockAs: (who: string) => `Sign in as ${who}`,
}

export const arrive = {
  hi: (first: string) => `Hi, ${first}.`,
  /** Two lines on purpose: the promise gets a line of its own. */
  lead: ['6 steps. By the last one,', "you'll have a problem worth building."],
  steps: 'The 6 steps',
  path: [
    { name: 'Arrive', line: "You're here." },
    { name: 'Archetype', line: 'The kind of builder you are.' },
    { name: 'Profile', line: 'You, in your own words.' },
    { name: 'Your world', line: "Tell us which problems you'd want to solve." },
    {
      name: 'Matches',
      line: '4 problems picked for you.',
      own: { name: 'Your problem', line: 'Bring the problem you want to solve.' },
    },
    { name: 'Your why', line: 'Make your case. We reply to every one.' },
  ],
  go: 'Find my archetype',
  numbering: 'Numbering your card',
}

export const archetypeFlow = {
  intro: {
    title: 'What kind of builder are you?',
    lead: '7 questions. Answer on instinct.',
    start: 'Find out',
    retakeTitle: 'One more go',
    retakeLead: 'Your new result replaces the old one. This is your only retake.',
  },
  question: (at: number, of: number) => `${at} of ${of}`,
  back: 'Back',
  placing: 'Working out your archetype',
  retry: 'Try again',
  error: "That didn't save. Your answers are still here. Try again.",
  reveal: {
    youAre: "You're a",
    exclaim: '!',
    h1: (family: string, kind: string) =>
      `Hackathon 1 placed you as a ${family}. More precisely, a ${kind}.`,
    strengths: 'Strengths',
    blindSpot: 'Blind spot',
    loves: 'Loves',
    keep: "That's me",
    next: 'Next: your profile',
    retake: 'Retake the quiz',
    retakeUsed: 'Retake used',
    cardTitle: 'Your founder card',
    cardLead: 'It fills in as you go. Download it now, or wait until it carries your problem.',
  },
  portraitAlt: {
    cartographer: 'Cartographer, holding a compass, a map under one arm',
    alchemist: 'Alchemist, in goggles, holding a glowing flask',
    architect: 'Architect, in a visor, beside a glowing blueprint',
  },
}

export const profile = {
  heading: "This is you so far. Change anything that doesn't feel like you.",
  bio: {
    label: 'One line about you',
    placeholder: "I sell my mum's pickles on Instagram and want it to be a real business.",
    required: 'Add one line about you to carry on.',
    add: 'Add one line about you',
  },
  facts: {
    city: { label: 'Lives in', icon: '📍', placeholder: 'Pune' },
    languages: { label: 'Speaks', icon: '🗣️', placeholder: 'Marathi' },
    degree: { label: 'Studies', icon: '🎓', placeholder: 'BBA, Commerce and Management' },
  },
  goodAt: {
    label: 'Good at today',
    icon: '💪',
    placeholder: 'Cold calling',
    suggestions: [
      'Sales',
      'Research',
      'Writing',
      'Design',
      'Excel',
      'Video',
      'Coding',
      'Public speaking',
      'Operations',
    ],
  },
  wantToLearn: {
    label: 'Wants to learn',
    icon: '🌱',
    placeholder: 'Voice AI',
    suggestions: [
      'AI agents',
      'Voice AI',
      'Full-stack web',
      'Data',
      'Product design',
      'Growth marketing',
      'Mobile apps',
    ],
  },
  links: {
    label: 'Find me',
    icon: '🔗',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    portfolio: 'Portfolio or personal site',
    add: 'Add',
    placeholder: {
      github: 'github.com/ananya',
      linkedin: 'linkedin.com/in/ananya-rao',
      portfolio: 'ananya.dev',
    },
    invalid: "That link won't work here. Paste the full address, like github.com/ananya.",
  },
  edit: 'Edit profile',
  editProfile: 'Edit profile',
  finishEditing: 'Done editing',
  empty: 'Not added yet',
  remove: (item: string) => `Remove ${item}`,
  suggestions: (label: string) => `${label}, suggestions`,
  fieldEdit: (label: string, value: string) => `${label}: ${value}. Edit`,
  saving: 'Saving',
  saved: 'Saved',
  failed: "That didn't save. Try again.",
  done: 'Looks like me',
}

export const matches = {
  title: '4 problems picked for you.',
  lead: 'All 4 are open. Who has it, and what to build, is yours to find.',
  gentleTitle: 'Good places to start.',
  gentleLead:
    'Your answers were specific, so here are 4 open problems that make a strong first build.',
  again: "Fresh matches, with the team's suggestions first.",
  empty: {
    title: 'The problem bank opens soon.',
    lead: 'Your 4 matches appear here when it does. If a problem is already on your mind, write it up now.',
  },
  waiting: (title: string) => `You sent your why for ${title}. Picking another one replaces it.`,
  writeOwn: 'None of these? Write your own.',
  writeOwnLead: "Same shape as ours: a title, what's broken and the challenge.",
  changeAnswers: 'Change my answers',
  suggestedNote: 'The team suggested this',
}

export const why = {
  heading: "Tell us why you want to build this. We'll tell you if it's the right fit for you.",
  for: 'You picked',
  change: 'Pick another',
  prompts: {
    whyProblem: {
      label: 'Why this problem?',
      placeholder:
        "My uncle's shop runs out of its best sellers every week, and he only finds out at the counter.",
    },
    whyUser: {
      label: 'Who would use what you build, and why?',
      placeholder: 'Shop owners like him, who restock from memory and lose a few sales every day.',
    },
    whyPay: {
      label: 'Why would they pay for it, or how would it make money?',
      placeholder: 'He already pays ₹500 a month for billing software. Lost sales cost him more.',
    },
    contact: {
      label: 'Who could you talk to about it this week?',
      optional: 'Optional',
      placeholder: 'My uncle, and the 2 shops either side of his',
    },
  },
  nudges: {
    solution: "That's a solution. What's broken before it exists?",
    person: 'Picture one person. Who are they?',
    money: 'Who hands over money, and for what?',
    short: 'A little more. 2 or 3 sentences is plenty.',
    prescribes: 'Set the task, not the product.',
    title: 'Under 10 words.',
  },
  words: (n: number) => `${n} ${n === 1 ? 'word' : 'words'}`,
  send: 'Send my why',
  sending: 'Sending',
  failed: "That didn't send. Everything you wrote is still here. Try again.",
  closed: (when: string) => `Picks closed on ${when}.`,
  locked: "The team has answered this pick, so it's settled.",
  sent: {
    title: 'Sent.',
    lead: "Your card now carries your problem. We read every why and reply to each one. You'll see our reply on your profile within 24 hours.",
    go: 'See my profile',
  },
}

export const composer = {
  title: 'Write your own',
  lead: "Same shape as ours. Say what's broken, not what you'll build.",
  ownTitle: 'What problem will you solve?',
  ownLead: "Say what's broken, not what you'll build. The team reads it with your why.",
  fields: {
    title: { label: 'Title', placeholder: 'Weekend markets lose their regulars by Monday' },
    problem: {
      label: 'The problem',
      placeholder:
        "Stall owners can't tell regulars where they'll be next week, so footfall depends on luck.",
    },
    challenge: {
      label: 'The challenge',
      placeholder: 'Help a stall keep its regulars between markets.',
    },
    industry: 'Which industry is it in?',
    side: 'Who has this problem?',
  },
  next: 'Next: your why',
  back: 'Back to matches',
}

export const page = {
  continue: (level: string) => `Continue: ${level}`,
  building: 'Building',
  noPick: 'No pick yet.',
  waiting: "You'll see our response here.",
  headline: {
    go: "Go. This one's yours.",
    tweak: 'Go, with a tweak. Read our note first.',
    talk: "Let's talk. We'll find 15 minutes this week.",
    another: "Let's find you a better fit.",
  },
  pickAnother: 'Pick another instead',
  backToMatches: 'Back to matches',
  status: {
    waiting: 'Waiting',
    go: 'Go',
    tweak: 'Go, with a tweak',
    talk: "Let's talk",
    another: 'Try another',
  },
  thread: 'Your why and our replies',
  threadTeam: 'Their why and our replies',
  sections: {
    problem: 'Your problem',
    theirProblem: 'Their problem',
    profile: 'Your profile',
    theirProfile: 'Profile',
  },
  you: 'You',
  team: 'The ForgeX team',
  /** What the team sees in place of the line above: which of us wrote it. */
  teamBy: (who: string) => `${who}, for the team`,
  sentOn: (date: string) => `Sent ${date}`,
  withdrawnOn: (date: string) => `You withdrew this on ${date}`,
  console: 'Console',
  suggested: 'Try one of these',
  own: 'Your own problem',
  teamOnly: 'Team only',
  teamFields: {
    email: 'Email',
    track: 'Track',
    h1: 'Hackathon 1',
    level: 'Level reached',
    active: 'Last active',
    world: 'Their world',
    comfort: 'Tech comfort',
    intent: 'Here for',
    access: 'Can reach',
  },
}

/** The team's account menu. Founders have none. */
export const account = {
  open: (who: string) => `Account: ${who}`,
  signOut: 'Sign out',
}

export const consoleCopy = {
  nav: { label: 'Console', founders: 'Founders', queue: 'Queue', bank: 'Bank' },
  founders: {
    title: 'Founders',
    search: 'Search founders',
    searchPlaceholder: 'Ananya',
    export: 'Export CSV',
    columns: {
      name: 'Founder',
      archetype: 'Archetype',
      level: 'Level',
      pick: 'Pick',
      status: 'Status',
      active: 'Last active',
    },
    all: 'All',
    none: 'No founders match.',
    noPick: '—',
    statuses: {
      none: 'No pick',
      waiting: 'Waiting',
      go: 'Go',
      tweak: 'Tweak',
      talk: 'Talk',
      another: 'Try another',
    },
  },
  queue: {
    title: 'Queue',
    empty: 'No one is waiting. Every why has a reply.',
    oldest: 'Oldest first',
    waitingFor: (time: string) => `Sent ${time}`,
    types: { go: 'Go', tweak: 'Go, with a tweak', talk: "Let's talk", another: 'Try another' },
    keys: { go: 'G', tweak: 'W', talk: 'L', another: 'A' },
    note: 'Note to the founder',
    notePlaceholder: 'What you liked, what to change, what to try. They read every word.',
    noteNeeded: 'A tweak needs a note.',
    suggest: 'Suggest problems',
    suggestPlaceholder: 'kirana',
    suggestResults: 'Matching problems',
    send: 'Send reply',
    respond: 'Reply',
    responseType: 'Type of reply',
    theirOwn: 'Their own problem',
    pickNumber: (n: number) => `pick ${n}`,
    facts: {
      industries: (list: string) => `Industries: ${list}`,
      side: (side: string) => `For: ${side}`,
      reach: (list: string) => `Can reach: ${list}`,
      nobody: 'nobody yet',
      learn: (list: string) => `Learn: ${list}`,
      intent: (intent: string) => `Here for: ${intent}`,
      comfort: (n: number) => `Tech comfort: ${n} of 5`,
      goodAt: (list: string) => `Good at ${list}`,
      wants: (list: string) => `Wants to learn ${list}`,
    },
    sent: 'Sent',
    failed: "That didn't send. Try again.",
    help: 'J and K move, G W L A choose, N writes a note, ⌘ Enter sends.',
    their: 'Their world',
    profile: 'Profile',
    open: 'Open their page',
  },
  bank: {
    title: 'Bank',
    filters: { draft: 'Drafts', approved: 'Live', rejected: 'Archived', all: 'All' },
    levels: { all: 'Any difficulty' },
    approve: 'Approve',
    reject: 'Archive',
    draft: 'Take down',
    restore: 'Restore to drafts',
    means: {
      draft: "Founders don't see drafts.",
      approved: 'Live. Founders can be matched to this.',
      rejected: 'Archived. Founders never see it.',
    },
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    approveAll: (n: number) => `Approve all ${n} drafts`,
    evidence: 'Evidence',
    scores: 'Scores',
    whyNow: 'Why now',
    players: "Who's there already",
    empty: 'No problems with this status.',
    status: { draft: 'Draft', approved: 'Live', rejected: 'Archived' },
    fields: {
      title: 'Title',
      problem: 'Problem',
      challenge: 'Challenge',
      difficulty: 'Difficulty',
    },
    strength: (n: number) => `Signal strength ${n} of 5`,
    editedBy: (who: string, date: string) => `${who} · ${date}`,
  },
  wall: 'The wall',
  setup: {
    title: 'Setup check',
    allGood: 'Everything is wired up.',
    failing: (n: number) => (n === 1 ? '1 thing needs fixing.' : `${n} things need fixing.`),
    pass: 'Working',
    fail: 'Needs fixing',
    signIn: 'Google sign-in',
    signInOk: 'Working. You signed in to see this page.',
    set: 'Set',
    missing: 'Not set',
    mock: 'Mock mode',
    mockOn: 'On. Nothing is read from or written to the Sheet. Remove MOCK_BACKEND.',
    mockOff: 'Off. The Sheet is the store.',
    sheet: 'Google Sheet',
    sheetMissing: 'SHEET_ID, GOOGLE_SA_EMAIL or GOOGLE_SA_KEY is not set.',
    sheetOk: 'Reached with the service account.',
    sheetSkipped: 'Not checked while mock mode is on.',
    rows: (n: number) => `${n} rows`,
    bank: 'Problems live',
    live: (n: number) => `${n} approved. Founders can be matched.`,
    noneLive: 'None approved. Founders will see no matches until you approve the bank.',
    closed: (date: string) => `${date}. That has passed, so picks are locked.`,
    email: 'Reply emails',
    emailOn: 'On, through Resend.',
    emailOff: 'Off. Replies show on founder pages only. That is fine.',
  },
}

/** Reply emails. One subject per reply, chosen in docs/COPY_CHOICES.md. */
export const email = {
  subject: {
    go: (title: string) => `You're building ${title}`,
    tweak: (title: string) => `One change, then build ${title}`,
    talk: (title: string) => `Before you build ${title}, let's talk`,
    another: () => 'A few problems we think fit you better',
  },
  hi: (first: string) => `Hi ${first},`,
  readMore: 'Read the full reply on your profile:',
  fallbackTitle: 'your problem',
  signOff: 'The ForgeX team',
}
