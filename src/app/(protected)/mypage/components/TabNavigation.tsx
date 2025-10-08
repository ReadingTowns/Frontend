import { cn } from '@/lib/utils'

interface TabNavigationProps {
  activeTab: 'settings' | 'notifications'
  onTabChange: (tab: 'settings' | 'notifications') => void
  unreadCount?: number
  className?: string
}

export default function TabNavigation({
  activeTab,
  onTabChange,
  unreadCount = 0,
  className,
}: TabNavigationProps) {
  return (
    <div className={cn('border-b border-gray-200 mb-6', className)}>
      <nav className="flex">
        <button
          onClick={() => onTabChange('settings')}
          className={cn(
            'flex-1 py-3 px-4 text-center font-medium text-sm border-b-2 transition-colors',
            activeTab === 'settings'
              ? 'border-primary-400 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
          data-testid="settings-tab"
        >
          설정
        </button>
        <button
          onClick={() => onTabChange('notifications')}
          className={cn(
            'flex-1 py-3 px-4 text-center font-medium text-sm border-b-2 transition-colors relative',
            activeTab === 'notifications'
              ? 'border-primary-400 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
          data-testid="notifications-tab"
        >
          알림 센터
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </nav>
    </div>
  )
}
