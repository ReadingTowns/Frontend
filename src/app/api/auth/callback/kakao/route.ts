import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      return NextResponse.json(
        { success: false, message: '인증 코드가 없습니다.' },
        { status: 400 }
      )
    }

    const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    if (isMockMode) {
      // Mock 모드: 가짜 토큰으로 로그인 처리
      const response = NextResponse.redirect('http://localhost:3000/home')

      // Mock 토큰 설정
      response.cookies.set('access_token', 'mock_kakao_access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7일
      })
      response.cookies.set('refresh_token', 'mock_kakao_refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30일
      })

      return response
    }

    // 실제 백엔드 서버와 통신하여 토큰 교환
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://readingtown.site'
    const tokenResponse = await fetch(
      `${backendUrl}/login/oauth2/code/kakao?code=${code}&state=${state}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'Kakao 인증에 실패했습니다.' },
        { status: tokenResponse.status }
      )
    }

    // 백엔드에서 반환한 쿠키 헤더 파싱
    const setCookieHeaders = tokenResponse.headers.get('set-cookie')

    // 토큰 정보를 클라이언트에 전달
    const response = NextResponse.json({
      success: true,
      message: 'Kakao 로그인 성공',
    })

    // 백엔드에서 받은 쿠키를 클라이언트에 설정
    if (setCookieHeaders) {
      // Set-Cookie 헤더를 그대로 전달
      response.headers.set('set-cookie', setCookieHeaders)
    }

    return response
  } catch (error) {
    console.error('Kakao OAuth callback error:', error)
    return NextResponse.json(
      { success: false, message: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
