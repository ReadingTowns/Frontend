import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: 1000,
    message: 'Success',
    result: {
      defaultUsername: `리딩여우${Math.random().toString(36).substr(2, 6)}`,
      defaultProfileImage:
        'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
    },
  })
}
