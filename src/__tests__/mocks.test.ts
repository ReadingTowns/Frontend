/**
 * MSW 모킹 테스트
 * API 핸들러가 올바르게 동작하는지 확인
 */

describe('MSW API Mocking', () => {
  beforeEach(() => {
    // 매 테스트마다 쿠키 상태 초기화
    if (typeof document !== 'undefined') {
      document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      document.cookie = "refresh_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    }
  })

  it('should handle unauthorized auth check', async () => {
    console.log('Starting unauthorized auth check test')
    const response = await fetch('/api/auth/me')
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', data)

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.message).toBe('Unauthorized')
  })

  it('should mock Google OAuth redirect', async () => {
    const response = await fetch('/oauth2/authorization/google', { redirect: 'manual' })
    
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toContain('/auth/callback/google')
    expect(response.headers.get('location')).toContain('code=mock_google_code')
  })

  it('should mock Kakao OAuth redirect', async () => {
    const response = await fetch('/oauth2/authorization/kakao', { redirect: 'manual' })
    
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toContain('/auth/callback/kakao')
    expect(response.headers.get('location')).toContain('code=mock_kakao_code')
  })

  it('should mock Google OAuth callback', async () => {
    const response = await fetch('/auth/callback/google?code=mock_code')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.provider).toBe('google')
    expect(data.user.email).toBe('test@gmail.com')
  })

  it('should mock Kakao OAuth callback', async () => {
    const response = await fetch('/auth/callback/kakao?code=mock_code')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.provider).toBe('kakao')
    expect(data.user.email).toBe('test@kakao.com')
  })

  it('should handle authorized auth check with cookie', async () => {
    const response = await fetch('/api/auth/me', {
      headers: {
        'cookie': 'access_token=mock_access_token'
      }
    })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.isAuthenticated).toBe(true)
  })
})