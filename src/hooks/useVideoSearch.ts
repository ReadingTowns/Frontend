import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { VideoRecommendationsResponse } from '@/types/recommendation'

export function useVideoSearch(keyword: string, enabled = true) {
  return useQuery({
    queryKey: ['recommendations', 'video', keyword],
    queryFn: () =>
      api.get<VideoRecommendationsResponse>('/api/v1/recommendations/video', {
        keyword,
      }),
    enabled: enabled && keyword.length > 0,
    staleTime: 10 * 60 * 1000, // 10분
  })
}
