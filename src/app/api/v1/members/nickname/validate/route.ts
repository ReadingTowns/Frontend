import { NextRequest, NextResponse } from 'next/server'

// Mock용 중복 닉네임 리스트
const mockDuplicateNicknames = ['테스트', 'admin', 'root', '리딩타운']

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const nickname = url.searchParams.get('nickname')

  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (isMockMode) {
    // Mock 모드일 때 테스트용 중복 체크
    const isAvailable = !mockDuplicateNicknames.includes(nickname || '')

    return NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: 1000,
      message: 'Success (Mock)',
      result: {
        isAvailable,
      },
    })
  }

  // 실제 백엔드 API 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members/nickname/validate?nickname=${encodeURIComponent(nickname || '')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error validating nickname:', error)
    return NextResponse.json(
      {
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        code: 5000,
        message: 'Internal Server Error',
        result: null,
      },
      { status: 500 }
    )
  }
}
