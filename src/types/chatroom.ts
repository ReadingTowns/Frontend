/**
 * ChatRoom Type Definitions
 * API 명세: docs/chatroom-api-spec.md 참조
 */

import { MessageType } from './exchange'

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
 *
 * Breaking Changes (백엔드 마이그레이션):
 * - content → messageText 필드명 변경
 * - messageType 필드 추가 (TEXT, EXCHANGE_REQUEST, EXCHANGE_ACCEPTED, etc.)
 * - relatedBookhouseId, relatedExchangeStatusId 필드 추가 (교환 메시지용)
 */
export interface Message {
  messageId: number
  senderId: number
  messageText: string
  sentTime: string
  // 새로운 필드들 (optional for backward compatibility)
  messageType?: MessageType
  relatedBookhouseId?: number
  relatedExchangeStatusId?: number
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
 * 교환 책 상태
 * Backend API: isAccepted field values
 */
export type ExchangeBookStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXCHANGED'

/**
 * 교환 책 정보
 * GET /api/v1/chatrooms/{id}/books 응답의 myBook/partnerBook
 */
export interface ExchangeBookInfo {
  exchangeStatusId: number
  bookhouseId: number
  bookName: string
  bookImage: string
  isAccepted: ExchangeBookStatus
}

/**
 * 교환 책 정보 응답
 * GET /api/v1/chatrooms/{id}/books
 */
export interface ExchangeBooksResponse {
  myBook: ExchangeBookInfo
  partnerBook: ExchangeBookInfo
}

/**
 * Legacy 교환 상태 (기존 API용)
 * @deprecated Use ExchangeBookStatus for new code
 */
export type LegacyExchangeStatus =
  | 'PENDING'
  | 'REQUEST'
  | 'REJECTED'
  | 'ACCEPTED'

/**
 * Legacy 교환 책 정보 (기존 API용)
 * @deprecated Use ExchangeBookInfo for new code
 */
export interface LegacyExchangeBook {
  exchangeStatusId: number | null
  bookhouseId: number | null
  bookName: string | null
  bookImage: string | null
  isAccepted: LegacyExchangeStatus
}

/**
 * Legacy 교환 책 정보 응답 (기존 API용)
 * @deprecated Use ExchangeBooksResponse for new code
 */
export interface LegacyExchangeBooksInfo {
  myBook: LegacyExchangeBook
  partnerBook: LegacyExchangeBook
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

/**
 * 교환 요청 생성 요청
 * POST /api/v1/exchange-requests
 */
export interface CreateExchangeRequestRequest {
  chatroomId: number // API expects lowercase 'r' to match chatroom response
  bookhouseId: number
}

/**
 * Legacy 교환 요청 생성 응답 (기존 API용)
 * @deprecated Use ExchangeRequestResponse from './exchange' for new code
 */
export interface LegacyCreateExchangeRequestResponse {
  exchangeStatusId: number
  requestStatus: LegacyExchangeStatus
}

// ============================================================================
// WebSocket Types
// ============================================================================

/**
 * WebSocket 메시지 송신 페이로드
 *
 * 백엔드 마이그레이션: messageType, relatedBookhouseId, relatedExchangeStatusId 추가
 */
export interface WebSocketSendPayload {
  roomId: number
  message: string
  messageType?: MessageType
  relatedBookhouseId?: number
  relatedExchangeStatusId?: number
}

/**
 * WebSocket 메시지 수신 페이로드
 *
 * 백엔드 마이그레이션: messageType, relatedBookhouseId, relatedExchangeStatusId 추가
 */
export interface WebSocketReceivePayload {
  senderId: number
  message: string
  messageType?: MessageType
  relatedBookhouseId?: number
  relatedExchangeStatusId?: number
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * 채팅룸 상태
 */
export type ChatRoomStatus = 'active' | 'archived' | 'completed'
