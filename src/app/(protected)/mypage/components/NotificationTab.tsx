import { useState } from 'react'
import {
  useNotifications,
  useNotificationMutations,
} from '@/hooks/useNotifications'
import { NotificationFilter, Notification } from '@/types/notification'
import NotificationList from './NotificationList'
import NotificationFilters from './NotificationFilters'
import EmptyNotifications from './EmptyNotifications'

export default function NotificationTab() {
  const [filter, setFilter] = useState<NotificationFilter>('all')

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useNotifications({ filter })

  // 타입 가드: data가 정의되어 있는지 확인
  const pages = data?.pages ?? []

  const { deleteAllNotifications } = useNotificationMutations()

  // 모든 페이지의 알림 합치기
  const allNotifications: Notification[] = pages.flatMap(
    page => page.result.notifications
  )
  const totalCount = pages[0]?.result?.totalCount || 0
  const unreadCount = pages[0]?.result?.unreadCount || 0

  const handleFilterChange = (newFilter: NotificationFilter) => {
    setFilter(newFilter)
  }

  const handleDeleteAll = () => {
    deleteAllNotifications.mutate()
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-4">
          <p>알림을 불러오는데 실패했습니다</p>
          <p className="text-sm text-gray-500 mt-1">
            잠시 후 다시 시도해주세요
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="p-4">
        <NotificationFilters
          filter={filter}
          onFilterChange={handleFilterChange}
          totalCount={totalCount}
          unreadCount={unreadCount}
          onDeleteAll={handleDeleteAll}
          isDeleting={deleteAllNotifications.isPending}
        />

        {allNotifications.length === 0 ? (
          <EmptyNotifications filter={filter} />
        ) : (
          <NotificationList
            notifications={allNotifications}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        )}
      </div>
    </div>
  )
}
