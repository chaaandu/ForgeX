import { NextResponse } from 'next/server'
import { auth } from '@/auth'

/** Pages anyone may see. Everything else needs a session. */
function isOpen(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/login' ||
    pathname.startsWith('/api/auth') ||
    // The design lab and the relic renderer. Never reachable in production.
    (pathname.startsWith('/lab') && process.env.NODE_ENV !== 'production') ||
    (pathname.startsWith('/api/mock') && process.env.MOCK_BACKEND === 'true')
  )
}

export default auth((request) => {
  const { pathname } = request.nextUrl
  if (isOpen(pathname) || request.auth) return NextResponse.next()
  return NextResponse.redirect(new URL('/login', request.nextUrl.origin))
})

/**
 * Everything except Next's own assets and static files. The exemption is by
 * file extension rather than folder name: naming folders once sent every
 * piece of class art to the login screen the day a new folder appeared.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.png$|.*\\.webp$|.*\\.avif$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$|.*\\.woff2?$).*)',
  ],
}
