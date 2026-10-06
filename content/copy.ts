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
  line: 'Find a problem worth three weeks of your life.',
  open: (count: number) => `${count} open problems`,
  enter: 'Enter',
}

export const problem = {
  build: "I'll build this",
  writeOwn: 'None of these? Write your own.',
  learn: "What you'll learn",
}

export const card = {
  number: (n: number, of: number) => `#${String(n).padStart(3, '0')} / ${of}`,
  original: 'Original',
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
