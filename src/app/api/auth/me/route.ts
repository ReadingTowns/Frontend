import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_CODES } from '@/constants/apiCodes'
import { User } from '@/types/auth'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  const refreshToken = cookieStore.get('refresh_token')

  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  // Mock 모드에서는 mock 토큰 체크
  const isAuthenticated = isMockMode
    ? accessToken?.value?.startsWith('mock_') ||
      refreshToken?.value?.startsWith('mock_')
    : !!(accessToken?.value || refreshToken?.value)

  if (isAuthenticated) {
    // 온보딩 완료 여부는 쿠키에서 확인
    const onboardingCompleted =
      cookieStore.get('onboarding_completed')?.value === 'true'

    // Mock 모드에서는 mock 데이터, 실제 모드에서는 백엔드 API 호출 필요
    const provider = accessToken?.value?.includes('google') ? 'google' : 'kakao'
    const user: User = {
      id: isMockMode ? 'mock_user_id' : 'user_id',
      email: isMockMode ? 'test@example.com' : 'user@example.com',
      name: isMockMode ? '테스트 사용자' : '사용자',
      provider,
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
