// 인증 관련 타입 정의

import { ApiResponse } from './common'

export interface User {
  id: string
  email: string
  name: string
  profileImage?: string
  provider: 'google' | 'kakao' | 'dev'
  isAuthenticated: boolean
  onboardingCompleted?: boolean
  memberId?: number
}

// 인증 상태 확인 API 응답
export type AuthMeApiResponse = ApiResponse<User | null>

// 로그아웃 API 응답
export type LogoutApiResponse = ApiResponse<null>

// 토큰 갱신 API 응답
export type RefreshTokenApiResponse = ApiResponse<User>
