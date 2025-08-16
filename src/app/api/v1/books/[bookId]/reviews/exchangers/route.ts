import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ bookId: string }> }
) {
  const params = await props.params
  const exchangerReviews = [
    {
      reviewId: 101,
      memberName: '독서왕',
      memberImage:
        'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
      content: '이 책은 정말 인생 책이에요! 강력 추천합니다.',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      reviewId: 102,
      memberName: '책사랑',
      memberImage:
        'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
      content: '감동적인 스토리였어요. 여러 번 다시 읽고 싶습니다.',
      createdAt: '2024-01-10T15:20:00Z',
    },
  ]

  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '2000',
    message: '교환자들의 감상평 조회 완료',
    result: exchangerReviews,
  })
}
