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
  const isConnecting = useRef(false)
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
      console.log('📨 Handling received message:', message)

      // 커스텀 핸들러 실행 (ref를 통해 최신 버전 호출)
      onMessageReceivedRef.current?.(message)

      // TanStack Query 캐시 업데이트 (Optimistic UI)
      queryClient.setQueryData<{
        pages: MessagesResponse[]
        pageParams: (number | undefined)[]
      }>(chatRoomKeys.messages(chatroomId), oldData => {
        if (!oldData) return oldData

        // ✅ FIX: 음수 타임스탬프로 고유 ID 보장 (React Key 중복 방지)
        // 음수를 사용하여 백엔드 ID(양수)와 구분, Date.now()로 고유성 보장
        const newMessage: Message = {
          messageId: message.messageId || -Date.now(),
          senderId: message.senderId,
          messageText: message.content,
          sentTime: message.sentTime || new Date().toISOString(),
        }

        // 마지막 페이지에 메시지 추가
        const lastPageIndex = oldData.pages.length - 1
        const updatedPages = [...oldData.pages]
        updatedPages[lastPageIndex] = {
          ...updatedPages[lastPageIndex],
          message: [...updatedPages[lastPageIndex].message, newMessage],
        }

        return {
          ...oldData,
          pages: updatedPages,
        }
      })
    },
    [chatroomId, queryClient] // ✅ FIX: 의존성 최소화 (onMessageReceived 제거)
  )

  /**
   * WebSocket 연결
   */
  useEffect(() => {
    let cleanupMessage: (() => void) | undefined
    let cleanupError: (() => void) | undefined
    let cleanupConnect: (() => void) | undefined
    let cleanupDisconnect: (() => void) | undefined

    const connectWebSocket = async () => {
      if (isConnecting.current) {
        console.log('⏳ Already connecting...')
        return
      }
      isConnecting.current = true

      try {
        if (!websocketService.isConnected()) {
          await websocketService.connect()
        }

        setIsConnected(true)

        // 메시지 수신 핸들러 등록
        cleanupMessage = websocketService.onMessage(handleMessageReceived)

        // 에러 핸들러 등록 (ref를 통해 최신 버전 호출)
        cleanupError = websocketService.onError(error => {
          console.error('WebSocket error:', error)
          onErrorRef.current?.(error)
        })

        // 연결 핸들러 등록 (ref를 통해 최신 버전 호출)
        cleanupConnect = websocketService.onConnect(() => {
          console.log('✅ Connected')
          setIsConnected(true)
          onConnectRef.current?.()
        })

        // 연결 해제 핸들러 등록 (ref를 통해 최신 버전 호출)
        cleanupDisconnect = websocketService.onDisconnect(() => {
          console.log('🔌 Disconnected')
          setIsConnected(false)
          onDisconnectRef.current?.()
        })
      } catch (error) {
        console.error('Failed to connect WebSocket:', error)
        setIsConnected(false)
      } finally {
        isConnecting.current = false
      }
    }

    connectWebSocket()

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up WebSocket hook')
      cleanupMessage?.()
      cleanupError?.()
      cleanupConnect?.()
      cleanupDisconnect?.()
    }
  }, [chatroomId, handleMessageReceived]) // ✅ FIX: 의존성 최소화 (ref 사용으로 콜백 제거)

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
