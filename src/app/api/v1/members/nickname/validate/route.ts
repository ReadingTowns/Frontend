import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const nickname = url.searchParams.get('nickname')

  // 테스트용으로 특정 닉네임들을 중복으로 처리
  const duplicateNicknames = ['테스트', 'admin', 'root', '리딩타운']
  const isAvailable = !duplicateNicknames.includes(nickname || '')

  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: 1000,
    message: 'Success',
    result: {
      isAvailable,
    },
  })
}
