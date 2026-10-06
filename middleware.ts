import { NextResponse, type NextRequest } from 'next/server'

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

const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token']

/**
 * A redirect for the signed-out, nothing more. It only looks for the session
 * cookie, so Auth.js stays out of the edge bundle; every page, route and
 * action verifies the session itself on the server, so a forged cookie gets
 * as far as the login screen and no further.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const signedIn = SESSION_COOKIES.some((name) => request.cookies.has(name))
  if (isOpen(pathname) || signedIn) return NextResponse.next()
  // Remember where they were going, so signing in takes them back there.
  const login = new URL('/login', request.nextUrl.origin)
  if (pathname !== '/enter') login.searchParams.set('next', pathname + request.nextUrl.search)
  return NextResponse.redirect(login)
}

/**
 * Everything except Next's own assets and static files. The exemption is by
 * file extension rather than folder name: naming folders once sent every
 * piece of class art to the login screen the day a new folder appeared.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|robots.txt|.*\\.png$|.*\\.webp$|.*\\.avif$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$|.*\\.woff2?$).*)',
  ],
}
