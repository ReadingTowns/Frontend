import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

/**
 * 추천 도서 응답 타입 (프론트엔드용)
 */
export interface BookRecommendation {
  bookId: number
  bookTitle: string
  bookCoverImage?: string
  author: string
  publisher: string
  isbn?: string
  reason?: string
  matchScore?: number
}

/**
 * 백엔드 API 원본 응답 타입
 */
interface BookRecommendationRaw {
  bookId: number
  bookName: string
  author: string
  publisher: string
  similarity: number
}

/**
 * TanStack Query keys
 */
export const bookRecommendationKeys = {
  all: ['bookRecommendations'] as const,
  list: () => [...bookRecommendationKeys.all, 'list'] as const,
}

/**
 * 추천 도서 목록 조회
 */
const getBookRecommendations = async (): Promise<BookRecommendation[]> => {
  // api.get()은 이미 ApiResponse.result를 반환함
  const books = await api.get<BookRecommendationRaw[]>(
    '/api/v1/members/recommendations/books'
  )

  // 백엔드 응답을 프론트엔드 타입으로 변환
  return books.map(book => ({
    bookId: book.bookId,
    bookTitle: book.bookName,
    author: book.author,
    publisher: book.publisher,
    matchScore: book.similarity,
    // bookCoverImage와 isbn은 별도 API로 가져오거나 추후 추가
  }))
}

/**
 * 추천 도서 목록 조회 훅
 */
export const useBookRecommendations = () => {
  return useQuery({
    queryKey: bookRecommendationKeys.list(),
    queryFn: getBookRecommendations,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  })
}
