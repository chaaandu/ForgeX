import 'server-only'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import { founderByEmail, type Founder } from '@/lib/data/founders'
import type { Role } from './types'

export type Viewer = {
  email: string
  name: string
  firstName: string
  photo: string
  role: Role
}

export async function getViewer(): Promise<Viewer | null> {
  const session = await auth()
  if (!session?.user?.email) return null
  return {
    email: session.user.email,
    name: session.user.name ?? '',
    firstName: session.user.firstName ?? '',
    photo: session.user.image ?? '',
    role: session.user.role,
  }
}

export async function requireViewer(): Promise<Viewer> {
  const viewer = await getViewer()
  if (!viewer) redirect('/login')
  return viewer
}

/** A founder and their row. The team is sent to the console; anyone off the roster gets a 404. */
export async function requireFounder(): Promise<{ viewer: Viewer; founder: Founder }> {
  const viewer = await requireViewer()
  if (viewer.role !== 'founder') redirect('/team')
  const founder = await founderByEmail(viewer.email)
  if (!founder) notFound()
  return { viewer, founder }
}

export async function requireTeam(): Promise<Viewer> {
  const viewer = await requireViewer()
  if (viewer.role !== 'team') notFound()
  return viewer
}
