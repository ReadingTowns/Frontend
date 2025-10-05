import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    code: '1000',
    message: '로그아웃이 완료되었습니다.',
    result: null,
  })

  const isProduction = process.env.NODE_ENV === 'production'

  // 쿠키 삭제 - 환경에 따라 도메인 설정
  if (isProduction) {
    // 프로덕션: 도메인 명시적으로 지정
    response.cookies.set('access_token', '', {
      path: '/',
      domain: '.readingtown.site', // 서브도메인 포함 모든 도메인에서 삭제
      maxAge: 0,
      sameSite: 'lax',
    })

    response.cookies.set('refresh_token', '', {
      path: '/',
      domain: '.readingtown.site', // 서브도메인 포함 모든 도메인에서 삭제
      maxAge: 0,
      sameSite: 'lax',
    })
  } else {
    // 개발환경: 도메인 지정하지 않음 (localhost)
    response.cookies.set('access_token', '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
    })

    response.cookies.set('refresh_token', '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
    })
  }

  return response
}
