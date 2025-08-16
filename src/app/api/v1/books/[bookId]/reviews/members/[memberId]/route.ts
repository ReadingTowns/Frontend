import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ bookId: string; memberId: string }> }
) {
  const params = await props.params
  const userBookReview = {
    reviewId: 201,
    content: '작가의 상상력이 정말 뛰어나다고 생각해요. 몰입도가 높았습니다.',
    memberName: '김책읽',
    memberImage:
      'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
  }

  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '2000',
    message: '특정 사람의 감상평 조회 완료',
    result: userBookReview,
  })
}
