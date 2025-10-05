import { NextResponse } from 'next/server'

export async function GET() {
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (isMockMode) {
    // Mock 모드: 직접 콜백 페이지로 리다이렉트
    const mockCallbackUrl = `http://localhost:3000/login/oauth2/code/google?code=mock_google_code&state=mock_state`
    return NextResponse.redirect(mockCallbackUrl)
  }

  // 실제 백엔드 OAuth2 엔드포인트로 리다이렉트
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
  const googleOAuthUrl = `${backendUrl}/oauth2/authorization/google`

  return NextResponse.redirect(googleOAuthUrl)
}
