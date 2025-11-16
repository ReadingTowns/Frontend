/**
 * useExchange Hook
 * 교환 관련 비즈니스 로직 및 상태 관리
 * TanStack Query를 사용한 서버 상태 관리
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeExchange,
  getAvailableBooks,
} from '@/services/exchangeService'
import { returnExchange } from '@/services/chatRoomService'
import type { CreateExchangeRequestRequest } from '@/types/chatroom'
import { chatRoomKeys } from './useChatRoom'

/**
 * Query Keys (internal use only)
 */
const exchangeKeys = {
  all: ['exchange'] as const,
  availableBooks: (chatroomId: number) =>
    [...exchangeKeys.all, 'books', chatroomId] as const,
}

/**
 * useAvailableBooks Hook
 * 교환 가능한 책 목록 조회
 */
export function useAvailableBooks(chatroomId: number) {
  return useQuery({
    queryKey: exchangeKeys.availableBooks(chatroomId),
    queryFn: () => getAvailableBooks(chatroomId),
    staleTime: 60000, // 1분
    gcTime: 300000, // 5분
  })
}

/**
 * useCreateExchangeRequest Hook
 * 교환 요청 생성
 *
 * @param chatroomId - The chatroom ID
 * @returns Mutation function that accepts { chatroomId, bookhouseId }
 *   - bookhouseId: The partner's book ID to request for exchange
 */
export function useCreateExchangeRequest(chatroomId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateExchangeRequestRequest) =>
      createRequest(payload),
    onSuccess: () => {
      // 교환 가능한 책 목록 갱신
      queryClient.invalidateQueries({
        queryKey: exchangeKeys.availableBooks(chatroomId),
      })
    },
  })
}

/**
 * useAcceptExchange Hook
 * 교환 요청 수락
 */
export function useAcceptExchange(chatroomId?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (exchangeId: number) => acceptRequest(exchangeId),
    onSuccess: () => {
      if (chatroomId) {
        // 교환 책 정보 갱신
        queryClient.invalidateQueries({
          queryKey: chatRoomKeys.books(chatroomId),
        })
        // 메시지 목록 갱신 (새 시스템 메시지 표시)
        queryClient.invalidateQueries({
          queryKey: chatRoomKeys.messages(chatroomId),
        })
      }
    },
  })
}

/**
 * useRejectExchange Hook
 * 교환 요청 거절
 */
export function useRejectExchange(chatroomId?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (exchangeId: number) => rejectRequest(exchangeId),
    onSuccess: () => {
      if (chatroomId) {
        queryClient.invalidateQueries({
          queryKey: chatRoomKeys.books(chatroomId),
        })
        queryClient.invalidateQueries({
          queryKey: chatRoomKeys.messages(chatroomId),
        })
      }
    },
  })
}

/**
 * useCancelExchange Hook
 * 교환 요청 취소 (요청자만)
 */
export function useCancelExchange(chatroomId?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (exchangeId: number) => cancelRequest(exchangeId),
    onSuccess: () => {
      if (chatroomId) {
        queryClient.invalidateQueries({
          queryKey: chatRoomKeys.books(chatroomId),
        })
        queryClient.invalidateQueries({
          queryKey: chatRoomKeys.messages(chatroomId),
        })
      }
    },
  })
}

/**
 * useCompleteExchange Hook
 * 교환 완료 처리
 */
export function useCompleteExchange(chatroomId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => completeExchange(chatroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatRoomKeys.books(chatroomId),
      })
      queryClient.invalidateQueries({
        queryKey: chatRoomKeys.messages(chatroomId),
      })
      // 채팅방 리스트도 갱신 (교환 완료 상태 반영)
      queryClient.invalidateQueries({
        queryKey: chatRoomKeys.list(),
      })
    },
  })
}

/**
 * useReturnExchange Hook
 * 교환 책 반납
 */
export function useReturnExchange(chatroomId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => returnExchange(chatroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatRoomKeys.books(chatroomId),
      })
      queryClient.invalidateQueries({
        queryKey: chatRoomKeys.messages(chatroomId),
      })
      // 채팅방 리스트도 갱신 (반납 완료 상태 반영)
      queryClient.invalidateQueries({
        queryKey: chatRoomKeys.list(),
      })
    },
  })
}
