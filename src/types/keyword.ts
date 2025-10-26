/**
 * 키워드 관련 타입 정의
 */

/**
 * 키워드 기본 타입
 */
export interface Keyword {
  id: number
  content: string
}

/**
 * 키워드 카테고리별 분류
 */
export interface KeywordCategories {
  /** 분위기 키워드 */
  moodKeyword: Keyword[]
  /** 장르 키워드 */
  genreKeyword: Keyword[]
  /** 내용 키워드 */
  contentKeyword: Keyword[]
}

/**
 * 키워드 저장 요청
 */
export interface SaveKeywordRequest {
  keywordIds: number[]
}

/**
 * YouTube 검색 응답
 */
export interface YoutubeVideo {
  title: string
  videoUrl: string
  thumbnail: string
}

/**
 * 온보딩 모달 dismiss 상태
 */
export type KeywordOnboardingDismissStatus = 'later' | 'permanent' | null
