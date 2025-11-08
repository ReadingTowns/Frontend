/**
 * Header System Type Definitions
 * 통합 헤더 시스템을 위한 타입 정의
 */

import { ReactNode } from 'react'

// 헤더 변형 타입
export type HeaderVariant =
  | 'basic' // 제목만
  | 'navigation' // 뒤로가기 + 제목
  | 'action' // 제목 + 우측 액션
  | 'progress' // 진행 표시줄
  | 'chat' // 채팅 특수 헤더

// 기본 헤더 설정
export interface BaseHeaderConfig {
  variant: HeaderVariant
  title?: string
  subtitle?: string
  className?: string
  transparent?: boolean // 투명 배경 여부
}

// Navigation 헤더 설정
export interface NavigationHeaderConfig extends BaseHeaderConfig {
  variant: 'navigation'
  onBack?: () => void // 커스텀 뒤로가기 동작
  backLabel?: string // 뒤로가기 버튼 레이블
}

// Action 헤더 설정
export interface ActionHeaderConfig extends BaseHeaderConfig {
  variant: 'action'
  actions?: ReactNode // 우측 액션 버튼들
  onBack?: () => void
}

// Progress 헤더 설정
export interface ProgressHeaderConfig extends BaseHeaderConfig {
  variant: 'progress'
  currentStep: number
  totalSteps: number
  onBack?: () => void
}

// Chat 헤더 설정
export interface ChatHeaderConfig extends BaseHeaderConfig {
  variant: 'chat'
  partner: {
    id: number
    nickname: string
    profileImage?: string
  }
  isConnected?: boolean
  bookInfo?: {
    bookName: string
    bookImage?: string
  }
  onBack?: () => void
  actions?: ReactNode // 우측 액션 버튼들 (나가기 등)
}

// 통합 헤더 설정 타입
export type HeaderConfig =
  | NavigationHeaderConfig
  | ActionHeaderConfig
  | ProgressHeaderConfig
  | ChatHeaderConfig
  | BaseHeaderConfig

// 헤더 높이 상수
export const HEADER_HEIGHT = {
  default: 56, // 기본 헤더 높이 (px)
  withSubtitle: 72, // 서브타이틀이 있는 경우
  progress: 80, // 진행 표시줄이 있는 경우
} as const

// 헤더 스타일 상수
export const HEADER_STYLES = {
  base: 'sticky top-0 z-50 bg-white border-b border-gray-200',
  transparent: 'sticky top-0 z-50 bg-transparent',
  container: 'max-w-[430px] mx-auto px-4 flex items-center',
  title: 'flex-1 text-lg font-semibold text-gray-900 truncate',
  subtitle: 'text-sm text-gray-600',
  backButton: 'p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors',
} as const
