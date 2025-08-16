import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // 온보딩 완료 처리 - 실제 환경에서는 데이터베이스에 저장
  // 개발 환경에서는 쿠키에 상태 저장
  const response = NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: 1000,
    message: 'Success',
    result: null,
  })

  // 온보딩 완료 상태를 쿠키에 저장
  response.cookies.set('onboarding_completed', 'true', {
    path: '/',
    maxAge: 365 * 24 * 60 * 60, // 1년
    sameSite: 'lax',
    httpOnly: false,
  })

  return response
}
