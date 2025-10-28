import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { VideoRecommendation } from '@/types/recommendation'

/**
 * 유튜브 영상 추천 검색 (추천 탭용)
 * GET /api/v1/recommendations/video?keyword={}
 */
export function useRecommendVideo(keyword: string, enabled = true) {
  return useQuery({
    queryKey: ['recommend', 'video', keyword],
    queryFn: () =>
      api.get<VideoRecommendation[]>('/api/v1/recommendations/video', {
        keyword,
      }),
    enabled: enabled && keyword.length > 0,
    staleTime: 10 * 60 * 1000, // 10분
  })
}
