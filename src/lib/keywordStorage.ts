import { KeywordOnboardingDismissStatus } from '@/types/keyword'

const STORAGE_KEY = 'keyword_onboarding_dismissed'

/**
 * 키워드 온보딩 localStorage 관리 유틸리티
 */
export const KeywordOnboarding = {
  /**
   * 현재 dismiss 상태 조회
   */
  getDismissStatus(): KeywordOnboardingDismissStatus {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEY) as KeywordOnboardingDismissStatus
  },

  /**
   * "나중에 하기" - 다음 세션에 다시 표시
   */
  dismissLater() {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, 'later')
  },

  /**
   * "영구 삭제" - 다시 표시하지 않음
   */
  dismissPermanent() {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, 'permanent')
  },

  /**
   * Dismiss 상태 초기화
   */
  clearDismiss() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  },

  /**
   * 모달을 표시해야 하는지 확인
   */
  shouldShow(): boolean {
    const status = this.getDismissStatus()
    // 'permanent'인 경우에만 표시하지 않음
    // null이나 'later'인 경우 표시
    return status !== 'permanent'
  },
}
