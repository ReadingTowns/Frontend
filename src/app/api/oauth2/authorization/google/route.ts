import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Google OAuth 리다이렉션 시뮬레이션
  const callbackUrl = new URL('/auth/callback/google', request.url)
  callbackUrl.searchParams.set('code', 'mock_google_code')
  callbackUrl.searchParams.set('state', 'mock_state')

  return NextResponse.redirect(callbackUrl.toString())
}
