import { NextRequest, NextResponse } from 'next/server'
import { API_CODES } from '@/constants/apiCodes'

interface UserProfile {
  memberId: number
  profileImage: string
  nickname: string
  currentTown: string
  userRating: number | null
  userRatingCount: number
  availableTime: string | null
  following: boolean
}

// Mock 프로필 데이터
const mockProfiles: Record<string, UserProfile> = {
  '2': {
    memberId: 2,
    profileImage: 'https://picsum.photos/seed/user2/200',
    nickname: '책벌레김',
    currentTown: '강남구 역삼동',
    userRating: 4.5,
    userRatingCount: 12,
    availableTime: '평일 저녁 7시-9시',
    following: true,
  },
  '3': {
    memberId: 3,
    profileImage: 'https://picsum.photos/seed/user3/200',
    nickname: '독서광박',
    currentTown: '마포구 서교동',
    userRating: 4.8,
    userRatingCount: 24,
    availableTime: '주말 오후',
    following: false,
  },
  '4': {
    memberId: 4,
    profileImage: 'https://picsum.photos/seed/user4/200',
    nickname: '북러버최',
    currentTown: '송파구 잠실동',
    userRating: null,
    userRatingCount: 0,
    availableTime: '평일 점심시간',
    following: false,
  },
  '5': {
    memberId: 5,
    profileImage: 'https://picsum.photos/seed/user5/200',
    nickname: '리딩마스터',
    currentTown: '성동구 성수동',
    userRating: 4.9,
    userRatingCount: 35,
    availableTime: '언제든지 가능',
    following: true,
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (isMockMode) {
    const profile = mockProfiles[memberId]

    if (!profile) {
      return NextResponse.json(
        {
          timestamp: new Date()
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19),
          code: API_CODES.NOT_FOUND,
          message: '사용자를 찾을 수 없습니다',
          result: null,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      code: API_CODES.SUCCESS,
      message: 'Success',
      result: profile,
    })
  }

  // 실제 백엔드 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/members/${memberId}/profile`,
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
