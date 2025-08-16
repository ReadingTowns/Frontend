import { NextRequest, NextResponse } from 'next/server'

// Mock 사용자 프로필
const mockUserProfiles = [
  {
    memberId: 1,
    profileImage:
      'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
    nickname: '김책읽',
    currentTown: '강남구',
    userRating: 4.8,
    userRatingCount: 25,
    availableTime: '평일 저녁 7시 이후',
    following: false,
  },
  {
    memberId: 2,
    profileImage:
      'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
    nickname: '박문학',
    currentTown: '서초구',
    userRating: 4.3,
    userRatingCount: 18,
    availableTime: '주말 오전',
    following: true,
  },
]

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ partnerId: string }> }
) {
  const params = await props.params
  const userId = parseInt(params.partnerId)
  const profile =
    mockUserProfiles.find(p => p.memberId === userId) || mockUserProfiles[0]

  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: 1000,
    message: 'Success',
    result: profile,
  })
}
