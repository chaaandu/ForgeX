import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { normaliseEmail, roleForEmail } from '@/lib/roles'
import { isMock } from '@/lib/store/mode'
import { inCohort, studentByEmail } from '@/lib/students'
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
    ...(isMock() ? [mockProvider] : []),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    signIn({ user }) {
      const role = roleForEmail(user.email)
      if (!role) return '/login?error=domain'
      // A founder-domain account that is not on the ForgeX roster is refused
      // here, with its own message, rather than let in to a 404.
      if (role === 'founder' && !inCohort(normaliseEmail(user.email))) return '/login?error=roster'
      return true
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

      // A founder's name and photo are Mesa's, from the roster, not whatever
      // their Google account happens to say.
      const roster = role === 'founder' ? studentByEmail(email) : undefined
      const name = roster?.name ?? user?.name ?? extra.name ?? email
      const photo = roster?.photo ?? user?.image ?? extra.picture ?? ''

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
      session.user.role = extra.role ?? 'founder'
      session.user.firstName = extra.firstName ?? ''
      return session
    },
  },
})
