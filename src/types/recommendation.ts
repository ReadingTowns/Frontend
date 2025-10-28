// Keyword 관련 타입
export interface Keyword {
  id: number
  content: string
}

export interface UserKeywords {
  genreKeywordList: Keyword[]
  contentKeywordList: Keyword[]
  moodKeywordList: Keyword[]
}

export interface KeywordsResponse {
  code: string
  message: string
  result: UserKeywords
}

// 평탄한 키워드 배열 응답 (실제 API)
export interface FlatKeywordsResponse {
  code: string
  message: string
  result: Keyword[]
}

// 책 추천 타입
export interface BookRecommendation {
  bookId: number
  bookImage: string | null
  bookName: string
  author: string
  publisher: string
  similarity: number
  relatedUserKeywords: string[] | null
}

export interface BookRecommendationsResponse {
  code: string
  message: string
  result: BookRecommendation[]
}

// 사용자 추천 타입
export interface UserRecommendation {
  memberId: number
  nickname: string
  profileImage: string
  currentTown: string
  userRating: number
  similarity?: number
  distance?: string
  matchedKeywords?: string[]
  matchedBooks?: string[]
  availableTime: string
}

export interface UserRecommendationsResponse {
  code: string
  message: string
  result: UserRecommendation[]
}

// 영상 추천 타입
export interface VideoRecommendation {
  title: string
  videoUrl: string
  thumbnail: string
}

export interface VideoRecommendationsResponse {
  code: string
  message: string
  result: VideoRecommendation[]
}

// 책 검색 추천 타입 (백엔드 미구현)
export interface BookSearchResult {
  book_id: number
  book_name: string
  keywords: string
  similarity_score: number
  method: string
  review_preview: string
}

export interface BookSearchResponse {
  code: string
  message: string
  result: {
    results: BookSearchResult[]
    method: string
  }
}
