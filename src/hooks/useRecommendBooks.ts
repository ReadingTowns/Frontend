import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { BookRecommendation } from '@/types/recommendation'

/**
 * 추천 도서 조회 (추천 탭용)
 * GET /api/v1/recommendations/books
 */
export function useRecommendBooks() {
  return useQuery({
    queryKey: ['recommend', 'books'],
    queryFn: () =>
      api.get<BookRecommendation[]>('/api/v1/recommendations/books'),
    staleTime: 5 * 60 * 1000, // 5분
  })
}
