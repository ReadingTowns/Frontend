import { NotificationListResponse } from '@/types/notification'

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

export interface FetchNotificationsParams {
  filter?: 'all' | 'unread'
  limit?: number
  cursor?: string | null
}

// 알림 목록 조회
export async function fetchNotifications(
  params: FetchNotificationsParams = {}
): Promise<NotificationListResponse> {
  const { filter = 'all', limit = 20, cursor } = params

  const searchParams = new URLSearchParams()
  if (filter === 'unread') searchParams.append('filter', 'unread')
  if (limit) searchParams.append('limit', String(limit))
  if (cursor) searchParams.append('cursor', cursor)

  const response = await fetch(
    `${BASE_URL}/api/v1/notifications?${searchParams.toString()}`,
    { credentials: 'include' }
  )

  if (!response.ok) {
    throw new Error('알림 목록을 불러오는데 실패했습니다')
  }

  return response.json()
}

// 알림 읽음 처리
export async function markNotificationAsRead(
  notificationId: number
): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/api/v1/notifications/${notificationId}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('알림 읽음 처리에 실패했습니다')
  }
}

// 알림 삭제
export async function deleteNotificationById(
  notificationId: number
): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/api/v1/notifications/${notificationId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('알림 삭제에 실패했습니다')
  }
}

// 모든 알림 삭제 (일괄)
export async function deleteAllUserNotifications(): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/v1/notifications/all`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('알림 일괄 삭제에 실패했습니다')
  }
}
