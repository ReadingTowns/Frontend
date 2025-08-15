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
          provider: 'google',
        },
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            'access_token=mock_access_token; Path=/; Max-Age=3600; SameSite=Lax',
            'refresh_token=mock_refresh_token; Path=/; Max-Age=604800; SameSite=Lax',
          ].join(', '),
        },
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
          provider: 'kakao',
        },
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            'access_token=mock_access_token; Path=/; Max-Age=3600; SameSite=Lax',
            'refresh_token=mock_refresh_token; Path=/; Max-Age=604800; SameSite=Lax',
          ].join(', '),
        },
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
    if (
      !hasAccessToken &&
      !hasRefreshToken &&
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    ) {
      const documentCookies = document.cookie
      console.log('Browser document.cookie:', documentCookies)

      hasAccessToken = documentCookies.includes(
        'access_token=mock_access_token'
      )
      hasRefreshToken = documentCookies.includes(
        'refresh_token=mock_refresh_token'
      )

      // 마지막 로그인 제공자 정보는 localStorage에서 가져오거나 기본값 사용
      const lastProvider = localStorage.getItem('lastProvider') || 'google'
      userProvider = lastProvider
    }

    if (hasAccessToken || hasRefreshToken) {
      console.log('Auth check: authenticated via cookie')

      // 온보딩 완료 여부 확인
      const onboardingCompleted =
        typeof window !== 'undefined'
          ? localStorage.getItem('onboardingCompleted') === 'true'
          : false

      return HttpResponse.json({
        success: true,
        user:
          userProvider === 'google'
            ? {
                id: 'mock_google_user_id',
                email: 'test@gmail.com',
                name: 'Test User',
                provider: 'google',
                isAuthenticated: true,
                onboardingCompleted,
              }
            : {
                id: 'mock_kakao_user_id',
                email: 'test@kakao.com',
                name: '테스트 사용자',
                provider: 'kakao',
                isAuthenticated: true,
                onboardingCompleted,
              },
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
            'refresh_token=; Path=/; Max-Age=0; SameSite=Lax',
          ].join(', '),
        },
      }
    )
  }),

  // 온보딩 기본 프로필 조회
  http.get('/api/v1/members/onboarding/default-profile', ({ request }) => {
    console.log('Default profile handler called:', request.url)

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: 1000,
      message: 'Success',
      result: {
        defaultUsername: `리딩여우${Math.random().toString(36).substr(2, 6)}`,
        defaultProfileImage:
          'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
      },
    })
  }),

  // 닉네임 중복 확인
  http.get('/api/v1/members/nickname/validate', ({ request }) => {
    const url = new URL(request.url)
    const nickname = url.searchParams.get('nickname')
    console.log('Nickname validation handler called:', nickname)

    // 테스트용으로 특정 닉네임들을 중복으로 처리
    const duplicateNicknames = ['테스트', 'admin', 'root', '리딩타운']
    const isAvailable = !duplicateNicknames.includes(nickname || '')

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: 1000,
      message: 'Success',
      result: {
        isAvailable,
      },
    })
  }),

  // 온보딩 완료
  http.post('/api/v1/members/onboarding/complete', async ({ request }) => {
    console.log('Onboarding complete handler called')

    const body = (await request.json()) as {
      phoneNumber: string
      latitude: number
      longitude: number
      nickname: string
      profileImage: string
      availableTime?: string
    }

    console.log('Onboarding data:', body)

    // 온보딩 완료 상태를 localStorage에 저장 (개발 환경용)
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingCompleted', 'true')
      localStorage.setItem('userProfile', JSON.stringify(body))
    }

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: 1000,
      message: 'Success',
      result: null,
    })
  }),
]
