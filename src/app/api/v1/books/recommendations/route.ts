import { NextResponse } from 'next/server'

// Mock 데이터
const mockBookRecommendations = [
  {
    id: 1,
    title: '사피엔스',
    author: '유발 하라리',
    image: 'https://via.placeholder.com/120x180?text=Sapiens',
    reason: '최근 읽은 책과 유사한 주제',
    categories: ['역사', '인문'],
    rating: 4.5,
  },
  {
    id: 2,
    title: '아토믹 해빗',
    author: '제임스 클리어',
    image: 'https://via.placeholder.com/120x180?text=AtomicHabits',
    reason: '자기계발 관심사 기반',
    categories: ['자기계발', '습관'],
    rating: 4.7,
  },
  {
    id: 3,
    title: '미드나이트 라이브러리',
    author: '매트 헤이그',
    image: 'https://via.placeholder.com/120x180?text=MidnightLibrary',
    reason: '감성적인 소설 선호 패턴',
    categories: ['소설', '철학'],
    rating: 4.3,
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
      result: mockBookRecommendations,
    })
  }

  // 실제 백엔드 API 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/books/recommendations`,
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
    console.error('Error fetching book recommendations:', error)
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
