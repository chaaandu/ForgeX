'use server'

import { signOut } from '@/auth'
import { getViewer } from '@/lib/session'

/** Signs the team out. Founders have no way out, by design: one account, one cohort. */
export async function signOutTeam(): Promise<void> {
  const viewer = await getViewer()
  if (viewer?.role !== 'team') return
  await signOut({ redirectTo: '/' })
}
