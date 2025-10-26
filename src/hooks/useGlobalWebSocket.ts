import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { websocketService } from '@/services/websocketService'
import { chatRoomKeys } from './useChatRoom'

/**
 * 글로벌 WebSocket 연결 및 이벤트 리스닝 훅
 *
 * 용도:
 * - 채팅방 리스트 화면에서 모든 채팅방의 새 메시지 감지
 * - 새 메시지 수신 시 자동으로 채팅방 리스트 갱신
 *
 * 사용 예시:
 * ```typescript
 * function ChatList() {
 *   useGlobalWebSocket() // 글로벌 WebSocket 연결
 *   const { data: chatRooms } = useChatRoomList()
 *   // ...
 * }
 * ```
 *
 * 동작 방식:
 * 1. WebSocket 연결 (이미 연결되어 있으면 재사용)
 * 2. 메시지 수신 이벤트 리스너 등록
 * 3. 새 메시지 수신 시 채팅방 리스트 캐시 무효화 → 자동 refetch
 *
 * 주의사항:
 * - 컴포넌트 언마운트 시에도 WebSocket은 유지됨 (싱글톤)
 * - 다른 컴포넌트에서도 동일한 WebSocket 인스턴스 공유
 */
export const useGlobalWebSocket = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    console.log('🚀 [Global] useGlobalWebSocket hook mounted')

    let messageCleanup: (() => void) | undefined
    let errorCleanup: (() => void) | undefined
    let connectCleanup: (() => void) | undefined
    let disconnectCleanup: (() => void) | undefined

    const initWebSocket = async () => {
      console.log('🔧 [Global] Initializing WebSocket...')
      try {
        // WebSocket이 이미 연결되어 있지 않으면 연결
        if (!websocketService.isConnected()) {
          console.log(
            '🔌 [Global] Connecting to WebSocket for chat list updates'
          )
          await websocketService.connect()
        } else {
          console.log(
            '✅ [Global] WebSocket already connected, reusing connection'
          )
        }

        // 메시지 수신 핸들러: 어떤 채팅방의 메시지든 받으면 리스트 갱신
        messageCleanup = websocketService.onMessage(message => {
          console.log(
            '📨 [Global] New message received, refreshing chat list:',
            message
          )

          // 채팅방 리스트 캐시 무효화 → useQuery가 자동으로 refetch
          queryClient.invalidateQueries({
            queryKey: chatRoomKeys.list(),
          })
        })

        // 에러 핸들러
        errorCleanup = websocketService.onError(error => {
          console.error('❌ [Global] WebSocket error:', error)
        })

        // 연결 핸들러
        connectCleanup = websocketService.onConnect(() => {
          console.log('✅ [Global] WebSocket connected')
        })

        // 연결 해제 핸들러
        disconnectCleanup = websocketService.onDisconnect(() => {
          console.log('🔌 [Global] WebSocket disconnected')
        })

        console.log('✅ [Global] Global WebSocket listeners registered')
      } catch (error) {
        console.error(
          '❌ [Global] Failed to initialize global WebSocket:',
          error
        )
      }
    }

    initWebSocket()

    // Cleanup: 이벤트 리스너만 제거 (WebSocket 연결은 유지)
    return () => {
      console.log('🧹 [Global] Cleaning up global WebSocket listeners')
      messageCleanup?.()
      errorCleanup?.()
      connectCleanup?.()
      disconnectCleanup?.()
    }
  }, [queryClient])
}
