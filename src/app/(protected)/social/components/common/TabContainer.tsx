'use client'

import { ReactNode } from 'react'

interface TabContainerProps {
  children: ReactNode
  header?: {
    title: string
    description?: string
  }
  searchBar?: ReactNode
}

/**
 * TabContainer Component
 *
 * 소셜 페이지 탭들의 통합 레이아웃 컨테이너
 *
 * Features:
 * - 일관된 배경색 (bg-gray-50)
 * - 선택적 헤더 영역 (제목 + 설명)
 * - 선택적 검색바 영역 (흰색 배경)
 * - 자동 스크롤 처리
 *
 * @example
 * ```tsx
 * <TabContainer
 *   header={{ title: "제목", description: "설명" }}
 *   searchBar={<UserSearch onSearch={handleSearch} />}
 * >
 *   {children}
 * </TabContainer>
 * ```
 */
export default function TabContainer({
  children,
  header,
  searchBar,
}: TabContainerProps) {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Optional Header */}
      {header && (
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {header.title}
          </h2>
          {header.description && (
            <p className="text-sm text-gray-500 mt-1">{header.description}</p>
          )}
        </div>
      )}

      {/* Optional Search Bar */}
      {searchBar && (
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          {searchBar}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

TabContainer.displayName = 'TabContainer'
