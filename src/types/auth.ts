// 인증 관련 타입 정의

import { ApiResponse } from './common'

export interface User {
  memberId: number
  profileImage?: string
  nickname?: string
  currentTown?: string
  userRating?: number | null
  userRatingCount?: number
  availableTime?: string | null
}

// 온보딩 완료 여부 확인 API 응답
export interface OnboardingCheckResponse {
  onboardingCompleted: boolean
}

// 인증 상태 확인 API 응답
export type AuthMeApiResponse = ApiResponse<User | null>

// 로그아웃 API 응답
export type LogoutApiResponse = ApiResponse<null>

// 토큰 갱신 API 응답
export type RefreshTokenApiResponse = ApiResponse<User>
