import { NextRequest, NextResponse } from 'next/server'

// Mock 감상평 데이터
const mockReviews = [
  {
    reviewId: 1,
    content:
      '정말 인상 깊게 읽었습니다. 성장에 대한 깊은 통찰을 얻을 수 있었어요.',
    bookId: '1',
    memberId: 1,
  },
  {
    reviewId: 2,
    content:
      '디스토피아 소설의 걸작이라고 생각합니다. 현실과 너무 닮아있어서 무서웠어요.',
    bookId: '2',
    memberId: 1,
  },
]

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ bookId: string }> }
) {
  const params = await props.params
  const bookId = params.bookId
  const review = mockReviews.find(r => r.bookId === bookId)

  if (!review) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        code: '4004',
        message: '감상평을 찾을 수 없습니다.',
        result: null,
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '2000',
    message: '나의 감상평 조회 완료',
    result: {
      reviewId: review.reviewId,
      content: review.content,
    },
  })
}
