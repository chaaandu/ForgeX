import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { normaliseEmail, roleForEmail } from '@/lib/roles'
import { studentByEmail } from '@/lib/students'
import type { Role } from '@/lib/types'

declare module 'next-auth' {
  interface Session {
    user: {
      role: Role
      firstName: string
      email: string
      name: string
      image: string
    } & DefaultSession['user']
  }
}

const mockMode = process.env.MOCK_BACKEND === 'true'

function firstNameOf(name: string | null | undefined, email: string): string {
  const fromName = (name ?? '')
    .trim()
    .split(/\s+/)
    .find((part) => part.length > 1)
  if (fromName) return fromName
  const local = email.split('@')[0] ?? ''
  const head = local.split(/[._-]/)[0] ?? local
  return head.charAt(0).toUpperCase() + head.slice(1)
}

/** Mock mode signs in with an email alone. Everything else still goes through Google. */
const mockProvider = Credentials({
  id: 'mock',
  name: 'Mock',
  credentials: { email: { label: 'Email', type: 'email' } },
  authorize(credentials) {
    const email = normaliseEmail(typeof credentials?.email === 'string' ? credentials.email : null)
    if (!email.includes('@')) return null
    // The domain rule is enforced in the signIn callback, the same as Google,
    // so a refused mock sign-in lands on the same page with the same message.
    const student = studentByEmail(email)
    return {
      id: email,
      email,
      name: student?.name ?? firstNameOf(null, email),
      image: student?.photo ?? '',
    }
  },
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: { params: { prompt: 'select_account' } },
      allowDangerousEmailAccountLinking: true,
    }),
    ...(mockMode ? [mockProvider] : []),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    signIn({ user }) {
      if (roleForEmail(user.email)) return true
      return '/login?error=domain'
    },
    jwt({ token, user }) {
      const extra = token as typeof token & {
        role?: Role
        firstName?: string
        picture?: string | null
      }
      const email = normaliseEmail(user?.email ?? extra.email)
      const role = roleForEmail(email)
      if (!role) return extra

      const roster = studentByEmail(email)
      const name = user?.name ?? extra.name ?? roster?.name ?? email
      const photo = user?.image ?? extra.picture ?? roster?.photo ?? ''

      extra.email = email
      extra.name = name
      extra.role = role
      extra.firstName = roster?.firstName ?? firstNameOf(name, email)
      extra.picture = photo
      return extra
    },
    session({ session, token }) {
      const extra = token as typeof token & {
        role?: Role
        firstName?: string
        picture?: string | null
      }
      session.user.email = extra.email ?? ''
      session.user.name = extra.name ?? ''
      session.user.image = extra.picture ?? ''
      session.user.role = extra.role ?? 'student'
      session.user.firstName = extra.firstName ?? ''
      return session
    },
  },
})
