import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Kakao OAuth 리다이렉션 시뮬레이션
  const callbackUrl = new URL('/auth/callback/kakao', request.url)
  callbackUrl.searchParams.set('code', 'mock_kakao_code')
  callbackUrl.searchParams.set('state', 'mock_state')

  return NextResponse.redirect(callbackUrl.toString())
}
