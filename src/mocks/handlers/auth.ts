import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // 구글 로그인 - 실제 리다이렉션으로 시뮬레이션
  http.get('/oauth2/authorization/google', ({ request }) => {
    console.log('Google OAuth handler called:', request.url)
    
    // 개발 환경에서는 콜백 페이지로 바로 리다이렉트
    const callbackUrl = new URL('/auth/callback/google', request.url)
    callbackUrl.searchParams.set('code', 'mock_google_code')
    callbackUrl.searchParams.set('state', 'mock_state')
    
    return HttpResponse.redirect(callbackUrl.toString())
  }),

  // 카카오 로그인 - 실제 리다이렉션으로 시뮬레이션
  http.get('/oauth2/authorization/kakao', ({ request }) => {
    console.log('Kakao OAuth handler called:', request.url)
    
    // 개발 환경에서는 콜백 페이지로 바로 리다이렉트
    const callbackUrl = new URL('/auth/callback/kakao', request.url)
    callbackUrl.searchParams.set('code', 'mock_kakao_code')
    callbackUrl.searchParams.set('state', 'mock_state')
    
    return HttpResponse.redirect(callbackUrl.toString())
  }),

  // 구글 OAuth 콜백 - 성공 시나리오
  http.get('/auth/callback/google', () => {
    console.log('Google OAuth callback processed')
    
    return HttpResponse.json(
      { 
        success: true,
        user: {
          id: 'mock_google_user_id',
          email: 'test@gmail.com',
          name: 'Test User',
          provider: 'google'
        }
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            'access_token=mock_access_token; Path=/; Max-Age=3600; SameSite=Lax',
            'refresh_token=mock_refresh_token; Path=/; Max-Age=604800; SameSite=Lax'
          ].join(', ')
        }
      }
    )
  }),

  // 카카오 OAuth 콜백 - 성공 시나리오
  http.get('/auth/callback/kakao', () => {
    console.log('Kakao OAuth callback processed')
    
    return HttpResponse.json(
      { 
        success: true,
        user: {
          id: 'mock_kakao_user_id',
          email: 'test@kakao.com',
          name: '테스트 사용자',
          provider: 'kakao'
        }
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            'access_token=mock_access_token; Path=/; Max-Age=3600; SameSite=Lax',
            'refresh_token=mock_refresh_token; Path=/; Max-Age=604800; SameSite=Lax'
          ].join(', ')
        }
      }
    )
  }),

  // 인증 상태 확인
  http.get('/api/auth/me', ({ request }) => {
    const cookies = request.headers.get('cookie')
    console.log('Auth check handler called:', request.url, 'cookies:', cookies)
    
    // 쿠키에서 토큰 확인 (Node.js 환경에서는 헤더에서, 브라우저에서는 document.cookie에서)
    let hasAccessToken = false
    let hasRefreshToken = false
    let userProvider = 'google' // 기본값
    
    // 먼저 헤더에서 확인 (Node.js 환경과 일부 브라우저 케이스)
    if (cookies) {
      hasAccessToken = cookies.includes('access_token=mock_access_token')
      hasRefreshToken = cookies.includes('refresh_token=mock_refresh_token')
    }
    
    // 브라우저 환경에서 헤더에 쿠키가 없는 경우 document.cookie를 직접 확인
    if (!hasAccessToken && !hasRefreshToken && typeof window !== 'undefined' && typeof document !== 'undefined') {
      const documentCookies = document.cookie
      console.log('Browser document.cookie:', documentCookies)
      
      hasAccessToken = documentCookies.includes('access_token=mock_access_token')
      hasRefreshToken = documentCookies.includes('refresh_token=mock_refresh_token')
      
      // 마지막 로그인 제공자 정보는 localStorage에서 가져오거나 기본값 사용
      const lastProvider = localStorage.getItem('lastProvider') || 'google'
      userProvider = lastProvider
    }
    
    if (hasAccessToken || hasRefreshToken) {
      console.log('Auth check: authenticated via cookie')
      
      return HttpResponse.json({
        success: true,
        user: userProvider === 'google' ? {
          id: 'mock_google_user_id',
          email: 'test@gmail.com',
          name: 'Test User',
          provider: 'google',
          isAuthenticated: true
        } : {
          id: 'mock_kakao_user_id',
          email: 'test@kakao.com',
          name: '테스트 사용자',
          provider: 'kakao',
          isAuthenticated: true
        }
      })
    }

    console.log('Auth check: unauthorized')
    return HttpResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }),

  // 로그아웃
  http.post('/api/auth/logout', () => {
    console.log('Logout processed')
    
    return HttpResponse.json(
      { success: true, message: 'Logged out successfully' },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            'access_token=; Path=/; Max-Age=0; SameSite=Lax',
            'refresh_token=; Path=/; Max-Age=0; SameSite=Lax'
          ].join(', ')
        }
      }
    )
  }),

]