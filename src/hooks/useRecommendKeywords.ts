import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Keyword } from '@/types/recommendation'

/**
 * 사용자의 선택된 취향 키워드 조회 (추천 탭용)
 * GET /api/v1/recommendations/members/me/keywords
 *
 * 주의: API는 평탄한 배열을 반환하므로 직접 사용
 */
export function useRecommendKeywords() {
  return useQuery({
    queryKey: ['recommend', 'keywords', 'me'],
    queryFn: async () => {
      const response = await api.get<Keyword[]>(
        '/api/v1/recommendations/members/me/keywords'
      )
      return response
    },
    staleTime: 5 * 60 * 1000, // 5분
  })
}
