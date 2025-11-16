import { useEffect, useCallback, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { websocketService, type ChatMessage } from '@/services/websocketService'
import { chatRoomKeys } from './useChatRoom'
import type { Message, MessagesResponse } from '@/types/chatroom'

interface UseWebSocketOptions {
  chatroomId: number
  onMessageReceived?: (message: ChatMessage) => void
  onError?: (error: Event) => void
  onConnect?: () => void
  onDisconnect?: () => void
}

export const useWebSocket = ({
  chatroomId,
  onMessageReceived,
  onError,
  onConnect,
  onDisconnect,
}: UseWebSocketOptions) => {
  const queryClient = useQueryClient()
  const [isConnected, setIsConnected] = useState(false)

  // ✅ FIX: useRef로 안정적인 콜백 참조 유지 (의존성 체인 끊기)
  const onMessageReceivedRef = useRef(onMessageReceived)
  const onErrorRef = useRef(onError)
  const onConnectRef = useRef(onConnect)
  const onDisconnectRef = useRef(onDisconnect)

  // 최신 콜백으로 ref 업데이트
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived
    onErrorRef.current = onError
    onConnectRef.current = onConnect
    onDisconnectRef.current = onDisconnect
  }, [onMessageReceived, onError, onConnect, onDisconnect])

  /**
   * 수신된 메시지를 TanStack Query 캐시에 추가
   */
  const handleMessageReceived = useCallback(
    (message: ChatMessage) => {
      console.log('🟢 [DEBUG] handleMessageReceived called')
      console.log('🟢 [DEBUG] Message:', message)
      console.log('🟢 [DEBUG] chatroomId:', chatroomId)
      console.log('📨 Handling received message:', message)

      // 커스텀 핸들러 실행 (ref를 통해 최신 버전 호출)
      onMessageReceivedRef.current?.(message)

      console.log('🟢 [DEBUG] Before setQueryData')
      // TanStack Query 캐시 업데이트 (Optimistic UI)
      queryClient.setQueryData<{
        pages: MessagesResponse[]
        pageParams: (number | undefined)[]
      }>(chatRoomKeys.messages(chatroomId), oldData => {
        console.log('🟢 [DEBUG] Inside setQueryData updater')
        console.log('🟢 [DEBUG] oldData:', oldData)
        if (!oldData) {
          console.log('⚠️ [DEBUG] No oldData, returning')
          return oldData
        }

        // ✅ FIX: 음수 타임스탬프로 고유 ID 보장 (React Key 중복 방지)
        // 음수를 사용하여 백엔드 ID(양수)와 구분, Date.now()로 고유성 보장
        const newMessage: Message = {
          messageId: message.messageId || -Date.now(),
          senderId: message.senderId,
          messageText: message.content,
          sentTime: message.sentTime || new Date().toISOString(),
          messageType: message.messageType,
          relatedBookhouseId: message.relatedBookhouseId,
          relatedExchangeStatusId: message.relatedExchangeStatusId,
        }

        console.log('🟢 [DEBUG] Created newMessage:', newMessage)

        // 마지막 페이지에 메시지 추가
        const lastPageIndex = oldData.pages.length - 1
        const updatedPages = [...oldData.pages]
        updatedPages[lastPageIndex] = {
          ...updatedPages[lastPageIndex],
          message: [...updatedPages[lastPageIndex].message, newMessage],
        }

        console.log(
          '🟢 [DEBUG] Updated pages, message count:',
          updatedPages[lastPageIndex].message.length
        )
        console.log('🟢 [DEBUG] Returning updated data')
        return {
          ...oldData,
          pages: updatedPages,
        }
      })

      console.log('🟢 [DEBUG] Before invalidateQueries')
      // ✅ FIX: 캐시 무효화로 리렌더링 트리거
      queryClient.invalidateQueries({
        queryKey: chatRoomKeys.messages(chatroomId),
      })
      console.log('🟢 [DEBUG] After invalidateQueries')

      // ✨ NEW: 교환 상태 변경 메시지면 /books 캐시 무효화
      const exchangeStatusTypes = [
        'EXCHANGE_REQUEST',
        'EXCHANGE_ACCEPTED',
        'EXCHANGE_REJECTED',
        'EXCHANGE_CANCELED',
        'EXCHANGE_RESERVED',
        'EXCHANGE_COMPLETED',
        'EXCHANGE_RETURNED',
      ]

      if (
        message.messageType &&
        exchangeStatusTypes.includes(message.messageType)
      ) {
        console.log(
          '🔄 Invalidating exchange books cache due to status change:',
          message.messageType
        )
        queryClient.invalidateQueries({
          queryKey: chatRoomKeys.books(chatroomId),
        })
      }
    },
    [chatroomId, queryClient] // ✅ FIX: 의존성 최소화 (onMessageReceived 제거)
  )

  /**
   * WebSocket 연결 - Pure Effect 패턴
   * ✅ React Strict Mode 안전
   * ✅ 구독과 연결의 분리
   * ✅ 멱등적 연결
   */
  useEffect(() => {
    console.log(`🔌 [PURE EFFECT] Mounting for room ${chatroomId}`)

    // 1️⃣ 순수 구독 (동기적, roomHandlers에만 등록)
    const subscription = websocketService.subscribe(
      chatroomId,
      handleMessageReceived
    )

    // 2️⃣ 에러/연결 핸들러 등록
    const cleanupError = websocketService.onError(error => {
      console.error('WebSocket error:', error)
      onErrorRef.current?.(error)
    })

    const cleanupConnect = websocketService.onConnect(() => {
      console.log('✅ [PURE EFFECT] Connected')
      setIsConnected(true)
      onConnectRef.current?.()
    })

    const cleanupDisconnect = websocketService.onDisconnect(() => {
      console.log('🔌 [PURE EFFECT] Disconnected')
      setIsConnected(false)
      onDisconnectRef.current?.()
    })

    // 3️⃣ 멱등적 연결 보장 (비동기)
    websocketService
      .ensureConnected(chatroomId)
      .then(() => {
        console.log('✅ [PURE EFFECT] ensureConnected completed')
        setIsConnected(websocketService.isConnected())
      })
      .catch(error => {
        console.error('❌ [PURE EFFECT] ensureConnected failed:', error)
        setIsConnected(false)
      })

    // 4️⃣ Pure cleanup (해당 구독만 제거)
    return () => {
      console.log(`🧹 [PURE EFFECT] Cleanup for room ${chatroomId}`)
      subscription.unsubscribe()
      cleanupError()
      cleanupConnect()
      cleanupDisconnect()
      websocketService.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId]) // ✅ handleMessageReceived는 의존성에서 제외 (useRef 사용)

  /**
   * 메시지 전송
   */
  const sendMessage = useCallback(
    (message: string) => {
      if (!message.trim()) {
        console.warn('⚠️ Cannot send empty message')
        return
      }

      try {
        websocketService.sendMessage(chatroomId, message.trim())
        console.log('✅ Message sent successfully')
      } catch (error) {
        console.error('Failed to send message:', error)
        throw error
      }
    },
    [chatroomId]
  )

  return {
    sendMessage,
    isConnected,
  }
}
