'use client'

import { HomeTab } from '@/types/home'

interface HomeTabsProps {
  nickname: string
  activeTab: HomeTab
  onTabChange: (tab: HomeTab) => void
}

/**
 * 홈 화면 상단 탭바 컴포넌트
 * - "---님의 리딩타운" 탭
 * - "---님에게 추천하는 도서" 탭
 */
export default function HomeTabs({
  nickname,
  activeTab,
  onTabChange,
}: HomeTabsProps) {
  const tabs = [
    { id: 'myTown' as const, label: `${nickname}님의 리딩타운` },
    {
      id: 'recommendations' as const,
      label: `${nickname}님에게 추천하는 도서`,
    },
  ]

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-all
              ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

HomeTabs.displayName = 'HomeTabs'
