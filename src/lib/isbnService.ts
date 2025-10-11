import type { BookInfo } from '@/types/book'

/**
 * ISBN을 통해 책 정보를 가져오는 서비스
 * 알라딘 API를 사용하여 한국 도서 정보를 조회합니다.
 */

/**
 * 알라딘 API로 ISBN 검색
 * @param isbn - 검색할 ISBN (10자리 또는 13자리)
 * @returns 책 정보 또는 null
 */
export async function fetchBookByISBN(isbn: string): Promise<BookInfo | null> {
  // ISBN 유효성 검사
  const cleanedISBN = isbn.replace(/[-\s]/g, '')
  if (cleanedISBN.length !== 10 && cleanedISBN.length !== 13) {
    throw new Error(
      '유효하지 않은 ISBN입니다. 10자리 또는 13자리를 입력해주세요.'
    )
  }

  try {
    const result = await fetchFromAladin(cleanedISBN)
    return result
  } catch (error) {
    console.error('ISBN 검색 실패:', error)
    throw error
  }
}

/**
 * Next.js API Route를 통해 ISBN 조회
 * @param isbn - ISBN 번호
 * @returns 책 정보 또는 null
 */
async function fetchFromAladin(isbn: string): Promise<BookInfo | null> {
  try {
    // Next.js API Route 호출 (CORS 문제 해결)
    const response = await fetch(`/api/isbn/${isbn}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `API 호출 실패: ${response.status}`)
    }

    const data = await response.json()

    // 검색 결과가 없는 경우
    if (!data.result) {
      return null
    }

    return data.result
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('알 수 없는 오류가 발생했습니다.')
  }
}

/**
 * ISBN 형식 검증
 * @param isbn - 검증할 ISBN
 * @returns 유효 여부
 */
export function isValidISBN(isbn: string): boolean {
  const cleanedISBN = isbn.replace(/[-\s]/g, '')
  return cleanedISBN.length === 10 || cleanedISBN.length === 13
}

/**
 * ISBN 포맷팅 (하이픈 추가)
 * @param isbn - 포맷팅할 ISBN
 * @returns 포맷팅된 ISBN
 */
export function formatISBN(isbn: string): string {
  const cleanedISBN = isbn.replace(/[-\s]/g, '')

  if (cleanedISBN.length === 13) {
    // 978-89-1234-567-8 형식
    return `${cleanedISBN.slice(0, 3)}-${cleanedISBN.slice(3, 5)}-${cleanedISBN.slice(5, 9)}-${cleanedISBN.slice(9, 12)}-${cleanedISBN.slice(12)}`
  } else if (cleanedISBN.length === 10) {
    // 89-1234-567-8 형식
    return `${cleanedISBN.slice(0, 2)}-${cleanedISBN.slice(2, 6)}-${cleanedISBN.slice(6, 9)}-${cleanedISBN.slice(9)}`
  }

  return isbn
}
