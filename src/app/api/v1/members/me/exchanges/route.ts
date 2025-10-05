import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Mock 데이터
const mockExchangeData = {
  chatRoomId: 1,
  myBook: {
    bookhouseId: 1,
    bookName: '혼자 있는 시간의 힘',
    bookImage: 'https://via.placeholder.com/120x180?text=Book1',
  },
  yourBook: {
    bookhouseId: 2,
    bookName: '사피엔스',
    bookImage: 'https://via.placeholder.com/120x180?text=Book2',
  },
  daysLeft: 15,
}

export async function GET() {
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (isMockMode) {
    // Mock 모드일 때 mock 데이터 반환
    return NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '2000',
      message: 'OK (Mock)',
      result: mockExchangeData,
    })
  }

  // 실제 백엔드 API 호출
  try {
    // 쿠키에서 토큰 가져오기 (인증이 필요한 경우)
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members/me/exchanges`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken.value}` }),
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching user exchanges:', error)
    return NextResponse.json(
      {
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        code: '5000',
        message: 'Internal Server Error',
        result: null,
      },
      { status: 500 }
    )
  }
}
