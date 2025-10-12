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
 */
export const useChatRoomList = () => {
  return useQuery({
    queryKey: chatRoomKeys.list(),
    queryFn: getChatRoomList,
    staleTime: 0, // 캐시 없음 - 항상 최신 데이터
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
    staleTime: 1000 * 60, // 1분간 캐시 유지
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
 * 채팅룸 교환 책 정보 조회
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
        // 교환 요청 실패해도 채팅룸 ID는 반환 (채팅방은 생성됨)
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
 * 대면 교환 완료
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
 * 대면 반납 완료
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
