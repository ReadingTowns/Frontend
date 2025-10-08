import { NotificationFilter } from '@/types/notification'
import { cn } from '@/lib/utils'

interface EmptyNotificationsProps {
  filter: NotificationFilter
  className?: string
}

export default function EmptyNotifications({
  filter,
  className,
}: EmptyNotificationsProps) {
  const isUnreadFilter = filter === 'unread'

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="text-6xl mb-4">{isUnreadFilter ? '✉️' : '🔔'}</div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isUnreadFilter ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
      </h3>

      <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
        {isUnreadFilter
          ? '모든 알림을 확인했습니다. 새로운 알림이 오면 여기에 표시됩니다.'
          : '아직 받은 알림이 없습니다. 다른 사용자와 상호작용하면 알림을 받을 수 있습니다.'}
      </p>
    </div>
  )
}
