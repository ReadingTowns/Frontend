// API Routes Testing with Fetch Mocks

describe('API Routes Mocking', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should handle unauthorized auth check', async () => {
    console.log('Starting unauthorized auth check test')

    // Mock unauthorized response for this specific test
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            code: 4001, // 숫자로 변경
            message: '인증되지 않은 사용자입니다',
          }),
      })
    )

    const response = await fetch('/api/auth/me')
    const data = await response.json()

    console.log('Response status:', response.status)
    console.log('Response data:', data)

    expect(response.status).toBe(401)
    expect(data.code).toBe(4001) // 숫자로 변경
    expect(data.message).toBe('인증되지 않은 사용자입니다')
  })

  it('should mock Google OAuth redirect', async () => {
    // Mock OAuth redirect response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 302,
        headers: {
          get: (name: string) => {
            if (name === 'location') {
              return 'http://localhost:3000/login/oauth2/code/google?code=mock_google_code&state=mock_state'
            }
            return null
          },
        },
      })
    )

    const response = await fetch('/oauth2/authorization/google')

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toContain(
      '/login/oauth2/code/google'
    )
    expect(response.headers.get('location')).toContain('code=mock_google_code')
  })

  it('should mock Kakao OAuth redirect', async () => {
    // Mock OAuth redirect response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 302,
        headers: {
          get: (name: string) => {
            if (name === 'location') {
              return 'http://localhost:3000/login/oauth2/code/kakao?code=mock_kakao_code&state=mock_state'
            }
            return null
          },
        },
      })
    )

    const response = await fetch('/oauth2/authorization/kakao')

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toContain(
      '/login/oauth2/code/kakao'
    )
    expect(response.headers.get('location')).toContain('code=mock_kakao_code')
  })

  it('should mock Google OAuth callback', async () => {
    // Mock callback success response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            user: {
              id: 'mock_google_user_id',
              email: 'test@gmail.com',
              name: 'Test User',
              provider: 'google',
            },
          }),
      })
    )

    const response = await fetch(
      '/login/oauth2/code/google?code=mock_code&state=mock_state'
    )
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.provider).toBe('google')
    expect(data.user.email).toBe('test@gmail.com')
  })

  it('should mock Kakao OAuth callback', async () => {
    // Mock callback success response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            user: {
              id: 'mock_kakao_user_id',
              email: 'test@kakao.com',
              name: 'Test User',
              provider: 'kakao',
            },
          }),
      })
    )

    const response = await fetch(
      '/login/oauth2/code/kakao?code=mock_code&state=mock_state'
    )
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.provider).toBe('kakao')
    expect(data.user.email).toBe('test@kakao.com')
  })

  it('should handle authorized auth check with cookie', async () => {
    // Mock authorized response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            code: 1000, // 숫자로 변경
            result: {
              isAuthenticated: true,
              user: {
                id: 'test_user',
                email: 'test@example.com',
                name: 'Test User',
              },
            },
          }),
      })
    )

    const response = await fetch('/api/auth/me', {
      headers: { Cookie: 'access_token=mock_access_token' },
    })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.code).toBe(1000) // 숫자로 변경
    expect(data.result.isAuthenticated).toBe(true)
  })
})
