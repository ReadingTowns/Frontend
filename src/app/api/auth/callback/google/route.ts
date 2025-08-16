import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    user: {
      id: 'mock_google_user_id',
      email: 'test@gmail.com',
      name: 'Test User',
      provider: 'google',
    },
  })

  // 쿠키 설정
  response.cookies.set('access_token', 'mock_access_token', {
    path: '/',
    maxAge: 3600,
    sameSite: 'lax',
    httpOnly: false, // 클라이언트에서 접근 가능
  })

  response.cookies.set('refresh_token', 'mock_refresh_token', {
    path: '/',
    maxAge: 604800,
    sameSite: 'lax',
    httpOnly: false, // 클라이언트에서 접근 가능
  })

  return response
}
