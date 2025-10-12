import { api } from '@/lib/api'
import type {
  ChatRoomListItem,
  MessagesResponse,
  PartnerProfile,
  ExchangeBooksInfo,
  CreateChatRoomRequest,
  CreateChatRoomResponse,
} from '@/types/chatroom'

// ============================================================================
// API Service Functions
// ============================================================================

/**
 * 채팅룸 리스트 조회
 * GET /api/v1/chatrooms
 */
export const getChatRoomList = async (): Promise<ChatRoomListItem[]> => {
  const response = await api.get<ChatRoomListItem[]>('/api/v1/chatrooms')
  return response
}

/**
 * 채팅룸 메시지 조회 (Cursor Pagination)
 * GET /api/v1/chatrooms/{chatroomId}/messages
 */
export const getChatRoomMessages = async (
  chatroomId: number,
  params?: {
    limit?: number
    before?: number
  }
): Promise<MessagesResponse> => {
  // Remove undefined values from params
  const cleanParams: Record<string, number> = {}
  if (params?.limit !== undefined) {
    cleanParams.limit = params.limit
  }
  if (params?.before !== undefined) {
    cleanParams.before = params.before
  }

  const response = await api.get<MessagesResponse>(
    `/api/v1/chatrooms/${chatroomId}/messages`,
    Object.keys(cleanParams).length > 0 ? cleanParams : undefined
  )
  return response
}

/**
 * 채팅룸 상대방 정보 조회
 * GET /api/v1/chatrooms/{chatroomId}/partner/profile
 */
export const getPartnerProfile = async (
  chatroomId: number
): Promise<PartnerProfile> => {
  const response = await api.get<PartnerProfile>(
    `/api/v1/chatrooms/${chatroomId}/partner/profile`
  )
  return response
}

/**
 * 채팅룸 교환 책 정보 조회
 * GET /api/v1/chatrooms/{chatroomId}/books
 */
export const getExchangeBooks = async (
  chatroomId: number
): Promise<ExchangeBooksInfo[]> => {
  const response = await api.get<ExchangeBooksInfo[]>(
    `/api/v1/chatrooms/${chatroomId}/books`
  )
  return response
}

/**
 * 채팅으로 책 교환 요청 보내기 (채팅룸 생성)
 * POST /api/v1/chatrooms
 */
export const createChatRoom = async (
  data: CreateChatRoomRequest
): Promise<CreateChatRoomResponse> => {
  const response = await api.post<CreateChatRoomResponse>(
    '/api/v1/chatrooms',
    data
  )
  return response
}

/**
 * 채팅룸 나가기 (삭제)
 * DELETE /api/v1/chatrooms/{chatroomId}
 */
export const deleteChatRoom = async (chatroomId: number): Promise<void> => {
  await api.delete(`/api/v1/chatrooms/${chatroomId}`)
}

/**
 * 대면 교환 완료
 * PATCH /api/v1/chatrooms/{chatroomId}/exchange/complete
 */
export const completeExchange = async (chatroomId: number): Promise<void> => {
  await api.patch(`/api/v1/chatrooms/${chatroomId}/exchange/complete`)
}

/**
 * 대면 반납 완료
 * PATCH /api/v1/chatrooms/{chatroomId}/exchange/return
 */
export const returnExchange = async (chatroomId: number): Promise<void> => {
  await api.patch(`/api/v1/chatrooms/${chatroomId}/exchange/return`)
}
