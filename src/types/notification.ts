// 알림 타입 정의
export type NotificationType =
  | 'EXCHANGE_REQUEST' // 교환 요청
  | 'EXCHANGE_ACCEPT' // 교환 수락
  | 'EXCHANGE_COMPLETE' // 교환 완료
  | 'EXCHANGE_RETURN' // 반납 완료
  | 'CHAT_MESSAGE' // 채팅 메시지
  | 'FOLLOW' // 팔로우
  | 'REVIEW' // 리뷰 작성

// 알림 인터페이스
export interface Notification {
  notificationId: number
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
  relatedId?: number
  targetUrl?: string
  senderProfile?: {
    memberId: number
    nickname: string
    profileImage?: string
  }
  metadata?: Record<string, unknown>
}

// API 응답 타입
export interface NotificationListResponse {
  code: string
  message: string
  result: {
    notifications: Notification[]
    totalCount: number
    unreadCount: number
    hasNext: boolean
    nextCursor?: string
  }
}

// 필터 타입
export type NotificationFilter = 'all' | 'unread'

// 알림 상태
export interface NotificationState {
  notifications: Notification[]
  filter: NotificationFilter
  isLoading: boolean
  hasNext: boolean
  nextCursor?: string
  unreadCount: number
}
