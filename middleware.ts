import { NextResponse } from 'next/server'
import { auth } from '@/auth'

/** Everything but /login and the auth routes needs a session. */
export default auth((request) => {
  const { pathname } = request.nextUrl
  const open =
    pathname === '/login' ||
    pathname.startsWith('/api/auth') ||
    (pathname.startsWith('/api/mock') && process.env.MOCK_BACKEND === 'true')
  if (open || request.auth) return NextResponse.next()

  const login = new URL('/login', request.nextUrl.origin)
  return NextResponse.redirect(login)
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|students|.*\\.png$).*)',
  ],
}
