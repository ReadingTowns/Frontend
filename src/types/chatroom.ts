/**
 * ChatRoom Type Definitions
 * API 명세: docs/chatroom-api-spec.md 참조
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * 채팅룸 리스트 아이템
 * GET /api/v1/chatrooms
 */
export interface ChatRoomListItem {
  chatroomId: number // API returns lowercase 'r'
  partnerName: string
  myBookImage?: string
  partnerBookImage?: string
  lastMessage?: string | null
  lastMessageTime?: string | null
}

/**
 * 메시지
 * GET /api/v1/chatrooms/{id}/messages
 */
export interface Message {
  messageId: number
  senderId: number
  messageText: string
  sentTime: string
}

/**
 * 메시지 조회 응답
 */
export interface MessagesResponse {
  myMemberId: number
  message: Message[]
  paging: {
    nextCursor: number | null
    hasMore: boolean
  }
}

/**
 * 상대방 프로필
 * GET /api/v1/chatrooms/{id}/partner/profile
 */
export interface PartnerProfile {
  memberId: number
  nickname: string
  profileImage?: string
}

/**
 * 교환 상태
 */
export type ExchangeStatus = 'PENDING' | 'REQUEST' | 'REJECTED' | 'ACCEPTED'

/**
 * 교환 책 정보
 */
export interface ExchangeBook {
  exchangeStatusId: number | null
  bookhouseId: number | null
  bookName: string | null
  bookImage: string | null
  isAccepted: ExchangeStatus
}

/**
 * 교환 책 정보 응답
 * GET /api/v1/chatrooms/{id}/books
 */
export interface ExchangeBooksInfo {
  myBook: ExchangeBook
  partnerBook: ExchangeBook
}

// ============================================================================
// API Request Types
// ============================================================================

/**
 * 채팅룸 생성 요청
 * POST /api/v1/chatrooms
 */
export interface CreateChatRoomRequest {
  memberId: number
  bookId: number
}

/**
 * 채팅룸 생성 응답
 */
export interface CreateChatRoomResponse {
  chatroomId: number // API returns lowercase 'r'
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * 채팅룸 상태
 */
export type ChatRoomStatus = 'active' | 'archived' | 'completed'

/**
 * 메시지 타입
 */
export type MessageType = 'text' | 'system' | 'exchange_request'
