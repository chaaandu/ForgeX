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
    lead: 'Who each founder is building for. Live links appear once the team has seen them work.',
    empty: 'Nobody has sent their research yet. Founders show up here once they do.',
    open: (name: string) => `Open ${name}'s profile`,
    live: 'Open the app',
  },
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
    challenge: 'The challenge',
    start: 'Your 3 weeks',
    research: 'Your research',
    today: 'Today',
    plan: 'Your plan',
    stops: 'Phases',
    stop: (n: string) => `Phase ${n}`,
    pod: 'Your pod',
    console: 'Console',
    consoleTemplate: '%s · Console',
    founders: 'Founders',
    bank: 'Bank',
    pods: 'Pods',
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
    challenge: 'The challenge',
  },
  of: (at: number, of: number, name: string) => `Step ${at} of ${of}: ${name}`,
  card: 'Your founder card',
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
  lead: ['4 steps. By the last one,', "you'll have your challenge."],
  steps: 'The 4 steps',
  path: [
    { name: 'Arrive', line: "You're here." },
    { name: 'Archetype', line: 'The kind of builder you are.' },
    { name: 'Profile', line: 'You, in your own words.' },
    { name: 'The challenge', line: 'One problem, for all 117 of you.' },
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
    cardLead: 'It fills in as you go, and takes its finish when you start building.',
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
    required: '(required)',
    addGithub: 'Add your GitHub',
    addLinkedin: 'Add your LinkedIn',
    needed: 'Add your GitHub and LinkedIn to carry on.',
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

/** The one problem everyone gets. The owner's statement, set to land on a phone. */
export const challenge = {
  kicker: 'The challenge',
  title: '2 lakh kiranas closed in a single year.',
  facts: [
    { figure: '2 lakh', line: 'kiranas shut down in one year', source: 1 },
    { figure: '60%', line: 'of Mumbai grocers near dark stores now sell less', source: 1 },
    {
      figure: '1,000–1,500',
      line: "items on a kirana's shelf. Too few to match a dark store on price or range.",
      source: 2,
    },
  ],
  factsLabel: 'How it happens',
  body: 'A kirana needs hundreds of loyal households to survive on thin margins. A handful of them switching to an app can be enough to close it.',
  question: {
    lead: 'Help a kirana keep its loyal households ordering from it,',
    em: 'rather than from the nearest dark store.',
  },
  sources: {
    label: 'Sources',
    links: [
      {
        name: 'Retailer federation, reported Dec 2025',
        href: 'https://www.socialnews.xyz/2025/12/10/rapid-rise-of-quick-commerce-hampering-kirana-shops-income-industry-body/amp/',
      },
      {
        name: 'Tech Geography, Mar 2025',
        href: 'https://techgeography.substack.com/p/kiranapro-challenging-quick-commerce',
      },
    ],
    opens: (name: string) => `${name}, opens in a new tab`,
  },
  start: 'Take the challenge',
  starting: 'Opening your 3 weeks',
  failed: "That didn't go through. Try again in a moment.",
}

/** After the challenge: the 3 weeks, at a glance, and the way into Today. */
export const kickoff = {
  title: 'Go keep a kirana open.',
  lead: ['By 26 Oct, a real kirana should be using', 'what you built.'],
  go: "See what's on today",
  askTitle: "What you'll do",
  asks: [
    'Go to the kiranas near you, and talk to their regulars.',
    'Find out why households leave, and why some stay.',
    'Build your answer, and put it in a real shop.',
  ],
  depth:
    "We won't give you the answer. The owners will, if you listen. Get it working for one shop before you build for many.",
  calendar: {
    title: 'Your 3 weeks',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    month: 'October 2026',
    today: 'Today',
    short: {
      research: 'Research',
      figma: 'Figma',
      cursor: 'Cursor',
      cloud: 'Supabase',
      vercel: 'Vercel',
      stop: (n: string) => `Phase ${n}`,
      pitch: 'Pitch day',
      checkin: '1:1s',
      venture: 'Venture',
    },
    legend: {
      research: 'Research',
      build: 'Building',
      stop: 'Phase due, 6 pm',
      pitch: 'Pitch day',
      workshop: 'Session',
      checkin: 'Check-ins',
    },
    /** Dates come from lib/plan.ts; only the words live here. */
    agenda: {
      research: {
        title: 'Research',
        what: 'Talk to kirana owners and their regulars. Building opens when you send it.',
      },
      figma: { title: 'Figma session', what: 'An introduction to designing your screens.' },
      cursor: {
        title: 'Cursor and GitHub Copilot session',
        what: 'Write your first code, with AI beside you.',
      },
      stop1: { title: 'Phase 1 · MVP version 1', what: 'A first version on your own live link.' },
      pitch: {
        title: 'AI Sprint · Pitch day',
        what: 'Pitch your MVP version 1 live, in 3 minutes.',
      },
      cloud: {
        title: 'Google Cloud and Supabase session',
        what: 'Google sign-in and a real database.',
      },
      vercel: { title: 'Vercel session', what: 'Your app, live and fast.' },
      stop2: { title: 'Phase 2 · Live product', what: 'Live, with Google sign-in and real data.' },
      stop3: {
        title: 'Phase 3 · Real users',
        what: 'Real owners using it, and a 3-minute Loom demo.',
      },
      checkins: {
        title: 'Keep building',
        what: 'A one-to-one check-in with Pragati and Chandu.',
      },
      venture: {
        title: 'Venture Building launch',
        what: 'For those going further with tech and AI.',
      },
    },
    at6: (day: string) => `${day}, 6 pm`,
    range: (from: string, to: string) => `${from} to ${to}`,
  },
}

/** Days 1 and 2. The research lives in a doc the founder's mentor has seen. */
export const research = {
  title: 'Send your research.',
  lead: 'Your mentor has been through your doc. Add it here, and your build days open.',
  forWho: 'Who exactly are you building for?',
  forWhoPlaceholder: 'Kirana owners near new dark stores in Jayanagar',
  forWhoHint: 'Which kiranas, where, and whose regulars. The narrower, the better.',
  problem: 'What you found, in 3 lines',
  problemPlaceholder:
    'Regulars still drop in for milk, but the monthly list now goes to an app. The owner only notices when they stop coming.',
  doc: 'Your research doc',
  docHint: 'A Google Doc, shared so anyone with the link can comment.',
  docPlaceholder: 'docs.google.com/document/d/...',
  badDoc: 'Paste a Google Docs or Drive link.',
  mentor: 'My mentor has gone through it and approved it',
  save: 'Save for later',
  saving: 'Saving',
  saved: 'Saved',
  send: 'Send my research',
  sending: 'Sending',
  update: 'Save changes',
  failed: "That didn't save. Everything you wrote is still here. Try again.",
}

/** Today, the plan, and every step in it. Words for each step are in content/plan.ts. */
export const plan = {
  nav: {
    label: 'Your build',
    today: 'Today',
    plan: 'Plan',
    stops: 'Phases',
    profile: 'Profile',
    pod: 'Pod',
  },
  day: (n: string, of: string) => `Day ${n} of ${of}`,
  before: 'Starts Fri 9 Oct',
  over: 'The sprint is over. Keep it running for your owners.',
  nextStop: (n: string) => `Phase ${n} due`,
  inTime: (left: string) => `in ${left}`,
  units: { day: 'd', hour: 'h', minute: 'min' },
  allStopsDone: 'All 3 phases are in.',
  workshopToday: (name: string) => `Today: ${name}`,
  workshopOn: (name: string) => name,
  pitchToday: 'Today: AI Sprint · Pitch day for phase 1',
  pitchOn: 'AI Sprint · Pitch day',
  commit: 'Every day: commit your work to GitHub.',
  checkins: 'This week, Pragati and Chandu meet each of you, one to one.',
  fixes: 'Fixes from the team',
  today: 'Today',
  upNext: 'Up next',
  allDone: 'All done for today. Work ahead in your plan if you like.',
  due: (day: string) => `Due ${day}`,
  doneMeans: 'Done means',
  toolTitle: 'Tool',
  example: 'For example',
  openCard: (n: string) => `Open card ${n}`,
  openPrompt: 'Open the website prompt',
  openTemplate: 'Open the research template',
  autoTick: {
    research: 'This ticks itself when you send your research.',
    stop: (n: string) => `This ticks itself when you send phase ${n}.`,
  },
  tool: (name: string) => `Tool: ${name}`,
  tick: (title: string) => `Mark done: ${title}`,
  untick: (title: string) => `Mark not done: ${title}`,
  more: (title: string) => `Show more: ${title}`,
  save: 'Save',
  saved: 'Saved',
  saving: 'Saving',
  needed: 'Add this first, then tick it.',
  badLink: {
    github: "Paste your repo's link, like github.com/you/your-app.",
    live: 'Paste the full address of your live app.',
    design: 'Paste a Figma or Google Drive link.',
    video: 'Paste your Loom share link, like loom.com/share/abc.',
    doc: 'Paste the full address, starting with https.',
    research: 'Paste a Google Docs or Drive link.',
    producthunt: 'Paste your Product Hunt link, like producthunt.com/posts/your-product.',
    screenshot: 'Paste a Google Drive link to the screenshot.',
  },
  badNumber: 'A whole number, like 7.',
  failed: "That didn't save. Try again in a moment.",
  openStop: (n: string) => `Open phase ${n}`,
  openResearch: 'Open your research',
  research: 'Your research',
  locked: 'Opens when you send your research.',
  lockedNote: 'Your build days open when you send your research.',
  stretch: {
    pick: 'Pick 2',
    own: 'Or propose your own',
    ownPlaceholder: 'Owners can reorder with one tap',
    chosen: (n: string) => `${n} of 2 chosen`,
  },
  title: 'Your plan',
  lead: 'Every step until 30 Oct. Work ahead whenever you like.',
  progress: (done: string, of: string) => `${done} of ${of} done`,
  phases: {
    research: 'Research',
    week1: 'Week 1 · Build it',
    week2: 'Week 2 · Make it real',
    week3: 'Week 3 · Real owners',
    after: 'After phase 3',
  },
  tools: {
    names: {
      claude: 'Claude Pro',
      figma: 'Figma',
      cursor: 'Cursor',
      copilot: 'GitHub Copilot',
      github: 'GitHub',
      supabase: 'Supabase',
      gcloud: 'Google Cloud',
      vercel: 'Vercel',
      owners: 'Owners',
    },
    lines: {
      claude: 'Thinking, planning, and understanding code.',
      figma: 'Design, if you like designing first.',
      cursor: 'Where you write code, with AI beside you.',
      copilot: 'Writes code with you, inside Cursor.',
      github: 'Where your code lives. Commit every day.',
      supabase: 'Sign-in, your database and storage.',
      gcloud: 'The Google sign-in client, and a free Gemini key.',
      vercel: 'Puts your app on a live link.',
      owners: 'Real owners, in person or on a call.',
    },
  },
  workshops: {
    figma: 'Figma session',
    cursor: 'Cursor and GitHub Copilot session',
    cloud: 'Google Cloud and Supabase session',
    vercel: 'Vercel session',
  },
}

/** The 3 phases, each due at 6 pm. Field labels per track are in content/plan.ts. */
export const stops = {
  title: 'Phases',
  lead: 'At the end of each phase, the team sees your work and replies with a rating and notes.',
  names: { '1': 'MVP version 1', '2': 'Live product', '3': 'Real users' },
  heading: (n: string, name: string) => `Phase ${n} · ${name}`,
  closes: (when: string) => `Due ${when}`,
  closed: (when: string) => `Closed ${when}`,
  state: {
    none: 'Not started',
    draft: 'Draft saved',
    sent: 'Sent',
    late: 'Sent late',
    locked: 'Locked',
  },
  sentNote: (when: string) => `Sent ${when}. You can change it until 6 pm.`,
  lateNote: (when: string) => `Sent late, on ${when}.`,
  lockedNote: 'Locked at 6 pm. This is what the team sees.',
  closedNote: 'This closed at 6 pm. You can still send it once, and it will show as late.',
  researchTitle: 'Your research',
  researchNote: 'Sent. The team reads it with this phase.',
  optional: 'Optional',
  yes: 'Yes',
  save: 'Save draft',
  saving: 'Saving',
  send: (n: string) => `Send phase ${n}`,
  sendChanges: 'Send changes',
  sending: 'Sending',
  saved: 'Draft saved',
  sentNow: 'Sent. The team will review it.',
  required: "This one's needed to send.",
  failed: "That didn't save. Everything you wrote is still here. Try again.",
  locked: 'This phase is locked. The team has what you sent.',
  order: (n: string) => `Send phase ${n} first. This one opens after it.`,
  opensAfter: (n: string) => `Opens after phase ${n}`,
  open: 'Open',
  review: {
    title: 'From the team',
    ratings: { green: 'On track', amber: 'A few fixes', red: "Let's meet tomorrow" },
    lines: {
      green: 'Keep going.',
      amber: "Work through the fixes. We'll check in within 2 days.",
      red: "We'll meet tomorrow, one to one, and agree a smaller scope.",
    },
    fixes: 'Your fix list',
    waiting: 'The team will review it after 6 pm.',
  },
  stretchOwn: (text: string) => `Your own: ${text}`,
}

export const page = {
  continue: (level: string) => `Continue: ${level}`,
  you: 'You',
  team: 'The ForgeX team',
  console: 'Console',
  sections: {
    profile: 'Your profile',
    theirProfile: 'Profile',
    build: 'Your build',
    theirBuild: 'Their build',
  },
  building: {
    forWho: 'Building for',
    problem: 'The problem',
    notYet: 'Their research is on its way.',
    yoursNotYet: 'Your build appears here once you send your research.',
  },
  links: {
    title: 'Links',
    live: 'Live app',
    repo: 'Code',
    design: 'Design',
    video: 'Demo on Loom',
    research: 'Research doc',
    producthunt: 'Product Hunt',
    none: 'No links yet.',
  },
  progress: (done: string, of: string) => `${done} of ${of} steps done`,
  social: {
    label: (name: string) => `Find ${name} online`,
    github: (name: string) => `${name} on GitHub`,
    linkedin: (name: string) => `${name} on LinkedIn`,
    live: (name: string) => `${name}'s live app`,
    site: (name: string) => `${name}'s personal site`,
    tips: { github: 'GitHub', linkedin: 'LinkedIn', live: 'Live app', site: 'Portfolio' },
  },
  grid: {
    title: 'Day by day',
    days: { mon: 'Mon', wed: 'Wed', fri: 'Fri' },
    less: 'Less',
    more: 'More',
    day: (label: string, done: string, of: string) => `${label}: ${done} of ${of} steps done`,
    planned: (label: string, of: string) => `${label}: ${of} steps planned`,
    rest: (label: string) => `${label}: no steps`,
    doneOf: (done: string, of: string) => `${done} of ${of} done`,
    plannedOf: (of: string) => `${of} planned`,
    none: 'No steps this day.',
  },
  stopSent: 'Sent',
  stopLate: 'Sent late',
  stopNot: 'Not yet',
  teamOnly: 'Team only',
  teamFields: {
    email: 'Email',
    track: 'Track',
    pod: 'Pod',
    h1: 'Hackathon 1',
    level: 'Onboarding',
    active: 'Last active',
    steps: 'Steps',
  },
  podOf: (n: string) => `Pod ${n}`,
  mentorOf: (n: string) => `Mentor, pod ${n}`,
  checkins: {
    title: 'Check-in notes',
    lead: 'From the 1:1s, 27 to 30 Oct. Founders never see these.',
    label: 'New check-in note',
    placeholder: 'What they showed, where they are stuck, what we agreed.',
    add: 'Save note',
    none: 'No check-in notes yet.',
    failed: "That didn't save. Try again.",
  },
}

/** A founder's card, shared in public, and its link preview. */
export const share = {
  title: (name: string) => `${name} on ForgeX`,
  building: (forWho: string) => `Building for ${forWho.charAt(0).toLowerCase()}${forWho.slice(1)}.`,
  about:
    "117 founders at Mesa School of Business, 3 weeks, one challenge: keep India's kiranas open.",
  open: 'See their profile',
  home: 'See ForgeX',
  footer: 'FORGEX · MESA SCHOOL OF BUSINESS',
  text: (name: string) => `${name}'s founder card, from ForgeX at Mesa School of Business.`,
  copied: 'Link copied',
}

/** The team's account menu. Founders have none. */
export const account = {
  open: (who: string) => `Account: ${who}`,
  signOut: 'Sign out',
}

export const consoleCopy = {
  nav: {
    label: 'Console',
    founders: 'Founders',
    stops: 'Phases',
    pods: 'Pods',
    bank: 'Bank',
  },
  founders: {
    title: 'Founders',
    search: 'Search founders',
    searchPlaceholder: 'Ananya',
    export: 'Export CSV',
    columns: {
      name: 'Founder',
      track: 'Track',
      pod: 'Pod',
      forWho: 'Building for',
      steps: 'Steps',
      behind: 'Behind',
      stop: 'Phases',
      active: 'Last active',
    },
    /** Where each founder is in onboarding, then building. */
    steps: ['Not started', 'Arrived', 'Archetype', 'Profile', 'Researching', 'Building'],
    all: 'All',
    allTracks: 'All tracks',
    allPods: 'All pods',
    noPod: 'No pod',
    behindOnly: 'Behind',
    none: 'No founders match.',
    dash: '—',
    stepsOf: (done: string, due: string) => `${done} / ${due}`,
    behindBy: (n: string) => `${n} behind`,
    filters: 'Filters',
  },
  stops: {
    title: (n: string, name: string) => `Phase ${n} · ${name}`,
    closes: (when: string) => `Closes ${when}`,
    pick: 'Phase',
    filters: {
      all: 'All',
      notSent: 'Not sent',
      unrated: 'To review',
      green: 'Green',
      amber: 'Amber',
      red: 'Red',
    },
    late: 'Late',
    draft: 'Draft only',
    sentAt: (when: string) => `Sent ${when}`,
    rating: 'Rating',
    ratings: { green: 'Green', amber: 'Amber', red: 'Red' },
    notes: 'Notes to the founder',
    notesPlaceholder: 'What works, what to change. They read every word.',
    fixes: 'Fix list',
    fixesHint: 'One fix per line. Each becomes a tick on their Today.',
    fixesPlaceholder: 'Sign-in fails on the live link',
    save: 'Save review',
    saving: 'Saving',
    saved: 'Saved',
    failed: "That didn't save. Try again.",
    reviewedBy: (who: string, when: string) => `${who} · ${when}`,
    none: 'No founders match.',
    empty: 'Nothing sent',
    research: 'Research',
    counts: (sent: string, of: string) => `${sent} of ${of} sent`,
    open: 'Review',
    close: 'Close',
  },
  pods: {
    title: 'Pods',
    lead: '5 pods with daily standups. Each pod has a peer mentor from the volunteers.',
    pod: (n: string) => `Pod ${n}`,
    members: (n: string) => `${n} founders`,
    mentors: 'Mentors',
    noMentor: 'No mentor yet',
    unassigned: 'Not in a pod',
    move: (name: string) => `Pod for ${name}`,
    addMentor: (n: string) => `Add a mentor to pod ${n}`,
    pickMentor: 'Pick a mentor',
    remove: (name: string) => `Remove ${name}`,
    none: 'None',
    failed: "That didn't save. Try again.",
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
    plan: 'The plan',
    planLine: (stop: string, when: string) => `Next: phase ${stop}, ${when}.`,
    planOver: 'All 3 phases have closed.',
    bank: 'Problem bank',
    bankOn: 'On. The team can read it in the console. Founders never see it.',
    bankOff: 'Off. Its data stays in the Sheet. Set PROBLEM_BANK=on to read it here.',
  },
  mentor: {
    title: (n: string) => `Pod ${n}`,
    lead: "The founders you mentor: today's steps, and anything overdue.",
    none: "You're not mentoring a pod.",
    today: 'Today',
    behind: 'Behind',
    active: 'Last active',
  },
}
