import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { KeywordCategories } from '@/types/keyword'
import { keywordKeys } from './useKeywordStatus'

/**
 * 키워드 후보 조회
 */
const getKeywordCandidates = async (): Promise<KeywordCategories> => {
  const response = await api.get<KeywordCategories>('/api/v1/keyword')
  return response
}

/**
 * 키워드 후보 목록 조회 훅
 * - 3개 카테고리 (moodKeyword, genreKeyword, contentKeyword)
 */
export const useKeywords = () => {
  return useQuery({
    queryKey: keywordKeys.candidates(),
    queryFn: getKeywordCandidates,
    staleTime: 1000 * 60 * 10, // 10분 캐싱 (자주 변하지 않음)
  })
}
