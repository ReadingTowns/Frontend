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

  /**
   * 수신된 메시지를 TanStack Query 캐시에 추가
   */
  const handleMessageReceived = useCallback(
    (message: ChatMessage) => {
      console.log('📨 Handling received message:', message)

      // 커스텀 핸들러 실행
      onMessageReceived?.(message)

      // TanStack Query 캐시 업데이트 (Optimistic UI)
      queryClient.setQueryData<{
        pages: MessagesResponse[]
        pageParams: (number | undefined)[]
      }>(chatRoomKeys.messages(chatroomId), oldData => {
        if (!oldData) return oldData

        const newMessage: Message = {
          messageId: Date.now(), // 임시 ID
          senderId: message.senderId,
          messageText: message.message,
          sentTime: new Date().toISOString(),
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
    [chatroomId, onMessageReceived, queryClient]
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

        // 에러 핸들러 등록
        if (onError) {
          cleanupError = websocketService.onError(error => {
            console.error('WebSocket error:', error)
            onError(error)
          })
        }

        // 연결 핸들러 등록
        if (onConnect) {
          cleanupConnect = websocketService.onConnect(() => {
            console.log('✅ Connected')
            setIsConnected(true)
            onConnect()
          })
        }

        // 연결 해제 핸들러 등록
        if (onDisconnect) {
          cleanupDisconnect = websocketService.onDisconnect(() => {
            console.log('🔌 Disconnected')
            setIsConnected(false)
            onDisconnect()
          })
        }
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
  }, [chatroomId, handleMessageReceived, onError, onConnect, onDisconnect])

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
