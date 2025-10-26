'use client'

import { useEffect } from 'react'

interface KeywordOnboardingModalProps {
  /** 맞춤 추천 받기 버튼 클릭 핸들러 */
  onAccept: () => void
  /** 나중에 하기 버튼 클릭 핸들러 */
  onDismiss: () => void
  /** 모달 닫기 핸들러 (X 버튼, 백드롭 클릭) */
  onClose: () => void
}

/**
 * 키워드 온보딩 모달 컴포넌트
 * - 키워드가 없는 사용자에게 맞춤 추천을 받을지 안내
 * - 2초 딜레이 후 자동으로 표시됨
 */
export default function KeywordOnboardingModal({
  onAccept,
  onDismiss,
  onClose,
}: KeywordOnboardingModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // 포커스 트랩 (모달 내부에만 포커스 유지)
  useEffect(() => {
    const modal = document.getElementById('keyword-onboarding-modal')
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="keyword-onboarding-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2
              id="modal-title"
              className="text-xl font-bold text-gray-900 mb-1"
            >
              📚 맞춤 추천을 받아보세요
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="모달 닫기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 설명 */}
        <p
          id="modal-description"
          className="text-gray-600 text-sm mb-6 leading-relaxed"
        >
          취향에 맞는 키워드를 선택하면:
        </p>

        {/* 혜택 리스트 */}
        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-primary-600 text-lg flex-shrink-0">✓</span>
            <span className="text-gray-700 text-sm">
              더 정확한 책 추천을 받을 수 있어요
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 text-lg flex-shrink-0">✓</span>
            <span className="text-gray-700 text-sm">
              비슷한 취향의 이웃을 발견할 수 있어요
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 text-lg flex-shrink-0">✓</span>
            <span className="text-gray-700 text-sm">
              개인화된 독서 경험을 즐길 수 있어요
            </span>
          </li>
        </ul>

        {/* 버튼 그룹 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onAccept}
            className="w-full bg-primary-400 hover:bg-primary-500 text-white font-medium py-3.5 px-4 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            맞춤 추천 받기
          </button>
          <button
            onClick={onDismiss}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
          >
            나중에 할게요
          </button>
        </div>
      </div>
    </div>
  )
}

KeywordOnboardingModal.displayName = 'KeywordOnboardingModal'
