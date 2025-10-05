import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_CODES } from '@/constants/apiCodes'

// Mock 내 프로필
const mockMyProfile = {
  memberId: 1,
  profileImage: 'https://picsum.photos/seed/user1/200',
  nickname: '테스트사용자',
  currentTown: '강남구 삼성동',
  userRating: null,
  userRatingCount: 0,
  availableTime: '평일 저녁 / 주말 오전',
}

export async function GET(request: NextRequest) {
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
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        code: API_CODES.UNAUTHORIZED,
        message: '인증되지 않은 사용자입니다',
        result: null,
      },
      { status: 401 }
    )
  }

  if (isMockMode) {
    return NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      code: API_CODES.SUCCESS,
      message: 'Success',
      result: mockMyProfile,
    })
  }

  // 실제 백엔드 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'}/api/v1/members/me/profile`,
      {
        headers: {
          Cookie: request.headers.get('cookie') || '',
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
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
