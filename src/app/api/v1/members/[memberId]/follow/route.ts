import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_CODES } from '@/constants/apiCodes'

// Mock 팔로우 상태 저장 (실제로는 DB에 저장)
const followStatus: Record<string, boolean> = {
  '2': true,
  '3': false,
  '4': false,
  '5': true,
}

// POST - 팔로우 생성
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  const { memberId } = await params
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
    // 이미 팔로우 중인 경우
    if (followStatus[memberId]) {
      return NextResponse.json({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        code: API_CODES.SUCCESS,
        message: 'Success',
        result: null,
      })
    }

    // 팔로우 추가
    followStatus[memberId] = true

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
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/members/${memberId}/follow`,
      {
        method: 'POST',
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

// DELETE - 팔로우 취소
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  const { memberId } = await params
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
    // 팔로우하지 않은 경우
    if (!followStatus[memberId]) {
      return NextResponse.json({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        code: API_CODES.SUCCESS,
        message: 'Success',
        result: null,
      })
    }

    // 팔로우 제거
    followStatus[memberId] = false

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
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/members/${memberId}/follow`,
      {
        method: 'DELETE',
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
