import {
  NotificationListResponse,
  Notification,
  NotificationType,
} from '@/types/notification'

export interface FetchNotificationsParams {
  filter?: 'all' | 'unread'
  limit?: number
  cursor?: string | null
}

// Mock 데이터 생성 함수
const generateMockNotifications = (count: number): Notification[] => {
  const types: NotificationType[] = [
    'EXCHANGE_REQUEST',
    'EXCHANGE_ACCEPT',
    'EXCHANGE_COMPLETE',
    'CHAT_MESSAGE',
    'FOLLOW',
    'REVIEW',
  ]

  const mockUsers = [
    {
      memberId: 2,
      nickname: '독서왕',
      profileImage: 'https://picsum.photos/seed/user2/80',
    },
    {
      memberId: 3,
      nickname: '책벌레',
      profileImage: 'https://picsum.photos/seed/user3/80',
    },
    {
      memberId: 4,
      nickname: '리딩하는고양이',
      profileImage: 'https://picsum.photos/seed/user4/80',
    },
    {
      memberId: 5,
      nickname: '북클럽장',
      profileImage: 'https://picsum.photos/seed/user5/80',
    },
    {
      memberId: 6,
      nickname: '문학소녀',
      profileImage: 'https://picsum.photos/seed/user6/80',
    },
  ]

  const bookTitles = [
    '데미안',
    '1984',
    '어린왕자',
    '해리포터',
    '반지의 제왕',
    '위대한 개츠비',
  ]

  return Array.from({ length: count }, (_, index) => {
    const type = types[index % types.length]
    const user = mockUsers[index % mockUsers.length]
    const book = bookTitles[index % bookTitles.length]

    return {
      notificationId: Date.now() + index,
      type,
      title: getNotificationTitle(type),
      message: getNotificationMessage(type, user.nickname, book),
      isRead: Math.random() > 0.6, // 40% 확률로 읽음
      createdAt: new Date(
        Date.now() - index * 1000 * 60 * 60 * (Math.random() * 24)
      ).toISOString(),
      relatedId: Math.floor(Math.random() * 1000),
      targetUrl: getTargetUrl(type),
      senderProfile: user,
    }
  })
}

// 알림 목록 조회
export async function fetchNotifications(
  params: FetchNotificationsParams = {}
): Promise<NotificationListResponse> {
  const { filter = 'all', limit = 20, cursor } = params

  // 개발 환경에서는 Mock 데이터 사용
  if (process.env.NODE_ENV === 'development') {
    // 실제 네트워크 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700))

    const allNotifications = generateMockNotifications(50)
    const filteredNotifications =
      filter === 'unread'
        ? allNotifications.filter(n => !n.isRead)
        : allNotifications

    const startIndex = cursor ? parseInt(cursor) : 0
    const endIndex = startIndex + limit
    const notifications = filteredNotifications.slice(startIndex, endIndex)

    return {
      code: '1000',
      message: 'Success',
      result: {
        notifications,
        totalCount: filteredNotifications.length,
        unreadCount: allNotifications.filter(n => !n.isRead).length,
        hasNext: endIndex < filteredNotifications.length,
        nextCursor:
          endIndex < filteredNotifications.length
            ? String(endIndex)
            : undefined,
      },
    }
  }

  // 실제 API 호출
  const searchParams = new URLSearchParams()
  if (filter === 'unread') searchParams.append('filter', 'unread')
  if (limit) searchParams.append('limit', String(limit))
  if (cursor) searchParams.append('cursor', cursor)

  const response = await fetch(
    `/api/v1/notifications?${searchParams.toString()}`,
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
  if (process.env.NODE_ENV === 'development') {
    // Mock 처리
    await new Promise(resolve => setTimeout(resolve, 300))
    return
  }

  const response = await fetch(`/api/v1/notifications/${notificationId}`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('알림 읽음 처리에 실패했습니다')
  }
}

// 알림 삭제
export async function deleteNotificationById(
  notificationId: number
): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    // Mock 처리
    await new Promise(resolve => setTimeout(resolve, 300))
    return
  }

  const response = await fetch(`/api/v1/notifications/${notificationId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('알림 삭제에 실패했습니다')
  }
}

// 모든 알림 삭제 (일괄)
export async function deleteAllUserNotifications(): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    // Mock 처리
    await new Promise(resolve => setTimeout(resolve, 500))
    return
  }

  const response = await fetch('/api/v1/notifications/all', {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('알림 일괄 삭제에 실패했습니다')
  }
}

// 헬퍼 함수들
function getNotificationTitle(type: NotificationType): string {
  const titles = {
    EXCHANGE_REQUEST: '교환 요청',
    EXCHANGE_ACCEPT: '교환 수락',
    EXCHANGE_COMPLETE: '교환 완료',
    EXCHANGE_RETURN: '반납 완료',
    CHAT_MESSAGE: '새 메시지',
    FOLLOW: '새 팔로워',
    REVIEW: '새 리뷰',
  }
  return titles[type]
}

function getNotificationMessage(
  type: NotificationType,
  nickname: string,
  bookTitle?: string
): string {
  const messages = {
    EXCHANGE_REQUEST: `${nickname}님이 "${bookTitle}" 교환을 요청했습니다`,
    EXCHANGE_ACCEPT: `${nickname}님이 교환 요청을 수락했습니다`,
    EXCHANGE_COMPLETE: `${nickname}님과의 "${bookTitle}" 교환이 완료되었습니다`,
    EXCHANGE_RETURN: `"${bookTitle}" 반납이 완료되었습니다`,
    CHAT_MESSAGE: `${nickname}님이 메시지를 보냈습니다`,
    FOLLOW: `${nickname}님이 팔로우했습니다`,
    REVIEW: `${nickname}님이 "${bookTitle}"에 리뷰를 작성했습니다`,
  }
  return messages[type]
}

function getTargetUrl(type: NotificationType): string {
  const urls = {
    EXCHANGE_REQUEST: '/chat/',
    EXCHANGE_ACCEPT: '/chat/',
    EXCHANGE_COMPLETE: '/library',
    EXCHANGE_RETURN: '/library',
    CHAT_MESSAGE: '/chat/',
    FOLLOW: '/neighbors/',
    REVIEW: '/library',
  }
  return urls[type]
}
