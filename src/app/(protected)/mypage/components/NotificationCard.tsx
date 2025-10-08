import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Notification, NotificationType } from '@/types/notification'
import { useNotificationMutations } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'

interface NotificationCardProps {
  notification: Notification
  className?: string
}

// 알림 타입별 스타일 설정
const notificationStyles: Record<
  NotificationType,
  { icon: string; bgColor: string; borderColor: string }
> = {
  EXCHANGE_REQUEST: {
    icon: '📚',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  EXCHANGE_ACCEPT: {
    icon: '✅',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  EXCHANGE_COMPLETE: {
    icon: '🤝',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  EXCHANGE_RETURN: {
    icon: '📖',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  CHAT_MESSAGE: {
    icon: '💬',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  FOLLOW: { icon: '❤️', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
  REVIEW: {
    icon: '⭐',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
}

export default function NotificationCard({
  notification,
  className,
}: NotificationCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const { markAsRead, deleteNotification } = useNotificationMutations()

  const style = notificationStyles[notification.type]
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ko,
  })

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.notificationId)
    }

    if (notification.targetUrl) {
      const url = notification.relatedId
        ? `${notification.targetUrl}${notification.relatedId}`
        : notification.targetUrl
      router.push(url)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteNotification.mutateAsync(notification.notificationId)
    } catch {
      setIsDeleting(false)
    }
  }

  // 스와이프 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setSwipeOffset(0)
    // 시작 지점 저장을 위한 data attribute 사용
    e.currentTarget.setAttribute('data-start-x', String(touch.clientX))
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const startX = parseFloat(
      e.currentTarget.getAttribute('data-start-x') || '0'
    )
    const deltaX = touch.clientX - startX

    // 왼쪽 스와이프만 허용
    if (deltaX < 0) {
      setSwipeOffset(Math.max(deltaX, -80))
    }
  }

  const handleTouchEnd = () => {
    if (swipeOffset < -40) {
      handleDelete()
    } else {
      setSwipeOffset(0)
    }
  }

  return (
    <div
      className={cn(
        'relative bg-white border-b border-gray-100 transition-all duration-200',
        className
      )}
      style={{ transform: `translateX(${swipeOffset}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-testid="notification-card"
    >
      {/* 삭제 버튼 (스와이프 시 표시) */}
      {swipeOffset < -10 && (
        <div className="absolute right-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center">
          <span className="text-white text-sm font-medium">삭제</span>
        </div>
      )}

      <div
        onClick={handleClick}
        className={cn(
          'p-4 cursor-pointer active:bg-gray-50 transition-colors',
          !notification.isRead && 'relative'
        )}
      >
        {/* 읽지 않음 표시 */}
        {!notification.isRead && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-400 rounded-full" />
        )}

        <div className="flex items-start gap-3">
          {/* 아이콘 */}
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg',
              style.bgColor,
              style.borderColor,
              'border'
            )}
          >
            {style.icon}
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4
                className={cn(
                  'text-sm font-medium truncate',
                  notification.isRead ? 'text-gray-600' : 'text-gray-900'
                )}
              >
                {notification.title}
              </h4>
              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                {timeAgo}
              </span>
            </div>

            <div className="flex items-start gap-2">
              {/* 발신자 프로필 */}
              {notification.senderProfile && (
                <img
                  src={
                    notification.senderProfile.profileImage ||
                    '/default-avatar.png'
                  }
                  alt={notification.senderProfile.nickname}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
              )}

              <p
                className={cn(
                  'text-sm leading-relaxed',
                  notification.isRead ? 'text-gray-500' : 'text-gray-700'
                )}
              >
                {notification.message}
              </p>
            </div>
          </div>
        </div>

        {/* 로딩 오버레이 */}
        {isDeleting && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-400 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
