import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { BookSearchResponse } from '@/types/recommendation'

/**
 * 검색으로 책 추천 (추천 탭용)
 * GET /api/v1/recommendations/books/search?keyword={}
 */
export function useRecommendBookSearch(keyword: string, enabled = true) {
  return useQuery({
    queryKey: ['recommend', 'books', 'search', keyword],
    queryFn: async (): Promise<BookSearchResponse> => {
      // API가 result 필드 안에 응답을 담아서 보내줌
      const data = await api.get<BookSearchResponse>(
        '/api/v1/recommendations/books/search',
        {
          keyword,
        }
      )
      return data
    },
    enabled: enabled && keyword.length > 0,
    staleTime: 10 * 60 * 1000, // 10분
  })
}
