import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (isMockMode) {
    // Mock 모드일 때 쿠키로만 처리
    const response = NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: 1000,
      message: 'Success (Mock)',
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

  // 실제 백엔드 API 호출
  try {
    // 쿠키에서 토큰 가져오기 (인증이 필요한 경우)
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members/onboarding/complete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken.value}` }),
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // 실제 API 호출 성공 시도 쿠키 설정
    const successResponse = NextResponse.json(data)
    successResponse.cookies.set('onboarding_completed', 'true', {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1년
      sameSite: 'lax',
      httpOnly: false,
    })

    return successResponse
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return NextResponse.json(
      {
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        code: 5000,
        message: 'Internal Server Error',
        result: null,
      },
      { status: 500 }
    )
  }
}
