import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { SaveKeywordRequest } from '@/types/keyword'
import { keywordKeys } from './useKeywordStatus'
import { bookRecommendationKeys } from './useBookRecommendations'

/**
 * 키워드 저장
 */
const saveKeywords = async (keywordIds: number[]): Promise<void> => {
  const request: SaveKeywordRequest = { keywordIds }
  await api.post('/api/v1/keyword/member', request)
}

/**
 * 키워드 저장 훅
 * - 성공 시 관련 쿼리 무효화하여 추천 목록 갱신
 */
export const useSaveKeywords = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveKeywords,
    onSuccess: () => {
      // 키워드 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: keywordKeys.member() })

      // 추천 관련 쿼리 무효화 (새로운 키워드 기반 추천)
      queryClient.invalidateQueries({ queryKey: bookRecommendationKeys.list() })

      // TODO: 사용자 추천 쿼리 키가 구현되면 추가
      // queryClient.invalidateQueries({ queryKey: memberRecommendationKeys.list() })
    },
  })
}
