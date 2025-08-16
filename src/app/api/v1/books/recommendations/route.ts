import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '1000',
    message: 'Success',
    result: [
      {
        id: 1,
        title: '사피엔스',
        author: '유발 하라리',
        image: 'https://via.placeholder.com/120x180?text=Sapiens',
        reason: '최근 읽은 책과 유사한 주제',
        categories: ['역사', '인문'],
        rating: 4.5,
      },
      {
        id: 2,
        title: '아토믹 해빗',
        author: '제임스 클리어',
        image: 'https://via.placeholder.com/120x180?text=AtomicHabits',
        reason: '자기계발 관심사 기반',
        categories: ['자기계발', '습관'],
        rating: 4.7,
      },
      {
        id: 3,
        title: '미드나이트 라이브러리',
        author: '매트 헤이그',
        image: 'https://via.placeholder.com/120x180?text=MidnightLibrary',
        reason: '감성적인 소설 선호 패턴',
        categories: ['소설', '철학'],
        rating: 4.3,
      },
    ],
  })
}
