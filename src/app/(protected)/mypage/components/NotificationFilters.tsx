import { NotificationFilter } from '@/types/notification'
import { cn } from '@/lib/utils'

interface NotificationFiltersProps {
  filter: NotificationFilter
  onFilterChange: (filter: NotificationFilter) => void
  totalCount: number
  unreadCount: number
  onDeleteAll: () => void
  isDeleting?: boolean
  className?: string
}

export default function NotificationFilters({
  filter,
  onFilterChange,
  totalCount,
  unreadCount,
  onDeleteAll,
  isDeleting = false,
  className,
}: NotificationFiltersProps) {
  const handleDeleteAll = () => {
    if (window.confirm('모든 알림을 삭제하시겠습니까?')) {
      onDeleteAll()
    }
  }

  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {/* 필터 버튼 */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onFilterChange('unread')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            filter === 'unread'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
          data-testid="filter-unread"
        >
          📧 안읽음 ({unreadCount})
        </button>
        <button
          onClick={() => onFilterChange('all')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            filter === 'all'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
          data-testid="filter-all"
        >
          📑 전체 ({totalCount})
        </button>
      </div>

      {/* 전체 삭제 버튼 */}
      <button
        onClick={handleDeleteAll}
        disabled={isDeleting || totalCount === 0}
        className={cn(
          'text-sm text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed',
          'transition-colors'
        )}
        data-testid="delete-all-button"
      >
        {isDeleting ? '삭제 중...' : '전체삭제'}
      </button>
    </div>
  )
}
