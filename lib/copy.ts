/**
 * Every string the user can read. Nothing here is generated or interpolated
 * anywhere else, so this file is the whole of the app's voice.
 */

export const copy = {
  login: {
    label: 'ForgeX 2.0',
    line: '100+ problems.',
    lineTwo: "Bet on the one you'd build.",
    button: 'Continue with Google',
    underButton: 'Use your Mesa School account.',
  },

  /** Shown on its own when somebody signs in with an account we do not take. */
  refused: {
    label: 'ForgeX 2.0',
    line: "That's not a Mesa account.",
    help: 'Sign in with your Mesa School account.',
    button: 'Try another account',
  },

  header: {
    greeting: (firstName: string) => `Hey ${firstName}.`,
    studentNoBet: (open: number, total: number, closes: string) =>
      `${open} of ${total} still open · Closes ${closes} IST`,
    studentHasBet: (id: string, title: string) => `Your bet: ${id} · ${title}`,
    team: (taken: number, total: number) => `${taken} of ${total} problems backed so far.`,
  },

  filters: {
    openOnly: 'Open only',
    typeLabel: 'Type',
  },

  card: {
    taken: (name: string) => `Backed by ${name}`,
    own: 'Your bet',
    buildLabel: 'Build',
  },

  modal: {
    cta: 'I would bet on it',
    ctaMoving: 'Move my bet here',
    movingLine: (currentId: string, currentTitle: string) =>
      `This frees up ${currentId} · ${currentTitle}.`,
    ownBet: 'Your bet',
    undo: 'Take it back',

    /** The first pick is free. After that a student has three changes. */
    changesLeft: (n: number) =>
      n === 0 ? 'No changes left' : n === 1 ? '1 change left' : `${n} changes left`,
    /** Under the first bet button, so nobody commits without knowing the rule. */
    firstBetNote: 'You can change your pick 3 times after this.',
    /** Under the move button, so the cost of moving is visible before the tap. */
    movingCost: (n: number) =>
      n === 1 ? 'This is your last change.' : `You'll have ${n - 1} left after this.`,
    confirmLast: 'This is your last change. After it, your pick is final.',
    confirmLastYes: 'Move anyway',
    confirmLastNo: 'Keep what I have',
    finalBet: 'Your pick is final.',
    lockedElsewhere: "You've used all 3 changes",
    takenByOther: (name: string) => `Backed by ${name}`,
    teamNobody: 'Open',
    closed: 'Bets are closed.',
    sections: {
      problem: 'Problem',
      who: 'Who experiences it',
      why: 'Why it matters',
      challenge: 'Challenge',
      northStar: 'North star metric',
      directions: 'Directions (examples)',
      constraints: 'Constraints',
      build: 'Build expectation',
      tools: 'Tech stack',
    },
  },

  toast: {
    race: (name: string) => `${name} just backed this one. Pick another.`,
    saveFailed: "That didn't save. Try again.",
    locked: "You've used all 3 changes. Your pick is final.",
  },

  empty: {
    line: 'Nothing matches.',
    link: 'Clear filters',
  },

  backendDown: 'Bets are paused for a minute. Browsing still works.',

  stampRing: (ddMmm: string) => `BET · FORGEX 2.0 · ${ddMmm}`,

  avatarMenu: {
    signOut: 'Sign out',
  },
} as const
