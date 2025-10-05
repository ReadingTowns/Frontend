import { NextResponse } from 'next/server'

export async function GET() {
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (isMockMode) {
    // Mock 모드일 때 랜덤 디폴트 프로필 생성
    return NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: 1000,
      message: 'Success (Mock)',
      result: {
        defaultUsername: `리딩여우${Math.random().toString(36).substr(2, 6)}`,
        defaultProfileImage:
          'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
      },
    })
  }

  // 실제 백엔드 API 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members/onboarding/default-profile`,
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
    console.error('Error fetching default profile:', error)
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
