'use client'

import { SocialTab } from '@/types/social'

interface SocialTabsProps {
  activeTab: SocialTab
  onTabChange: (tab: SocialTab) => void
  unreadCount?: number
}

export default function SocialTabs({
  activeTab,
  onTabChange,
  unreadCount = 0,
}: SocialTabsProps) {
  const tabs = [
    { id: 'messages' as const, label: '채팅', badge: unreadCount > 0 },
    { id: 'following' as const, label: '팔로잉' },
    { id: 'followers' as const, label: '팔로워' },
    { id: 'explore' as const, label: '둘러보기' },
    { id: 'exchange' as const, label: '책 교환' },
  ]

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-all relative
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
            {tab.badge && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

SocialTabs.displayName = 'SocialTabs'
