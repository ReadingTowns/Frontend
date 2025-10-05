import { POST } from '@/app/api/auth/logout/route'
import { NextResponse } from 'next/server'

describe('Logout API Tests', () => {
  it('should clear cookies on logout', async () => {
    const response = await POST()

    // Check response format
    const data = await response.json()
    expect(data.code).toBe('1000')
    expect(data.message).toBe('로그아웃이 완료되었습니다.')
    expect(data.result).toBeNull()

    // Check if cookies are being cleared
    const setCookieHeader = response.headers.get('set-cookie')
    console.log('Set-Cookie header:', setCookieHeader)

    // Verify cookies are set to expire
    expect(response).toBeInstanceOf(NextResponse)

    // Check cookies directly from the response
    const responseCookies = (response as NextResponse).cookies
    const accessToken = responseCookies.get('access_token')
    const refreshToken = responseCookies.get('refresh_token')

    console.log('Access token:', accessToken)
    console.log('Refresh token:', refreshToken)

    // These should be cleared (empty value and maxAge 0) with domain specified
    expect(accessToken?.value).toBe('')
    expect(accessToken?.domain).toBe('.readingtown.site')
    expect(refreshToken?.value).toBe('')
    expect(refreshToken?.domain).toBe('.readingtown.site')
  })
})
