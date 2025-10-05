import { NextResponse } from 'next/server'

// Mock 데이터
const mockUserRecommendations = [
  {
    id: 1,
    nickname: '김리딩',
    profileImage:
      'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
    similarityScore: 85,
    location: '우리동네',
    isFollowing: false,
  },
  {
    id: 2,
    nickname: '박북스',
    profileImage:
      'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
    similarityScore: 78,
    location: '우리동네',
    isFollowing: false,
  },
  {
    id: 3,
    nickname: '이독서',
    profileImage:
      'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
    similarityScore: 72,
    location: '근처동네',
    isFollowing: true,
  },
]

export async function GET() {
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (isMockMode) {
    // Mock 모드일 때 mock 데이터 반환
    return NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '1000',
      message: 'Success (Mock)',
      result: mockUserRecommendations,
    })
  }

  // 실제 백엔드 API 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/recommendations`,
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
    console.error('Error fetching user recommendations:', error)
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
