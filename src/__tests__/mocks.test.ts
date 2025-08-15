/**
 * MSW 모킹 테스트
 * API 핸들러가 올바르게 동작하는지 확인
 */

describe('MSW API Mocking', () => {
  it('should mock Google OAuth redirect', async () => {
    const response = await fetch('/oauth2/authorization/google')
    const data = await response.json()

    expect(response.status).toBe(302)
    expect(data.message).toBe('Redirecting to Google OAuth')
    expect(data.redirectUrl).toContain('/auth/callback/google')
  })

  it('should mock Kakao OAuth redirect', async () => {
    const response = await fetch('/oauth2/authorization/kakao')
    const data = await response.json()

    expect(response.status).toBe(302)
    expect(data.message).toBe('Redirecting to Kakao OAuth')
    expect(data.redirectUrl).toContain('/auth/callback/kakao')
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

  it('should handle unauthorized auth check', async () => {
    const response = await fetch('/api/auth/me')
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.message).toBe('Unauthorized')
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