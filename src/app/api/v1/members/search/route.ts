import { NextRequest, NextResponse } from 'next/server'
import { API_CODES } from '@/constants/apiCodes'

// Mock 데이터
const mockUsers = [
  {
    memberId: 2,
    nickname: '책벌레김',
    profileImage: 'https://picsum.photos/seed/user2/200',
    followed: true,
  },
  {
    memberId: 3,
    nickname: '독서광박',
    profileImage: 'https://picsum.photos/seed/user3/200',
    followed: false,
  },
  {
    memberId: 4,
    nickname: '북러버최',
    profileImage: 'https://picsum.photos/seed/user4/200',
    followed: false,
  },
  {
    memberId: 5,
    nickname: '리딩마스터',
    profileImage: 'https://picsum.photos/seed/user5/200',
    followed: true,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const nickname = searchParams.get('nickname')

  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (isMockMode) {
    // 닉네임 검색
    const filteredUsers = nickname
      ? mockUsers.filter(user =>
          user.nickname.toLowerCase().includes(nickname.toLowerCase())
        )
      : mockUsers

    return NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      code: API_CODES.SUCCESS,
      message: 'Success',
      result: filteredUsers,
    })
  }

  // 실제 백엔드 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'}/api/v1/members/search?nickname=${nickname || ''}`,
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
