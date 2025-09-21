'use client'

type TabType = 'recommend' | 'following' | 'followers'

interface UserTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function UserTabs({ activeTab, onTabChange }: UserTabsProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'recommend', label: '추천' },
    { id: 'following', label: '팔로잉' },
    { id: 'followers', label: '팔로워' },
  ]

  return (
    <div className="flex">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === tab.id
              ? 'text-primary-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
          )}
        </button>
      ))}
    </div>
  )
}
