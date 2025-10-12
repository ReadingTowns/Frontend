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
  isOnboarded: boolean // 백엔드 필드명과 일치
}

// 인증 상태 확인 API 응답
export type AuthMeApiResponse = ApiResponse<User | null>

// 로그아웃 API 응답
export type LogoutApiResponse = ApiResponse<null>

// 토큰 갱신 API 응답
export type RefreshTokenApiResponse = ApiResponse<User>

// 유저 별점 관련 타입
export interface UserRating {
  memberId: number
  userRatingSum: number
  userRatingCount: number
  userRating: number | null
}

// 별점 제출 요청
export interface SubmitRatingRequest {
  memberId: number
  starRating: number // 1-5 사이의 정수
}

// 별점 제출 응답
export type SubmitRatingApiResponse = ApiResponse<boolean>

// 나의 별점 조회 응답
export type MyRatingApiResponse = ApiResponse<UserRating>

// 다른 유저 별점 조회 응답
export type UserRatingApiResponse = ApiResponse<UserRating>
