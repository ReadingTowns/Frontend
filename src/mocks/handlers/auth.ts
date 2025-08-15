import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // 구글 로그인 - 리다이렉션 시뮬레이션
  http.get('/oauth2/authorization/google', () => {
    return HttpResponse.json(
      { 
        message: 'Redirecting to Google OAuth',
        redirectUrl: 'http://localhost:3000/auth/callback/google?code=mock_google_code&state=mock_state'
      },
      { 
        status: 302
      }
    )
  }),

  // 카카오 로그인 - 리다이렉션 시뮬레이션
  http.get('/oauth2/authorization/kakao', () => {
    return HttpResponse.json(
      { 
        message: 'Redirecting to Kakao OAuth',
        redirectUrl: 'http://localhost:3000/auth/callback/kakao?code=mock_kakao_code&state=mock_state'
      },
      { 
        status: 302
      }
    )
  }),

  // 구글 OAuth 콜백 - 성공 시나리오
  http.get('/auth/callback/google', () => {
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
            'access_token=mock_access_token; HttpOnly; Path=/; Max-Age=3600',
            'refresh_token=mock_refresh_token; HttpOnly; Path=/; Max-Age=604800'
          ].join(', ')
        }
      }
    )
  }),

  // 카카오 OAuth 콜백 - 성공 시나리오
  http.get('/auth/callback/kakao', () => {
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
            'access_token=mock_access_token; HttpOnly; Path=/; Max-Age=3600',
            'refresh_token=mock_refresh_token; HttpOnly; Path=/; Max-Age=604800'
          ].join(', ')
        }
      }
    )
  }),

  // 인증 상태 확인
  http.get('/api/auth/me', ({ request }) => {
    const cookies = request.headers.get('cookie')
    
    if (cookies?.includes('access_token=mock_access_token')) {
      return HttpResponse.json({
        success: true,
        user: {
          id: 'mock_user_id',
          email: 'test@example.com',
          name: 'Test User',
          isAuthenticated: true
        }
      })
    }

    return HttpResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }),

  // 로그아웃
  http.post('/api/auth/logout', () => {
    return HttpResponse.json(
      { success: true, message: 'Logged out successfully' },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            'access_token=; HttpOnly; Path=/; Max-Age=0',
            'refresh_token=; HttpOnly; Path=/; Max-Age=0'
          ].join(', ')
        }
      }
    )
  }),
]