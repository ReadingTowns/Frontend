import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_CODES } from '@/constants/apiCodes'

// Mock 팔로워 리스트
const mockFollowers = [
  {
    memberId: 3,
    nickname: '독서광박',
    profileImage: 'https://picsum.photos/seed/user3/200',
  },
  {
    memberId: 4,
    nickname: '북러버최',
    profileImage: 'https://picsum.photos/seed/user4/200',
  },
  {
    memberId: 6,
    nickname: '문학소녀',
    profileImage: 'https://picsum.photos/seed/user6/200',
  },
]

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
      result: mockFollowers,
    })
  }

  // 실제 백엔드 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'}/api/v1/members/me/followers`,
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
        result: [],
      },
      { status: 500 }
    )
  }
}
