import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_CODES } from '@/constants/apiCodes'

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')
    const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    // 인증 체크
    const isAuthenticated = isMockMode
      ? accessToken?.value?.startsWith('mock_')
      : !!accessToken?.value

    if (!isAuthenticated) {
      return NextResponse.json(
        {
          timestamp: new Date()
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19),
          code: API_CODES.UNAUTHORIZED,
          message: '인증되지 않은 사용자입니다',
          result: null,
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { nickname, profileImage, availableTime } = body

    if (isMockMode) {
      // Mock 모드에서는 성공 응답 반환
      return NextResponse.json({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        code: API_CODES.SUCCESS,
        message: 'Success',
        result: null,
      })
    }

    // 실제 백엔드 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'}/api/v1/members/profile`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: request.headers.get('cookie') || '',
        },
        body: JSON.stringify({
          nickname,
          profileImage,
          availableTime,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('프로필 수정 오류:', error)
    return NextResponse.json(
      {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        code: API_CODES.INTERNAL_ERROR,
        message: '서버 오류가 발생했습니다',
        result: null,
      },
      { status: 500 }
    )
  }
}
