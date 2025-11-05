/**
 * Exchange Service
 * Handles all exchange-related API calls
 * Backend API Guide: Notion documents (채팅 교환 메시지 카드 기능 구현 가이드)
 */

import { api } from '@/lib/api'
import type {
  ExchangeRequestResponse,
  ExchangeStatusResponse,
  AvailableBooksResponse,
  ExchangeRequest,
} from '@/types/exchange'
import type { CreateExchangeRequestRequest } from '@/types/chatroom'

/**
 * Exchange API endpoints
 */
const EXCHANGE_API = {
  CREATE_REQUEST: '/api/v1/exchange-requests',
  ACCEPT_REQUEST: (exchangeId: number) =>
    `/api/v1/exchange-requests/${exchangeId}/accept`,
  REJECT_REQUEST: (exchangeId: number) =>
    `/api/v1/exchange-requests/${exchangeId}/reject`,
  CANCEL_REQUEST: (exchangeId: number) =>
    `/api/v1/exchange-requests/${exchangeId}/cancel`,
  COMPLETE_EXCHANGE: (exchangeId: number) =>
    `/api/v1/exchange-requests/${exchangeId}/complete`,
  RETURN_EXCHANGE: (exchangeId: number) =>
    `/api/v1/exchange-requests/${exchangeId}/return`,
  GET_AVAILABLE_BOOKS: (chatroomId: number) =>
    `/api/v1/chatrooms/${chatroomId}/books`,
} as const

/**
 * Exchange Service Class
 */
export class ExchangeService {
  /**
   * Create a new exchange request
   * POST /api/v1/exchange-requests
   *
   * @param payload - { chatroomId, bookhouseId }
   *   - chatroomId: The chatroom ID
   *   - bookhouseId: The partner's book ID (not both books)
   */
  static async createRequest(
    payload: CreateExchangeRequestRequest
  ): Promise<ExchangeRequestResponse> {
    return api.post<ExchangeRequestResponse>(
      EXCHANGE_API.CREATE_REQUEST,
      payload
    )
  }

  /**
   * Accept an exchange request
   * PATCH /api/v1/exchange-requests/{exchangeId}/accept
   */
  static async acceptRequest(
    exchangeId: number
  ): Promise<ExchangeStatusResponse> {
    return api.patch<ExchangeStatusResponse>(
      EXCHANGE_API.ACCEPT_REQUEST(exchangeId)
    )
  }

  /**
   * Reject an exchange request
   * PATCH /api/v1/exchange-requests/{exchangeId}/reject
   */
  static async rejectRequest(
    exchangeId: number
  ): Promise<ExchangeStatusResponse> {
    return api.patch<ExchangeStatusResponse>(
      EXCHANGE_API.REJECT_REQUEST(exchangeId)
    )
  }

  /**
   * Cancel an exchange request (requester only)
   * PATCH /api/v1/exchange-requests/{exchangeId}/cancel
   */
  static async cancelRequest(
    exchangeId: number
  ): Promise<ExchangeStatusResponse> {
    return api.patch<ExchangeStatusResponse>(
      EXCHANGE_API.CANCEL_REQUEST(exchangeId)
    )
  }

  /**
   * Complete an exchange (mark as completed)
   * PATCH /api/v1/exchange-requests/{exchangeId}/complete
   */
  static async completeExchange(
    exchangeId: number
  ): Promise<ExchangeStatusResponse> {
    return api.patch<ExchangeStatusResponse>(
      EXCHANGE_API.COMPLETE_EXCHANGE(exchangeId)
    )
  }

  /**
   * Return an exchanged book
   * PATCH /api/v1/exchange-requests/{exchangeId}/return
   */
  static async returnExchange(
    exchangeId: number
  ): Promise<ExchangeStatusResponse> {
    return api.patch<ExchangeStatusResponse>(
      EXCHANGE_API.RETURN_EXCHANGE(exchangeId)
    )
  }

  /**
   * Get available books for exchange in a chatroom
   * GET /api/v1/chatrooms/{chatroomId}/books
   */
  static async getAvailableBooks(
    chatroomId: number
  ): Promise<AvailableBooksResponse> {
    return api.get<AvailableBooksResponse>(
      EXCHANGE_API.GET_AVAILABLE_BOOKS(chatroomId)
    )
  }
}

/**
 * Export individual functions for easier imports
 */
export const {
  createRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeExchange,
  returnExchange,
  getAvailableBooks,
} = ExchangeService
