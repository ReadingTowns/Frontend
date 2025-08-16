import { ApiResponse } from './common'

// 교환 중인 책 정보 타입 (노션 API 명세 기반)
export interface ExchangeData {
  chatRoomId: number
  myBook: {
    bookhouseId: number | null
    bookName: string | null
    bookImage: string | null
  }
  yourBook: {
    bookhouseId: number | null
    bookName: string | null
    bookImage: string | null
  }
  daysLeft?: number // D-day 계산용
}

// 추천 사용자 타입
export interface RecommendedUser {
  id: number
  nickname: string
  profileImage?: string
  similarityScore: number // 취향 유사도 (%)
  location: string // 동네 정보
  isFollowing?: boolean
}

// 추천 도서 타입
export interface RecommendedBook {
  id: number
  title: string
  author: string
  image?: string
  reason: string // AI 추천 이유
  categories: string[]
  rating?: number
}

// 대시보드 전체 데이터 타입
export interface DashboardData {
  currentExchange?: ExchangeData | null
  recommendedUsers: RecommendedUser[]
  recommendedBooks: RecommendedBook[]
}

// API 응답 타입들
export type ExchangeApiResponse = ApiResponse<ExchangeData | null>
export type UserRecommendationApiResponse = ApiResponse<RecommendedUser[]>
export type BookRecommendationApiResponse = ApiResponse<RecommendedBook[]>
