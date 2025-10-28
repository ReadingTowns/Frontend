import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { UserRecommendationsResponse } from '@/types/recommendation'

export function useUserRecommendations(type: 'taste' | 'local') {
  const endpoint =
    type === 'taste'
      ? '/api/v1/recommendations/similar-members'
      : '/api/v1/recommendations/local-members'

  return useQuery({
    queryKey: ['recommendations', 'users', type],
    queryFn: () => api.get<UserRecommendationsResponse>(endpoint),
    staleTime: 5 * 60 * 1000, // 5분
  })
}
