import { useState, useEffect } from 'react'
import { KeywordOnboarding } from '@/lib/keywordStorage'

/**
 * 키워드 온보딩 모달 상태 관리 훅
 */
export const useKeywordOnboarding = () => {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    setShouldShow(KeywordOnboarding.shouldShow())
  }, [])

  return {
    /** 모달을 표시해야 하는지 여부 */
    shouldShow,

    /** 모달 강제 표시 */
    showModal: () => {
      KeywordOnboarding.clearDismiss()
      setShouldShow(true)
    },

    /** 나중에 하기 (다음 세션에 다시 표시) */
    dismissLater: () => {
      KeywordOnboarding.dismissLater()
      setShouldShow(false)
    },

    /** 영구 삭제 (다시 표시하지 않음) */
    dismissPermanent: () => {
      KeywordOnboarding.dismissPermanent()
      setShouldShow(false)
    },
  }
}
