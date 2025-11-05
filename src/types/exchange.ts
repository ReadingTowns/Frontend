/**
 * Exchange-related type definitions for chat exchange feature
 */

/**
 * Message types supported by the chat system
 * Backend API: messageType field values
 */
export enum MessageType {
  TEXT = 'TEXT',
  EXCHANGE_REQUEST = 'EXCHANGE_REQUEST',
  EXCHANGE_ACCEPTED = 'EXCHANGE_ACCEPTED',
  EXCHANGE_REJECTED = 'EXCHANGE_REJECTED',
  EXCHANGE_RESERVED = 'EXCHANGE_RESERVED',
  EXCHANGE_COMPLETED = 'EXCHANGE_COMPLETED',
  EXCHANGE_RETURNED = 'EXCHANGE_RETURNED',
  SYSTEM = 'SYSTEM',
}

/**
 * Exchange status values
 */
export enum ExchangeStatus {
  PENDING = 'PENDING', // 대기 중
  ACCEPTED = 'ACCEPTED', // 양쪽 수락
  RESERVED = 'RESERVED', // 예약됨
  COMPLETED = 'COMPLETED', // 완료됨
  RETURNED = 'RETURNED', // 반납됨
  REJECTED = 'REJECTED', // 거절됨
  CANCELLED = 'CANCELLED', // 취소됨
}

/**
 * Book information in exchange context
 */
export interface ExchangeBook {
  bookhouseId: number
  title: string
  author: string
  coverImage: string | null
  isbn: string | null
}

/**
 * Exchange request data structure
 * POST /api/v1/exchange-requests
 */
export interface ExchangeRequest {
  exchangeId: number
  requesterId: number
  requesterNickname: string
  recipientId: number
  recipientNickname: string
  requesterBook: ExchangeBook
  recipientBook: ExchangeBook
  status: ExchangeStatus
  requestedAt: string
  expiresAt: string | null
}

/**
 * Exchange request creation payload
 * @deprecated Use CreateExchangeRequestRequest from './chatroom' instead
 * This type was based on incorrect API specification
 */
export interface CreateExchangeRequestPayload {
  chatroomId: number
  requesterBookhouseId: number
  recipientBookhouseId: number
}

/**
 * Exchange request creation response
 * POST /api/v1/exchange-requests
 */
export interface ExchangeRequestResponse {
  exchangeStatusId: number
  requestStatus: 'REQUEST' | 'ACCEPT' | 'COMPLETE' | 'RETURN'
}

/**
 * Exchange status update response
 */
export interface ExchangeStatusResponse {
  exchangeId: number
  status: ExchangeStatus
  updatedAt: string
}

/**
 * Available books for exchange in a chatroom
 */
export interface AvailableBooksResponse {
  myBooks: ExchangeBook[]
  partnerBooks: ExchangeBook[]
}

/**
 * Book search result from bookhouse search API
 * GET /api/v1/bookhouse/books/search
 */
export interface BookSearchResult {
  bookId: number
  bookImage: string
  bookName: string
  author: string
}

/**
 * User who owns a specific book in their bookhouse
 * GET /api/v1/bookhouse/books/{bookId}
 */
export interface BookhouseOwner {
  bookhouseId: number
  memberId: number
  memberName: string
  profileImage: string | null
  isFollowing: boolean
  starRating: number
}
