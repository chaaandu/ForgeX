/**
 * The problem bank is switched off for the build plan. Its data stays in the
 * Sheet (Problems and Problems internal), and the team can read it again in
 * the console by setting PROBLEM_BANK=on. Founders never see it either way.
 */
export function bankOn(): boolean {
  return process.env.PROBLEM_BANK === 'on'
}
