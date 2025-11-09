import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 쿠키에서 인증 토큰 확인
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // Mock 모드 확인
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  // 디버깅: 쿠키 상태 로그
  console.log('[Middleware]', {
    pathname,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    accessTokenValue: accessToken
      ? `${accessToken.substring(0, 10)}...`
      : 'none',
    isMockMode,
  })

  // Public routes (인증 없이 접근 가능)
  const publicRoutes = ['/login', '/auth']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // OAuth callback routes
  const isOAuthCallback = pathname.startsWith('/auth/callback')

  // Root page handling
  if (pathname === '/') {
    const isAuthenticated = isMockMode
      ? !!accessToken?.startsWith('mock_')
      : !!accessToken || !!refreshToken // ✅ Refresh Token도 인증으로 간주

    console.log('[Middleware] Root page redirect:', {
      isAuthenticated,
      targetUrl: isAuthenticated ? '/home' : '/login',
    })

    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/home', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protected routes
  if (!isPublicRoute && !isOAuthCallback) {
    // ✅ Access Token 또는 Refresh Token이 있으면 통과
    // 클라이언트에서 api.ts가 자동으로 토큰 갱신 처리
    if (accessToken || refreshToken) {
      console.log('[Middleware] Protected route - 토큰 있음, 통과:', pathname)
      return NextResponse.next()
    }

    // ❌ 둘 다 없으면 로그인 리다이렉트
    console.log(
      '[Middleware] No tokens found, redirecting to /login from:',
      pathname
    )
    return NextResponse.redirect(new URL('/login', request.url))
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
     * - favicon.ico, favicon.png (favicon files)
     * - logo.png and other static assets in public folder
     * - Any file with common static file extensions
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|favicon\\.png|logo\\.png|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.ico).*)',
  ],
}
