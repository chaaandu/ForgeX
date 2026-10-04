import 'server-only'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
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
