import { NextRequest, NextResponse } from 'next/server'

/**
 * ISBN API Route - 알라딘 API 프록시
 * 클라이언트에서 직접 호출하지 않고 Next.js API Route를 통해 알라딘 API 호출
 * CORS 문제 해결 및 API 키 보안
 */

interface AladinApiResponse {
  version: string
  logo: string
  title: string
  link: string
  pubDate: string
  totalResults: number
  startIndex: number
  itemsPerPage: number
  query: string
  searchCategoryId: number
  searchCategoryName: string
  item: AladinBookItem[]
  errorCode?: string
  errorMessage?: string
}

interface AladinBookItem {
  title: string
  link: string
  author: string
  pubDate: string
  description: string
  isbn: string
  isbn13: string
  itemId: number
  priceSales: number
  priceStandard: number
  mallType: string
  stockStatus: string
  mileage: number
  cover: string
  categoryId: number
  categoryName: string
  publisher: string
  salesPoint: number
  adult: boolean
  fixedPrice: boolean
  customerReviewRank: number
  subInfo?: {
    subTitle?: string
    originalTitle?: string
    itemPage?: number
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ isbn: string }> }
) {
  try {
    const { isbn } = await context.params

    // ISBN 유효성 검사
    const cleanedISBN = isbn.replace(/[-\s]/g, '')
    if (cleanedISBN.length !== 10 && cleanedISBN.length !== 13) {
      return NextResponse.json(
        {
          code: '400',
          message:
            '유효하지 않은 ISBN입니다. 10자리 또는 13자리를 입력해주세요.',
          result: null,
        },
        { status: 400 }
      )
    }

    // API 키 확인
    const TTB_KEY = process.env.NEXT_PUBLIC_ALADIN_API_KEY

    if (!TTB_KEY) {
      console.error('알라딘 API 키가 설정되지 않았습니다.')
      return NextResponse.json(
        {
          code: '500',
          message: 'API 키가 설정되지 않았습니다.',
          result: null,
        },
        { status: 500 }
      )
    }

    // 알라딘 API 호출 (HTTPS 사용)
    const url = `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${TTB_KEY}&itemIdType=ISBN&ItemId=${cleanedISBN}&output=js&Version=20131101`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 서버에서 호출하므로 CORS 문제 없음
    })

    if (!response.ok) {
      console.error('알라딘 API 호출 실패:', response.status)
      return NextResponse.json(
        {
          code: '500',
          message: `알라딘 API 호출 실패: ${response.status}`,
          result: null,
        },
        { status: 500 }
      )
    }

    const data: AladinApiResponse = await response.json()

    // 에러 응답 처리
    if (data.errorCode) {
      return NextResponse.json(
        {
          code: '400',
          message: data.errorMessage || '알라딘 API 오류',
          result: null,
        },
        { status: 400 }
      )
    }

    // 검색 결과가 없는 경우
    if (!data.item || data.item.length === 0) {
      return NextResponse.json(
        {
          code: '404',
          message: '해당 ISBN으로 책을 찾을 수 없습니다.',
          result: null,
        },
        { status: 404 }
      )
    }

    const book = data.item[0]

    // 책 정보 반환
    return NextResponse.json({
      code: '1000',
      message: '성공',
      result: {
        isbn: book.isbn13 || book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        publishDate: book.pubDate,
        coverImage: book.cover,
        description: book.description,
        category: book.categoryName,
        price: book.priceSales,
        link: book.link,
      },
    })
  } catch (error) {
    console.error('ISBN API Route 에러:', error)
    return NextResponse.json(
      {
        code: '500',
        message:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
        result: null,
      },
      { status: 500 }
    )
  }
}
