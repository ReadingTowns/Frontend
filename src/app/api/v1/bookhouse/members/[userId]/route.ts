import { NextRequest, NextResponse } from 'next/server'

// Mock 서재 데이터 (다른 사용자의 서재는 일부만 공개)
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
]

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const params = await props.params
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '0')
  const size = parseInt(url.searchParams.get('size') || '10')

  // 다른 사람의 서재는 일부만 보여주기 (처음 4개)
  const startIndex = page * size
  const endIndex = startIndex + size
  const paginatedBooks = mockLibraryBooks.slice(startIndex, endIndex)

  const totalElements = mockLibraryBooks.length
  const totalPages = Math.ceil(totalElements / size)
  const isLast = page >= totalPages - 1

  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '1000',
    message: '사용자 서재 책 목록 조회 성공',
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
