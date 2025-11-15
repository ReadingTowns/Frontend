/**
 * useChatRoom Hook
 * 채팅룸 관련 기본 기능 (리스트, 메시지, 프로필)
 *
 * 교환 기능 마이그레이션 안내:
 * - Legacy 교환 API: useExchangeBooks, useCompleteExchange, useReturnExchange (deprecated)
 * - 새로운 교환 API: useExchange hook 사용 권장 (@/hooks/useExchange)
 *
 * 백엔드 마이그레이션:
 * - 새로운 교환 시스템은 메시지 타입 기반 (EXCHANGE_REQUEST, EXCHANGE_ACCEPTED, etc.)
 * - 기존 교환 API는 backward compatibility를 위해 유지
 */

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getChatRoomList,
  getChatRoomMessages,
  getPartnerProfile,
  getExchangeBooks,
  createChatRoom,
  createExchangeRequest,
  deleteChatRoom,
  completeExchange,
  returnExchange,
} from '@/services/chatRoomService'
import type { CreateChatRoomResponse } from '@/types/chatroom'

// ============================================================================
// Query Keys
// ============================================================================

export const chatRoomKeys = {
  all: ['chatRooms'] as const,
  lists: () => [...chatRoomKeys.all, 'list'] as const,
  list: () => [...chatRoomKeys.lists()] as const,
  details: () => [...chatRoomKeys.all, 'detail'] as const,
  detail: (id: number) => [...chatRoomKeys.details(), id] as const,
  messages: (id: number) => [...chatRoomKeys.detail(id), 'messages'] as const,
  partner: (id: number) => [...chatRoomKeys.detail(id), 'partner'] as const,
  books: (id: number) => [...chatRoomKeys.detail(id), 'books'] as const,
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * 채팅룸 리스트 조회
 * 3초마다 자동 갱신 (폴링)
 */
export const useChatRoomList = () => {
  console.log(
    '🔍 [useChatRoomList] Hook called, queryKey:',
    chatRoomKeys.list()
  )

  return useQuery({
    queryKey: chatRoomKeys.list(),
    queryFn: async () => {
      console.log('🔍 [useChatRoomList] queryFn executing - API fetch starting')
      const result = await getChatRoomList()
      console.log(
        '🔍 [useChatRoomList] queryFn completed - API fetch result:',
        {
          count: result.length,
          timestamp: new Date().toISOString(),
        }
      )
      return result
    },
    staleTime: 0, // 캐시 없음 - 항상 최신 데이터
    refetchInterval: 3000, // 3초마다 자동 refetch
  })
}

/**
 * 채팅룸 메시지 조회 (무한 스크롤)
 * - Cursor pagination
 * - 오래된 순 → 최신순 정렬
 */
export const useChatRoomMessages = (chatroomId: number, limit = 50) => {
  return useInfiniteQuery({
    queryKey: chatRoomKeys.messages(chatroomId),
    queryFn: ({ pageParam }) =>
      getChatRoomMessages(chatroomId, {
        limit,
        before: pageParam,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: lastPage => {
      if (lastPage.paging.hasMore) {
        return lastPage.paging.nextCursor
      }
      return undefined
    },
    staleTime: 0, // 캐시 없음 - 항상 최신 데이터 (채팅방 진입 시 새 메시지 즉시 표시)
  })
}

/**
 * 채팅룸 상대방 정보 조회
 */
export const usePartnerProfile = (chatroomId: number) => {
  return useQuery({
    queryKey: chatRoomKeys.partner(chatroomId),
    queryFn: () => getPartnerProfile(chatroomId),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  })
}

/**
 * 채팅룸 교환 책 정보 조회 (Legacy)
 * @deprecated Use useExchange hook from '@/hooks/useExchange' for new exchange system
 */
export const useExchangeBooks = (chatroomId: number) => {
  return useQuery({
    queryKey: chatRoomKeys.books(chatroomId),
    queryFn: () => getExchangeBooks(chatroomId),
    staleTime: 1000 * 60, // 1분간 캐시 유지
  })
}

/**
 * 채팅룸 생성 + 교환 요청
 * 1. 채팅룸 생성 (/api/v1/chatrooms)
 * 2. 교환 요청 생성 (/api/v1/exchange-requests)
 */
export const useCreateChatRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      memberId: number
      bookId: number
      bookhouseId: number
    }): Promise<CreateChatRoomResponse> => {
      // 1단계: 채팅룸 생성 (bookhouseId 제외)
      const chatroomResponse = await createChatRoom({
        memberId: data.memberId,
        bookId: data.bookId,
      })

      // 2단계: 교환 요청 생성
      // 서재 API는 bookhouseId를 포함하여 반환
      // 교환 요청 API는 bookhouseId를 필요로 함
      try {
        await createExchangeRequest({
          chatroomId: chatroomResponse.chatroomId,
          bookhouseId: data.bookhouseId, // bookhouseId 사용
        })
      } catch (error) {
        console.error('Failed to create exchange request:', error)

        // ✅ FIX: 교환 요청 실패 시 생성된 채팅방 삭제 (롤백)
        try {
          await deleteChatRoom(chatroomResponse.chatroomId)
          console.log('Chatroom rolled back successfully')
        } catch (rollbackError) {
          console.error('Failed to rollback chatroom:', rollbackError)
          // 롤백 실패 시에도 원래 에러를 전파
        }

        throw new Error('교환 요청 생성에 실패했습니다. 다시 시도해주세요.')
      }

      return chatroomResponse
    },
    onSuccess: () => {
      // 채팅룸 리스트 갱신
      queryClient.invalidateQueries({ queryKey: chatRoomKeys.list() })
    },
  })
}

/**
 * 채팅룸 나가기 (삭제)
 */
export const useDeleteChatRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chatroomId: number) => deleteChatRoom(chatroomId),
    onSuccess: (_, chatroomId) => {
      // 채팅룸 리스트 갱신
      queryClient.invalidateQueries({ queryKey: chatRoomKeys.list() })
      // 해당 채팅룸 상세 캐시 제거
      queryClient.removeQueries({ queryKey: chatRoomKeys.detail(chatroomId) })
    },
  })
}

/**
 * 대면 교환 완료 (Legacy)
 * @deprecated Use useCompleteExchange hook from '@/hooks/useExchange' for new exchange system
 */
export const useCompleteExchange = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chatroomId: number) => completeExchange(chatroomId),
    onSuccess: (_, chatroomId) => {
      // 교환 책 정보 갱신
      queryClient.invalidateQueries({
        queryKey: chatRoomKeys.books(chatroomId),
      })
      // 채팅룸 리스트 갱신
      queryClient.invalidateQueries({ queryKey: chatRoomKeys.list() })
    },
  })
}

/**
 * 대면 반납 완료 (Legacy)
 * @deprecated Use useReturnExchange hook from '@/hooks/useExchange' for new exchange system
 */
export const useReturnExchange = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chatroomId: number) => returnExchange(chatroomId),
    onSuccess: (_, chatroomId) => {
      // 교환 책 정보 갱신
      queryClient.invalidateQueries({
        queryKey: chatRoomKeys.books(chatroomId),
      })
      // 채팅룸 리스트 갱신
      queryClient.invalidateQueries({ queryKey: chatRoomKeys.list() })
    },
  })
}
