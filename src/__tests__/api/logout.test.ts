import { POST } from '@/app/api/auth/logout/route'
import { NextResponse } from 'next/server'

describe('Logout API Tests', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  it('should clear cookies on logout in development', async () => {
    process.env.NODE_ENV = 'development'
    const response = await POST()

    // Check response format
    const data = await response.json()
    expect(data.code).toBe('1000')
    expect(data.message).toBe('로그아웃이 완료되었습니다.')
    expect(data.result).toBeNull()

    // Check cookies directly from the response
    const responseCookies = (response as NextResponse).cookies
    const accessToken = responseCookies.get('access_token')
    const refreshToken = responseCookies.get('refresh_token')

    // In development, domain should not be set
    expect(accessToken?.value).toBe('')
    expect(accessToken?.domain).toBeUndefined()
    expect(accessToken?.maxAge).toBe(0)
    expect(refreshToken?.value).toBe('')
    expect(refreshToken?.domain).toBeUndefined()
    expect(refreshToken?.maxAge).toBe(0)
  })

  it('should clear cookies with domain on logout in production', async () => {
    process.env.NODE_ENV = 'production'
    const response = await POST()

    // Check response format
    const data = await response.json()
    expect(data.code).toBe('1000')
    expect(data.message).toBe('로그아웃이 완료되었습니다.')
    expect(data.result).toBeNull()

    // Check cookies directly from the response
    const responseCookies = (response as NextResponse).cookies
    const accessToken = responseCookies.get('access_token')
    const refreshToken = responseCookies.get('refresh_token')

    // In production, domain should be set
    expect(accessToken?.value).toBe('')
    expect(accessToken?.domain).toBe('.readingtown.site')
    expect(accessToken?.maxAge).toBe(0)
    expect(refreshToken?.value).toBe('')
    expect(refreshToken?.domain).toBe('.readingtown.site')
    expect(refreshToken?.maxAge).toBe(0)
  })
})
