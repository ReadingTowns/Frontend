import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { UserRecommendation } from '@/types/recommendation'

/**
 * 사용자 추천 조회 (추천 탭용)
 * - taste: 취향 기반 추천 (GET /api/v1/recommendations/similar-members)
 * - local: 동네 기반 추천 (GET /api/v1/recommendations/local-members)
 *
 * NOTE: api.get은 자동으로 result를 추출해서 반환하므로 배열 타입 직접 사용
 */
export function useRecommendUsers(type: 'taste' | 'local') {
  const endpoint =
    type === 'taste'
      ? '/api/v1/recommendations/similar-members'
      : '/api/v1/recommendations/local-members'

  return useQuery({
    queryKey: ['recommend', 'users', type],
    queryFn: () => api.get<UserRecommendation[]>(endpoint),
    staleTime: 5 * 60 * 1000, // 5분
  })
}
