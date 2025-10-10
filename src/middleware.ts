import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 쿠키에서 인증 토큰 확인
  const accessToken = request.cookies.get('access_token')?.value

  // Mock 모드 확인
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  // 디버깅: 쿠키 상태 로그
  console.log('[Middleware]', {
    pathname,
    hasAccessToken: !!accessToken,
    accessTokenValue: accessToken
      ? `${accessToken.substring(0, 10)}...`
      : 'none',
    isMockMode,
  })

  // 인증 상태 확인
  // access_token이 반드시 필요함 (refresh_token만으로는 인증 불가)
  const isAuthenticated = isMockMode
    ? !!accessToken?.startsWith('mock_')
    : !!accessToken

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

  // 로그인된 사용자가 /login 접근 시 /home으로 리다이렉트하는 로직은
  // 쿠키 삭제 타이밍 이슈로 인해 제거
  // (대신 LoginPage 컴포넌트에서 useAuth로 처리)

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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
