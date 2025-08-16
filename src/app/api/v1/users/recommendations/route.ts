import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '1000',
    message: 'Success',
    result: [
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
    ],
  })
}
