'use client'

interface TabLoadingStateProps {
  message?: string
}

/**
 * TabLoadingState Component
 *
 * 소셜 페이지 탭들의 통합 Loading State
 *
 * Features:
 * - 일관된 스피너 디자인
 * - 커스텀 메시지 지원
 * - 일관된 레이아웃
 *
 * @example
 * ```tsx
 * <TabLoadingState />
 * <TabLoadingState message="검색 중..." />
 * ```
 */
export default function TabLoadingState({
  message = '불러오는 중...',
}: TabLoadingStateProps) {
  return (
    <div className="p-8 text-center text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto" />
      <p className="mt-4">{message}</p>
    </div>
  )
}

TabLoadingState.displayName = 'TabLoadingState'
