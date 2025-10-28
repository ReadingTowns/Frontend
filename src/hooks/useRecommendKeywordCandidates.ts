import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

/**
 * 키워드 타입
 */
export type KeywordType = 'GENRE' | 'CONTENT' | 'MOOD'

/**
 * 키워드 항목
 */
export interface KeywordItem {
  id: number
  content: string
}

/**
 * 키워드 후보 조회 응답 (실제 API 응답 구조)
 */
export interface KeywordCandidatesResponse {
  genreKeyword: KeywordItem[]
  contentKeyword: KeywordItem[]
  moodKeyword: KeywordItem[]
}

/**
 * 추천 키워드 후보 조회 (온보딩용)
 * - GET /api/v1/recommendations/members/keywords
 * - 3단계별 키워드 목록 조회
 *   - GENRE: 장르 키워드
 *   - CONTENT: 주제 키워드
 *   - MOOD: 분위기 키워드
 */
export const useRecommendKeywordCandidates = (type: KeywordType) => {
  return useQuery({
    queryKey: ['recommend', 'keywords', 'candidates', type],
    queryFn: async () => {
      const response = await api.get<KeywordCandidatesResponse>(
        '/api/v1/recommendations/members/keywords'
      )

      // TanStack Query는 undefined 반환을 허용하지 않음
      if (!response) {
        throw new Error('키워드 데이터를 불러올 수 없습니다')
      }

      // type에 맞는 키워드 배열 선택
      let keywordList: KeywordItem[]
      switch (type) {
        case 'GENRE':
          keywordList = response.genreKeyword
          break
        case 'CONTENT':
          keywordList = response.contentKeyword
          break
        case 'MOOD':
          keywordList = response.moodKeyword
          break
        default:
          throw new Error('유효하지 않은 키워드 타입입니다')
      }

      return {
        type,
        count: keywordList.length,
        keywordList,
      }
    },
    staleTime: 1000 * 60 * 10, // 10분 캐싱 (자주 변하지 않음)
    retry: 2, // 실패 시 2번 재시도
  })
}
