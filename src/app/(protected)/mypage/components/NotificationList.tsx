import { Notification } from '@/types/notification'
import NotificationCard from './NotificationCard'
import { cn } from '@/lib/utils'

interface NotificationListProps {
  notifications: Notification[]
  onLoadMore: () => void
  hasNextPage?: boolean
  isLoadingMore?: boolean
  className?: string
}

export default function NotificationList({
  notifications,
  onLoadMore,
  hasNextPage = false,
  isLoadingMore = false,
  className,
}: NotificationListProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {notifications.map(notification => (
        <NotificationCard
          key={notification.notificationId}
          notification={notification}
        />
      ))}

      {/* 더 보기 버튼 */}
      {hasNextPage && (
        <div className="flex justify-center py-4">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className={cn(
              'px-6 py-2 text-sm font-medium rounded-lg transition-colors',
              'bg-gray-100 text-gray-700 hover:bg-gray-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoadingMore ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                불러오는 중...
              </div>
            ) : (
              '더 보기'
            )}
          </button>
        </div>
      )}

      {/* 로딩 중 표시 */}
      {isLoadingMore && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
