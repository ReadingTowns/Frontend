import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_CODES } from '@/constants/apiCodes'
import { User } from '@/types/auth'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  const refreshToken = cookieStore.get('refresh_token')

  // 개발 환경에서만 mock 토큰 체크
  const isAuthenticated =
    accessToken?.value === 'mock_access_token' ||
    refreshToken?.value === 'mock_refresh_token'

  if (isAuthenticated) {
    // 온보딩 완료 여부는 쿠키에서 확인
    const onboardingCompleted =
      cookieStore.get('onboarding_completed')?.value === 'true'

    // 기본 mock 사용자 데이터
    const user: User = {
      id: 'mock_user_id',
      email: 'test@example.com',
      name: '테스트 사용자',
      provider: 'google',
      isAuthenticated: true,
      onboardingCompleted,
      memberId: 1,
    }

    return NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      code: API_CODES.SUCCESS,
      message: '인증 상태 확인 완료',
      result: user,
    })
  }

  return NextResponse.json(
    {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      code: API_CODES.UNAUTHORIZED,
      message: '인증되지 않은 사용자입니다',
      result: null,
    },
    { status: 401 }
  )
}
