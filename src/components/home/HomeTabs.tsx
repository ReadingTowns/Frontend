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
  // 탭 데이터 정의
  const tabs = [
    {
      id: 'myTown' as const,
      nickname: nickname,
      suffix: '님의 리딩타운',
      fullLabel: `${nickname}님의 리딩타운`,
    },
    {
      id: 'recommendations' as const,
      nickname: nickname,
      suffix: '님에게 추천하는 도서',
      fullLabel: `${nickname}님에게 추천하는 도서`,
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
              flex-1 min-w-0 px-3 py-3 text-sm font-medium transition-all
              ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
            aria-selected={activeTab === tab.id}
            role="tab"
            title={tab.fullLabel} // 툴팁으로 전체 텍스트 표시
          >
            <span className="flex items-center justify-center">
              {/* 닉네임 부분만 말줄임 처리 */}
              <span className="truncate max-w-[60px] sm:max-w-[80px] md:max-w-[100px]">
                {tab.nickname}
              </span>
              {/* 뒤쪽 텍스트는 고정 */}
              <span className="flex-shrink-0">{tab.suffix}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

HomeTabs.displayName = 'HomeTabs'
