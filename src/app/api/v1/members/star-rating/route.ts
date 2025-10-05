import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_CODES } from '@/constants/apiCodes'

interface UserRating {
  memberId: number
  userRatingSum: number
  userRatingCount: number
  userRating: number | null
}

// Mock 별점 데이터
const mockRatings: Record<string, UserRating> = {
  '1': {
    memberId: 1,
    userRatingSum: 0,
    userRatingCount: 0,
    userRating: null,
  },
  '2': {
    memberId: 2,
    userRatingSum: 54,
    userRatingCount: 12,
    userRating: 4.5,
  },
  '3': {
    memberId: 3,
    userRatingSum: 115,
    userRatingCount: 24,
    userRating: 4.8,
  },
  '4': {
    memberId: 4,
    userRatingSum: 0,
    userRatingCount: 0,
    userRating: null,
  },
  '5': {
    memberId: 5,
    userRatingSum: 172,
    userRatingCount: 35,
    userRating: 4.9,
  },
}

// GET - 별점 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const memberId = searchParams.get('memberId')
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
    // memberId 파라미터가 없으면 본인의 별점 조회
    const targetId = memberId || '1'
    const rating = mockRatings[targetId]

    if (!rating) {
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
      result: rating,
    })
  }

  // 실제 백엔드 호출
  try {
    const url = memberId
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'}/api/v1/members/star-rating?memberId=${memberId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'}/api/v1/members/star-rating`

    const response = await fetch(url, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    })

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

// POST - 별점 제출
export async function POST(request: NextRequest) {
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

  const body = await request.json()
  const { toMemberId, starRating } = body

  if (isMockMode) {
    // 별점 추가
    if (mockRatings[toMemberId]) {
      mockRatings[toMemberId].userRatingSum += starRating
      mockRatings[toMemberId].userRatingCount += 1
      mockRatings[toMemberId].userRating =
        mockRatings[toMemberId].userRatingSum /
        mockRatings[toMemberId].userRatingCount
    }

    return NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      code: API_CODES.SUCCESS,
      message: 'Success',
      result: null,
    })
  }

  // 실제 백엔드 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'}/api/v1/members/star-rating`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: request.headers.get('cookie') || '',
        },
        body: JSON.stringify({ toMemberId, starRating }),
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
