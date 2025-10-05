import { NextRequest, NextResponse } from 'next/server'

// Mock 서재 데이터
const mockLibraryBooks = [
  {
    id: '1',
    image: 'https://via.placeholder.com/120x180?text=Library1',
    title: '데미안',
    authorName: '헤르만 헤세',
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/120x180?text=Library2',
    title: '1984',
    authorName: '조지 오웰',
  },
  {
    id: '3',
    image: 'https://via.placeholder.com/120x180?text=Library3',
    title: '어린 왕자',
    authorName: '앙투안 드 생텍쥐페리',
  },
  {
    id: '4',
    image: 'https://via.placeholder.com/120x180?text=Library4',
    title: '해리포터와 마법사의 돌',
    authorName: 'J.K. 롤링',
  },
  {
    id: '5',
    image: 'https://via.placeholder.com/120x180?text=Library5',
    title: '반지의 제왕',
    authorName: 'J.R.R. 톨킨',
  },
  {
    id: '6',
    image: 'https://via.placeholder.com/120x180?text=Library6',
    title: '노르웨이의 숲',
    authorName: '무라카미 하루키',
  },
  {
    id: '7',
    image: 'https://via.placeholder.com/120x180?text=Library7',
    title: '백년동안의 고독',
    authorName: '가브리엘 가르시아 마르케스',
  },
  {
    id: '8',
    image: 'https://via.placeholder.com/120x180?text=Library8',
    title: '위대한 개츠비',
    authorName: 'F. 스콧 피츠제럴드',
  },
]

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '0')
  const size = parseInt(url.searchParams.get('size') || '10')

  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (isMockMode) {
    // Mock 모드일 때 페이지네이션 시뮬레이션
    const startIndex = page * size
    const endIndex = startIndex + size
    const paginatedBooks = mockLibraryBooks.slice(startIndex, endIndex)

    const totalElements = mockLibraryBooks.length
    const totalPages = Math.ceil(totalElements / size)
    const isLast = page >= totalPages - 1

    return NextResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '1000',
      message: '서재 책 목록 조회 성공 (Mock)',
      result: {
        content: paginatedBooks,
        curPage: page,
        curElements: paginatedBooks.length,
        totalPages,
        totalElements,
        last: isLast,
      },
    })
  }

  // 실제 백엔드 API 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookhouse/members/me?page=${page}&size=${size}`,
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
    console.error('Error fetching bookhouse:', error)
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
