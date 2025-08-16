import { NextResponse } from 'next/server'

export async function DELETE() {
  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '1000',
    message: '책 삭제가 완료되었습니다.',
    result: null,
  })
}
