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
  enter: 'Enter',
  building: {
    title: "What they're building",
    lead: 'One founder, one problem, one product.',
    empty: ['Nobody is building yet.', 'Founders show up here once their problem is approved.'],
    open: (name: string) => `Open ${name}'s profile`,
    progress: (value: number) => `${value}% done`,
  },
}

export const problem = {
  build: "I'll build this",
  picking: 'Picking',
  failed: "That didn't save. Try again.",
  locked: 'You already have a problem, and a pick is final.',
  final: "This is final. You can't swap once you pick.",
  closed: 'Picking is closed.',
  challenge: 'Your 2-day challenge',
  expect: 'What we expect',
  further: 'Go further',
  learn: "You'll work with",
  others: (n: number) => (n === 1 ? '1 other picked this' : `${n} others picked this`),
  close: 'Close',
  /** The floor for every build, whatever the problem. The owner's list. */
  everyone: {
    title: 'For every build',
    list: [
      'A working product on a live link, not slides.',
      'It works with real data. Nothing fake or hardcoded.',
      'One core flow that works from start to finish.',
      'AI doing a real job in it, not a chatbot on the side.',
      'Responsive: it works on a phone and a desktop.',
      'You can say who it is for and why they need it.',
      'You make the pitch deck yourself. No AI-generated decks.',
    ],
    beyond: 'This is the minimum. Go as far beyond it as you like.',
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
  description: "Don't start with an idea. Start with a problem.",
  brand: 'ForgeX home',
  pages: {
    signIn: 'Sign in',
    arrive: 'Arrive',
    archetype: 'Archetype',
    profile: 'Profile',
    problem: 'Your problem',
    world: 'Your interests',
    matches: 'Pick a problem',
    home: 'Home',
    stage: (name: string) => name,
    console: 'Console',
    consoleTemplate: '%s · Console',
    founders: 'Progress',
    reviews: 'Reviews',
    history: 'Problem history',
    picks: 'Picks',
    screen: 'Big screen',
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
    world: 'Your interests',
    matches: 'Pick a problem',
  },
  of: (at: number, of: number, name: string) => `Step ${at} of ${of}: ${name}`,
  card: 'Your founder card',
}

/** Three questions, about a minute, every one with a way out. */
export const world = {
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
  learn: {
    ask: 'What do you want to build with?',
    hint: "Pick what you'd enjoy. You can still use anything on the day.",
  },
  of: (at: number, of: number) => `Question ${at} of ${of}`,
  picked: (n: number, max: number) => `${n} of ${max} picked`,
  next: 'Next',
  back: 'Back',
  done: 'Show my problems',
  saving: 'Finding your problems',
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

/** Before the portal opens: one screen, for every founder, whatever page they ask for. */
export const gate = {
  title: 'Not open yet.',
  lead: (when: string) => `ForgeX opens on ${when}. This page opens by itself then.`,
}

export const arrive = {
  hi: (first: string) => `Hi, ${first}.`,
  /** Two lines on purpose: the promise gets a line of its own. */
  lead: ['3 quick steps. Then you bring', 'the problem you want to solve.'],
  steps: 'The steps',
  path: [
    { name: 'Arrive', line: "You're here." },
    { name: 'Archetype', line: 'The kind of builder you are.' },
    { name: 'Profile', line: 'You, with your GitHub and LinkedIn.' },
    { name: 'Your problem', line: 'A real problem, with your research behind it.' },
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
    retake: 'Retake the test',
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
  heading: 'Where can people find your work?',
  lead: 'Add your GitHub and LinkedIn. They go on your page, so your reviewer, your POC and the cohort can see what you build.',
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
    label: 'Your links',
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
  edit: 'Add a portfolio',
  editProfile: 'Edit my links',
  finishEditing: 'Done editing',
  empty: 'Not added yet',
  remove: (item: string) => `Remove ${item}`,
  suggestions: (label: string) => `${label}, suggestions`,
  fieldEdit: (label: string, value: string) => `${label}: ${value}. Edit`,
  saving: 'Saving',
  saved: 'Saved',
  failed: "That didn't save. Try again.",
  done: 'Next: my problem',
}

/** The bank: only for a founder without an approved problem once the window has closed. */
export const matches = {
  title: '4 problems picked for you.',
  moreTitle: '4 others for you.',
  lead: "Choose with care. Once you pick one, it's yours.",
  gentleTitle: 'Good places to start.',
  gentleLead: 'Nothing matched your answers closely, so here are 4 strong first builds.',
  empty: {
    title: 'The problems are on their way.',
    lead: 'Check back in a few minutes.',
  },
  next: 'Show 4 others',
  previous: 'Back to the last 4',
  changeAnswers: 'Change my answers',
}

/** A founder's own problem: the 3Ps and the research behind them, sent for review. */
export const ownProblem = {
  title: 'Your problem',
  lead: 'A real problem, the person who has it, and the research that proves it.',
  due: (when: string) =>
    `Get it approved by ${when}. Send it early, so there is time to change it if it comes back.`,
  reviewer: (name: string) => `${name} will review it.`,
  someone: 'Your reviewer',
  hint: "Not sure how to research it? Mihirr's session recording on Nexus walks you through it.",
  threeP: 'The 3Ps',
  research: 'Your research',
  fields: {
    industry: { label: 'Which industry is it in?' },
    industryOther: { label: 'Which industry is it?' },
    title: {
      label: 'Name it in a few words',
      placeholder: 'Weekend markets lose their regulars',
      help: 'Under 10 words.',
    },
    person: {
      label: 'Person: who has this problem?',
      placeholder: 'Stall owners at weekend markets in Pune who sell every Saturday.',
      help: 'One kind of person, in one place. Be specific.',
    },
    problem: {
      label: "Problem: what's broken for them?",
      placeholder: "They can't tell regulars where they will be next, so sales depend on luck.",
      help: 'How often it happens, and what it costs them.',
    },
    promise: {
      label: 'Promise: what changes for them?',
      placeholder: 'Their regulars always know where to find them, and keep coming back.',
      help: 'The difference you make for them, not the product.',
    },
    plan: {
      label: 'Your plan',
      placeholder: 'Talk to 5 more stall owners this week, then build a page where a stall posts its next market.',
      help: "What you have done so far, and what you'll do next.",
    },
    primary: {
      label: 'Primary research',
      placeholder: 'drive.google.com/drive/folders/1AbC',
      help: 'Your user interviews: recordings and notes. Make sure anyone with the link can view it.',
    },
    secondary: {
      label: 'Secondary research',
      placeholder: 'docs.google.com/document/d/1AbC',
      help: 'What you read: reports, articles, data. Make sure anyone with the link can view it.',
    },
  },
  required: '(required)',
  errors: {
    required: 'This one is required.',
    link: 'Paste a full link, like drive.google.com/drive/folders/1AbC.',
  },
  send: 'Send for review',
  sendAgain: 'Send it again',
  sending: 'Sending',
  edit: 'Edit and send again',
  cancel: 'Cancel',
  failed: "That didn't send. Everything you wrote is still here. Try again.",
  states: {
    waiting: {
      title: 'In review.',
      lead: (name: string) => `${name} will reply here. You can still change it and send it again.`,
    },
    approved: { title: 'Approved.', lead: 'Your problem is approved. Start building.' },
    changes: {
      title: 'Approved, with changes.',
      lead: 'Your problem is approved. Make the changes in the note as you build.',
    },
    rejected: {
      title: 'Not approved yet.',
      lead: 'Read the note, change your problem and send it again.',
    },
    rejectedClosed: {
      title: 'Not approved.',
      lead: 'The window has closed, so pick a problem from our bank.',
    },
    closed: {
      title: 'The window has closed.',
      lead: 'No problem was sent in time, so pick one from our bank.',
    },
  },
  note: (name: string) => `Note from ${name}`,
  version: (n: number) => `Version ${n}`,
  sentOn: (when: string) => `Sent ${when}`,
  earlier: 'Earlier versions',
  bank: 'Pick from the bank',
  bankSoon: (when: string) => `The bank opens on ${when}.`,
  bankInstead: 'Rather not wait? You can pick from the bank instead.',
}

/** A founder's home: how far they have got, what is next, and when. */
export const home = {
  nav: { label: 'Hackathon', home: 'Home', problem: 'My problem', profile: 'Profile' },
  title: (first: string) => `Hi, ${first}.`,
  progress: (n: number) => `${n}% done`,
  progressLabel: 'Progress',
  parts: {
    problem: 'Problem',
    scope: 'Scope',
    prototype: 'Prototype',
    launch: 'Launch',
    pitch: 'Pitch',
  },
  progressRead: (value: number, done: string) =>
    done ? `${value}% done: ${done}.` : `${value}% done.`,
  next: 'What to do next',
  allDone: 'All 5 steps are in. Well done.',
  steps: {
    problem: { name: 'Your problem', line: 'The 3Ps and your research, approved by your reviewer.' },
    bank: { name: 'Your problem', line: 'Picked from our bank. Add the research behind it.' },
    bankDone: { name: 'Your problem', line: 'Picked from our bank, with your research.' },
    scope: { name: 'MVP scope', line: 'One Doc: what your MVP does, and what it leaves out.' },
    prototype: {
      name: 'Prototype',
      line: 'Your GitHub repo, a prototype link and proof of progress.',
    },
    launch: { name: 'Launch', line: 'Your live link, a LinkedIn post and your documentation.' },
    pitch: { name: 'Pitch', line: 'Your pitch deck, and a Loom of at least 5 minutes.' },
  },
  due: (when: string) => `Due ${when}`,
  approveBy: (when: string) => `Approved by ${when}`,
  addBy: (when: string) => `Add it by ${when}`,
  states: {
    todo: 'To do',
    locked: 'Opens once your problem is approved',
    waiting: 'In review',
    approved: 'Approved',
    changes: 'Approved with changes',
    rejected: 'Not approved yet',
    bank: 'Picked from the bank',
    started: 'Started',
    done: 'Submitted',
    missed: 'Missed',
  },
  actions: {
    write: 'Write my problem',
    view: 'View my problem',
    fix: 'Fix and send again',
    pick: 'Pick from the bank',
    add: 'Add my links',
    resume: 'Keep going',
    change: 'Change what I sent',
    view2: 'View what I sent',
  },
  missed: 'Missed a deadline? Talk to Pragati or the Forge team.',
  research: {
    title: 'Add your research',
    lead: 'Even with our problem, show the research behind what you build.',
    save: 'Save my research',
    saved: 'Saved',
  },
  floor: 'For every build',
  pocKicker: 'Your POC',
  pocUnknown: 'To be named',
  pocLead: 'Your point of contact at Mesa. Go to them whenever you get stuck.',
  reviewerKicker: 'Your reviewer',
  reviewerLead: 'They approve your problem before you build.',
  left: (time: string) => `${time} left`,
  units: { day: 'd', hour: 'h', minute: 'min' },
  closed: 'Closed',
  opening: 'Opening',
  kicker: "You're building",
  n8n: 'Built it in n8n? Export the workflow into your repo.',
}

/** The three submissions after the problem, each with its own deadline. */
export const submit = {
  titles: {
    scope: 'Your MVP scope',
    prototype: 'Your prototype',
    launch: 'Your launch',
    pitch: 'Your pitch',
  },
  leads: {
    scope: 'What your MVP will do in these 2 days, and what it will not.',
    prototype: 'Your code, your prototype, and proof of how far you have got.',
    launch: 'Your product live, and the story of how you built it.',
    pitch: 'Your deck, and a Loom that shows it working on real data.',
  },
  due: (when: string) => `It saves as you go, and locks on ${when}.`,
  dueSoft: (when: string) => `It saves as you go. Add it by ${when}.`,
  required: '(required)',
  fields: {
    scope: {
      label: 'MVP scope document',
      placeholder: 'docs.google.com/document/d/1AbC',
      help: 'A Google Doc: what your MVP does, and what it leaves out. Make sure anyone with the link can view it.',
    },
    github: {
      label: 'GitHub repo',
      placeholder: 'github.com/ananya/kirana-orders',
      help: 'A public repo. Built in n8n? Put the exported workflow in it.',
    },
    prototype: {
      label: 'Prototype link',
      placeholder: 'kirana-orders.vercel.app',
      help: 'A link where your prototype works.',
    },
    proof: {
      label: 'Proof of progress',
      placeholder: 'drive.google.com/drive/folders/1AbC',
      help: 'Screenshots or a screen recording, in a Drive folder. Make sure anyone with the link can view it.',
    },
    linkedin: {
      label: 'LinkedIn post',
      placeholder: 'linkedin.com/posts/ananya-rao_forgex',
      help: 'A post about building it. Paste the link to the post itself.',
    },
    linkedinMore: {
      label: 'More posts',
      placeholder: 'linkedin.com/posts/ananya-rao_day-2',
      help: 'Posted more than once? Add up to 4 more, one link per line.',
    },
    live: {
      label: 'Live link on Vercel',
      placeholder: 'kirana-orders.vercel.app',
      help: 'Your product, open to anyone with the link.',
    },
    docs: {
      label: 'Documentation',
      placeholder: 'docs.google.com/document/d/1AbC',
      help: 'User journeys, your research, how you used AI and your tech stack, in one Doc. Make sure anyone with the link can view it.',
    },
    deck: {
      label: 'Pitch deck',
      placeholder: 'docs.google.com/presentation/d/1AbC',
      help: 'Google Slides or Docs. Make it yourself: no AI-generated decks. Make sure anyone with the link can view it.',
    },
    video: {
      label: 'Loom video',
      placeholder: 'loom.com/share/1a2b3c',
      help: 'At least 5 minutes. Show the problem, who it is for, what it solves, the workflow, and it working on real data.',
    },
  },
  errors: {
    required: 'This one is required.',
    scope: 'Paste a Google Doc or Drive link.',
    github: 'Paste the link to the repo, like github.com/ananya/kirana-orders.',
    prototype: 'Paste a full link, like kirana-orders.vercel.app.',
    proof: 'Paste a full link, like drive.google.com/drive/folders/1AbC.',
    linkedin: 'Paste the link to the post, not your profile.',
    linkedinMore: 'Each line needs a link to a LinkedIn post.',
    live: 'Paste the link to the live product, not the repo or a doc.',
    docs: 'Paste a Google Doc or Drive link.',
    deck: 'Paste a Google Slides, Docs or Drive link.',
    video: 'Paste a Loom link, like loom.com/share/1a2b3c.',
  },
  warnings: {
    private: "This isn't open to everyone yet. Set sharing to anyone with the link.",
    broken: "This link doesn't open. Check it and paste it again.",
    repo: 'This repo is private. Make it public so the judges can see it.',
  },
  deckHint: "Not sure how to make your pitch deck? Refer to Mohit Kataria's pitch deck session on Nexus.",
  saving: 'Saving',
  saved: 'Saved',
  failed: "That didn't save. What you typed is still here. Try again.",
  send: {
    scope: 'Submit my MVP scope',
    prototype: 'Submit my prototype',
    launch: 'Submit my launch',
    pitch: 'Submit my pitch',
  },
  sendAgain: 'Save changes',
  change: 'Change something',
  sending: 'Submitting',
  fix: 'Fix the fields marked above, then submit.',
  sent: {
    title: 'Submitted.',
    lead: (when: string) => `We have it. You can still change it until ${when}.`,
    leadSoft: 'We have it. You can still change it.',
  },
  locked: 'This step is closed. What you submitted is what we have.',
  lockedEmpty: 'This closed before you submitted. Talk to Pragati or the Forge team.',
  notYet: 'This opens once your problem is approved.',
  reopened: 'The team has reopened this for you. Submit it as soon as you can.',
  back: 'Back to home',
  added: (n: number, of: number) => `${n} of ${of} added.`,
  list: 'What to submit',
  listLead: (count: number, when: string) => `All ${count}, by ${when}.`,
  done: 'Added',
  todo: 'Add',
}

export const page = {
  continue: (level: string) => `Continue: ${level}`,
  building: 'Building',
  progress: (n: number) => `${n}% done`,
  sections: {
    problem: 'Your problem',
    theirProblem: 'Their problem',
    profile: 'Your links',
    theirProfile: 'Find them online',
    built: 'What you submitted',
    theirBuilt: 'What they built',
    history: 'Their problem, version by version',
  },
  threeP: { person: 'Person', problem: 'Problem', promise: 'Promise', plan: 'Plan' },
  links: {
    primary: 'Primary research',
    secondary: 'Secondary research',
    scope: 'MVP scope',
    github: 'GitHub repo',
    prototype: 'Prototype',
    proof: 'Proof of progress',
    live: 'Live link',
    docs: 'Documentation',
    deck: 'Pitch deck',
    linkedin: 'LinkedIn post',
    linkedinMore: 'More posts',
    video: 'Loom video',
  },
  social: {
    label: (name: string) => `Find ${name} online`,
    github: (name: string) => `${name} on GitHub`,
    linkedin: (name: string) => `${name} on LinkedIn`,
    live: (name: string) => `${name}'s live app`,
    site: (name: string) => `${name}'s personal site`,
    tips: { github: 'GitHub', linkedin: 'LinkedIn', live: 'Live app', site: 'Portfolio' },
  },
  console: 'Console',
  teamOnly: 'Team view only',
  teamFields: {
    email: 'Email',
    h1: 'Hackathon 1',
    stage: 'Where they are',
    active: 'Last active',
    world: 'Their answers',
    reviewer: 'Reviewer',
    group: 'Group',
    poc: 'POC',
    progress: 'Progress',
  },
  review: 'Open in reviews',
  reopen: {
    title: 'Reopen a deadline',
    open: (step: string) => `Reopen ${step}`,
    close: (step: string) => `Close ${step}`,
    on: (steps: string) => `Reopened: ${steps}.`,
    failed: "That didn't save. Try again.",
    steps: {
      problem: 'Problem',
      scope: 'MVP scope',
      prototype: 'Prototype',
      launch: 'Launch',
      pitch: 'Pitch',
    },
  },
}

/** The team's account menu. Founders have none. */
export const account = {
  open: (who: string) => `Account: ${who}`,
  signOut: 'Sign out',
}

export const consoleCopy = {
  nav: {
    label: 'Console',
    founders: 'Progress',
    reviews: 'Reviews',
    history: 'History',
    picks: 'Picks',
    bank: 'Bank',
    screen: 'Big screen',
  },
  founders: {
    title: 'Progress',
    ofTotal: (total: number) => `of ${total}`,
    search: 'Search founders',
    searchPlaceholder: 'Ananya',
    export: 'Export CSV',
    columns: {
      name: 'Founder',
      pick: 'Problem',
      reviewer: 'Reviewer',
      progress: 'Progress',
      links: 'Links',
      active: 'Last active',
    },
    ticks: {
      scope: 'MVP scope',
      github: 'Repo',
      prototype: 'Prototype',
      proof: 'Proof of progress',
      live: 'Live link',
      docs: 'Documentation',
      deck: 'Pitch deck',
      video: 'Loom',
    },
    has: (item: string) => `Open the ${item.toLowerCase()}`,
    /** Where each founder is before they send a problem, for the Status column. */
    steps: ['Not signed in yet', 'Arrived', 'Archetype', 'Profile', 'Writing their problem'],
    statusFilter: 'Status',
    anyStatus: (total: number) => `Any status (${total})`,
    statusOption: (word: string, count: number) => `${word} (${count})`,
    industries: 'Industry',
    anyIndustry: 'Any industry',
    reviewers: 'Reviewer',
    anyReviewer: 'Any reviewer',
    none: 'No founders match.',
    noPick: '—',
    bank: 'From the bank',
    reopened: 'Reopened',
    statuses: { none: 'Not started', review: 'In review', building: 'Building', done: 'Done' },
  },
  reviews: {
    title: 'Reviews',
    lead: 'Every problem waiting for an answer, oldest first.',
    leadAnswered: 'Every problem with an answer, newest first. You can change one.',
    views: { label: 'Reviews view', waiting: 'Waiting', answered: 'Answered' },
    scope: { label: 'Students', mine: 'Mine', all: 'Everyone' },
    empty: 'Nothing waiting. Every problem has an answer.',
    emptyAnswered: 'No answers yet.',
    version: (n: number) => `Version ${n}`,
    sent: (when: string) => `Sent ${when}`,
    industry: 'Industry',
    decisions: { approved: 'Approve', changes: 'Approve with changes', rejected: 'Reject' },
    answers: { approved: 'Approved', changes: 'Approved with changes', rejected: 'Rejected' },
    decision: 'Your answer',
    note: 'Note to the student',
    notePlaceholder: 'What is strong, what to change, and what to research next.',
    noteNeeded: 'Add a note for this answer.',
    send: 'Send answer',
    sending: 'Sending',
    failed: "That didn't send. Try again.",
    readOnly: 'Only the reviewers and the super admin can answer.',
    notYours: (name: string) => `${name} reviews this student.`,
    earlier: 'Earlier versions and answers',
    answeredBy: (who: string, when: string) => `${who} · ${when}`,
    change: 'Change the answer',
  },
  history: {
    title: 'Problem history',
    lead: 'Every problem sent and every answer, one line each.',
    columns: {
      time: 'Time',
      name: 'Founder',
      version: 'Version',
      event: 'What happened',
      by: 'By',
      title: 'Problem',
      notes: 'Note',
    },
    search: 'Search by name',
    searchPlaceholder: 'Ananya',
    empty: 'Nothing has been sent yet.',
  },
  picks: {
    title: 'Picks',
    lead: (picked: number, total: number) => `${picked} of ${total} founders have a problem to build.`,
    kinds: { all: 'All', own: 'Their own problems', bank: 'From the bank' },
    columns: { problem: 'Problem', industry: 'Industry', who: 'Founders' },
    ownTag: 'Their own',
    fromBank: (no: string) => `Bank · ${no}`,
    empty: {
      all: 'Nobody has a problem to build yet.',
      own: 'No own problem is approved yet.',
      bank: 'Nobody has picked from the bank yet.',
    },
  },
  screen: {
    titles: {
      problem: 'Problems approved',
      scope: 'MVP scopes submitted',
      prototype: 'Prototypes submitted',
      launch: 'Launches submitted',
      pitch: 'Pitches submitted',
    },
    of: (total: number) => `of ${total}`,
    left: 'left',
    closed: 'Time is up.',
    building: (n: number) => `${n} building`,
    review: (n: number) => `${n} in review`,
    faces: 'Founders who have done this step',
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
    unscoped: 'No 2-day version, so founders are never offered it.',
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
      task: '2-day challenge',
      expect: 'What we expect',
      further: 'Go further',
    },
    perLine: 'One bullet per line.',
    invalid: 'A 2-day version needs a challenge and at least 3 bullets.',
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
    bank: 'Problems on offer',
    live: (n: number) => `${n} approved with a 2-day version. Founders can be matched.`,
    noneLive: 'None on offer. Approve the bank, and run pnpm sheet:hackathon for the 2-day versions.',
    pocs: 'POCs',
    pocsOk: (n: number, of: number) => `${n} of ${of} founders have a POC on their row.`,
    pocsMissing: 'No founder has a POC yet. Run pnpm sheet:groups to fill the Group, Reviewer and POC columns.',
    opens: 'Portal opens',
    problemsClose: 'Own problems close',
    bankOpens: 'Bank opens',
    stages: {
      scope: 'MVP scope due',
      prototype: 'Prototype due',
      launch: 'Launch due',
      pitch: 'Pitch due',
    },
    reviewers: 'Reviewers',
    reviewersOk: (n: number, of: number) => `${n} of ${of} founders have a reviewer on their row.`,
    reviewersMissing: 'No founder has a reviewer yet. Write one name a founder in the Reviewer column.',
    passed: (when: string) => `${when}. That has passed.`,
  },
}
