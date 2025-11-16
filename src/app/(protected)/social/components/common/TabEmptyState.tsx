'use client'

interface TabEmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
}

/**
 * TabEmptyState Component
 *
 * 소셜 페이지 탭들의 통합 Empty State
 *
 * Features:
 * - 일관된 레이아웃 (아이콘 + 제목 + 설명)
 * - 일관된 스타일링
 * - 재사용 가능한 구조
 *
 * @example
 * ```tsx
 * <TabEmptyState
 *   icon={UserGroupIcon}
 *   title="팔로우 중인 이웃이 없습니다"
 *   description="이웃을 검색하여 팔로우해보세요"
 * />
 * ```
 */
export default function TabEmptyState({
  icon: Icon,
  title,
  description,
}: TabEmptyStateProps) {
  return (
    <div className="p-8 text-center text-gray-500">
      <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-lg mb-2">{title}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  )
}

TabEmptyState.displayName = 'TabEmptyState'
