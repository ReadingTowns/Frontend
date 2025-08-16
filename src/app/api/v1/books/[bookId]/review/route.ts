import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ bookId: string }> }
) {
  const params = await props.params
  const body = await request.json()

  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '2000',
    message: '감상평 등록이 완료되었습니다.',
    result: {
      content: body.content,
    },
  })
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ bookId: string }> }
) {
  const params = await props.params
  const body = await request.json()

  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '2000',
    message: '감상평 수정 완료',
    result: {
      content: body.content,
    },
  })
}
