import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '1000',
    message: '로그아웃이 완료되었습니다.',
    result: null,
  })

  // 쿠키 삭제
  response.cookies.set('access_token', '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  })

  response.cookies.set('refresh_token', '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  })

  return response
}
