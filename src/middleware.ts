import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 쿠키에서 인증 토큰 확인 (개발환경에서는 MSW 토큰도 확인)
  const accessToken =
    request.cookies.get('accessToken')?.value ||
    (process.env.NODE_ENV === 'development'
      ? request.cookies.get('access_token')?.value
      : undefined)
  const refreshToken =
    request.cookies.get('refreshToken')?.value ||
    (process.env.NODE_ENV === 'development'
      ? request.cookies.get('refresh_token')?.value
      : undefined)

  // 인증 상태 확인
  const isAuthenticated = !!(accessToken || refreshToken)

  // Public routes (인증 없이 접근 가능)
  const publicRoutes = ['/login', '/auth']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // OAuth callback routes
  const isOAuthCallback = pathname.startsWith('/auth/callback')

  // Root page handling
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/home', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protected routes
  if (!isPublicRoute && !isOAuthCallback) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Authenticated users trying to access login page
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - mockServiceWorker.js (MSW service worker)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)',
  ],
}
