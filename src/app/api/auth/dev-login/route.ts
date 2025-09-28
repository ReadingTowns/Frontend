import { NextResponse } from 'next/server'

export async function POST() {
  // 환경 변수로 제어 (배포된 개발 서버에서도 사용 가능)
  if (process.env.NEXT_PUBLIC_SHOW_DEV_LOGIN !== 'true') {
    return NextResponse.json(
      { success: false, message: 'Dev login is disabled' },
      { status: 403 }
    )
  }

  try {
    // 개발용 Mock 유저 데이터
    const mockUser = {
      id: 'dev-user-001',
      email: 'dev@readingtown.local',
      name: '개발자',
      nickname: 'DevUser',
      profileImage: 'https://picsum.photos/200',
      isOnboardingComplete: true,
      provider: 'dev',
    }

    // 응답 생성
    const response = NextResponse.json({
      success: true,
      message: '개발자 로그인 성공',
      user: mockUser,
    })

    // 개발용 토큰 설정
    response.cookies.set('access_token', 'dev_access_token_' + Date.now(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    })

    response.cookies.set('refresh_token', 'dev_refresh_token_' + Date.now(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30일
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Dev login error:', error)
    return NextResponse.json(
      { success: false, message: '개발자 로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
