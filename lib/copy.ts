/**
 * Every string the user can read. Nothing here is generated or interpolated
 * anywhere else, so this file is the whole of the app's voice.
 */

export const copy = {
  login: {
    label: 'ForgeX 2.0',
    line: "200+ problems. Bet on the one you'd build.",
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
