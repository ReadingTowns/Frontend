import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { BookSearchResponse } from '@/types/recommendation'

/**
 * 검색으로 책 추천 (추천 탭용) - 백엔드 미구현
 * GET /api/v1/recommendations/books/search?keyword={}
 */
export function useRecommendBookSearch(keyword: string, enabled = true) {
  return useQuery({
    queryKey: ['recommend', 'books', 'search', keyword],
    queryFn: () =>
      api.get<BookSearchResponse>('/api/v1/recommendations/books/search', {
        keyword,
      }),
    enabled: enabled && keyword.length > 0,
    staleTime: 10 * 60 * 1000, // 10분
  })
}
