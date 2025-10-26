import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Keyword } from '@/types/keyword'

/**
 * TanStack Query keys
 */
export const keywordKeys = {
  all: ['keywords'] as const,
  candidates: () => [...keywordKeys.all, 'candidates'] as const,
  member: () => [...keywordKeys.all, 'member'] as const,
  videos: (keyword: string) => [...keywordKeys.all, 'videos', keyword] as const,
}

/**
 * 사용자의 키워드 선택 상태 조회
 */
const getMemberKeywords = async (): Promise<Keyword[]> => {
  try {
    const response = await api.get<Keyword[]>('/api/v1/keyword/member')
    return response
  } catch {
    // 404나 빈 배열은 정상 케이스 (키워드 없음)
    return []
  }
}

/**
 * 사용자의 키워드 선택 상태 확인 훅
 */
export const useKeywordStatus = () => {
  const { data: keywords = [], isLoading } = useQuery({
    queryKey: keywordKeys.member(),
    queryFn: getMemberKeywords,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    retry: 1, // 1번만 재시도
  })

  return {
    /** 키워드 선택 여부 */
    hasKeywords: keywords.length > 0,
    /** 선택된 키워드 목록 */
    keywords,
    /** 로딩 상태 */
    isLoading,
  }
}
