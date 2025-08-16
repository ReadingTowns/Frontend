import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '2000',
    message: 'OK',
    result: {
      chatRoomId: 1,
      myBook: {
        bookhouseId: 1,
        bookName: '혼자 있는 시간의 힘',
        bookImage: 'https://via.placeholder.com/120x180?text=Book1',
      },
      yourBook: {
        bookhouseId: 2,
        bookName: '사피엔스',
        bookImage: 'https://via.placeholder.com/120x180?text=Book2',
      },
      daysLeft: 15,
    },
  })
}
