import { NextRequest, NextResponse } from 'next/server'
import { API_CODES } from '@/constants/apiCodes'

// Mock으로 사용할지 실제 백엔드로 보낼지 결정
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

// 등록된 책들을 임시로 메모리에 저장 (개발용)
const registeredBooks: unknown[] = []

interface BookRegisterRequest {
  isbn?: string
  image?: string
  title: string
  author: string
  publisher: string
}

// POST: 서재에 책 등록
export async function POST(request: NextRequest) {
  try {
    const body: BookRegisterRequest = await request.json()

    // 필수 필드 검증
    if (!body.title || !body.author || !body.publisher) {
      return NextResponse.json(
        {
          code: API_CODES.BAD_REQUEST,
          message: '필수 항목을 모두 입력해주세요 (제목, 저자, 출판사)',
          result: null,
        },
        { status: 400 }
      )
    }

    if (USE_MOCK) {
      // Mock 데이터 처리
      const newBook = {
        id: Math.random().toString(36).substr(2, 9),
        ...body,
        createdAt: new Date().toISOString(),
      }

      // 메모리에 저장
      registeredBooks.push(newBook)

      return NextResponse.json({
        code: API_CODES.SUCCESS,
        message: '서재에 책 등록 완료',
        result: null,
      })
    } else {
      // 실제 백엔드 API 호출
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/v1/bookhouse/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 쿠키에서 토큰 추출해서 전달 필요
        },
        body: JSON.stringify(body),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json(
          {
            code: data.code || API_CODES.INTERNAL_ERROR,
            message: data.message || '책 등록에 실패했습니다',
            result: null,
          },
          { status: response.status }
        )
      }

      return NextResponse.json({
        code: API_CODES.SUCCESS,
        message: '서재에 책 등록 완료',
        result: data.result,
      })
    }
  } catch (error) {
    console.error('Book registration error:', error)
    return NextResponse.json(
      {
        code: API_CODES.INTERNAL_ERROR,
        message: '서버 오류가 발생했습니다',
        result: null,
      },
      { status: 500 }
    )
  }
}

// GET: 등록된 책 목록 조회 (개발용)
export async function GET(request: NextRequest) {
  if (!USE_MOCK) {
    return NextResponse.json(
      {
        code: API_CODES.NOT_FOUND,
        message: 'Mock 모드에서만 사용 가능합니다',
        result: null,
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    code: API_CODES.SUCCESS,
    message: '등록된 책 목록 조회 성공',
    result: registeredBooks,
  })
}
