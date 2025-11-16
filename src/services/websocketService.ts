/**
 * WebSocket 실시간 채팅 서비스
 * 백엔드 WebSocket 엔드포인트: NEXT_PUBLIC_WS_URL
 *
 * Breaking Changes (백엔드 마이그레이션):
 * - messageType 필드 추가 (TEXT, EXCHANGE_REQUEST, etc.)
 * - relatedBookhouseId, relatedExchangeStatusId 필드 추가
 *
 * 사용 예시:
 * ```typescript
 * const ws = new WebSocketService()
 * await ws.connect()
 * ws.sendMessage(123, 'Hello!')
 * ws.sendMessage(123, 'Exchange request', {
 *   messageType: MessageType.EXCHANGE_REQUEST,
 *   relatedBookhouseId: 456,
 *   relatedExchangeStatusId: 789
 * })
 * ```
 */

import { MessageType } from '@/types/exchange'

export interface ChatMessage {
  messageId?: number
  chatroomId?: number
  senderId: number
  content: string
  messageType?: MessageType
  relatedBookhouseId?: number | null
  relatedExchangeStatusId?: number | null
  sentTime?: string
}

export interface SendMessagePayload {
  chatroomId: number
  content: string
  messageType?: MessageType
  relatedBookhouseId?: number
  relatedExchangeStatusId?: number
}

export interface SendMessageOptions {
  messageType?: MessageType
  relatedBookhouseId?: number
  relatedExchangeStatusId?: number
}

type MessageHandler = (message: ChatMessage) => void
type ErrorHandler = (error: Event) => void
type ConnectionHandler = () => void

export class WebSocketService {
  private socket: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private messageHandlers: Set<MessageHandler> = new Set()
  private errorHandlers: Set<ErrorHandler> = new Set()
  private connectHandlers: Set<ConnectionHandler> = new Set()
  private disconnectHandlers: Set<ConnectionHandler> = new Set()
  private currentRoomId!: number // 재연결을 위한 roomId 저장

  // ✅ FIX: 채팅방별 핸들러 관리
  private roomHandlers = new Map<number, Set<MessageHandler>>()

  // Heartbeat mechanism to keep connection alive
  private heartbeatInterval: NodeJS.Timeout | null = null
  private heartbeatIntervalMs = 25000 // 25초마다 ping (서버 30초 timeout보다 짧게 설정)

  /**
   * WebSocket 연결
   * @param roomId 채팅방 ID (필수)
   */
  connect(roomId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL

        if (!wsUrl) {
          throw new Error('NEXT_PUBLIC_WS_URL environment variable is not set')
        }

        // roomId를 쿼리 파라미터로 추가
        const urlWithRoomId = `${wsUrl}?roomId=${roomId}`
        this.currentRoomId = roomId // 재연결을 위해 저장

        console.log('🔌 Connecting to WebSocket:', urlWithRoomId)
        this.socket = new WebSocket(urlWithRoomId)

        this.socket.onopen = () => {
          console.log('✅ WebSocket connected')
          console.log('🔵 [DEBUG] Socket readyState:', this.socket?.readyState)
          console.log('🔵 [DEBUG] Socket URL:', this.socket?.url)
          console.log(
            '🔵 [DEBUG] Message handlers count:',
            this.messageHandlers.size
          )
          this.reconnectAttempts = 0
          this.startHeartbeat() // Start heartbeat to keep connection alive
          this.connectHandlers.forEach(handler => handler())
          resolve()
        }

        this.socket.onmessage = event => {
          console.log('🔵 [DEBUG] onmessage event fired:', event)
          console.log('🔵 [DEBUG] Raw event.data:', event.data)
          try {
            const data: ChatMessage = JSON.parse(event.data)
            console.log('✅ [DEBUG] Successfully parsed message:', data)
            console.log('📨 Message received:', data)
            console.log(
              '🔵 [DEBUG] Calling handlers, count:',
              this.messageHandlers.size
            )
            this.messageHandlers.forEach(handler => handler(data))
          } catch (error) {
            console.error(
              '❌ [DEBUG] Failed to parse WebSocket message:',
              error
            )
            console.error('❌ [DEBUG] Raw data was:', event.data)
          }
        }

        this.socket.onerror = event => {
          console.error('❌ WebSocket error:', event)
          this.errorHandlers.forEach(handler => handler(event))
          reject(event)
        }

        this.socket.onclose = event => {
          console.log(
            '🔌 WebSocket disconnected:',
            event.code,
            event.reason || 'No reason provided'
          )

          // 상세 에러 코드 설명
          if (event.code === 1006) {
            console.error(
              '❌ Connection failed (1006): Possible causes:\n' +
                '  1. CORS policy violation\n' +
                '  2. Server not responding\n' +
                '  3. Network/firewall blocking\n' +
                '  4. Authentication failure'
            )
          }

          this.stopHeartbeat() // Stop heartbeat when connection closes
          this.disconnectHandlers.forEach(handler => handler())
          this.handleReconnect()
        }
      } catch (error) {
        console.error('Failed to create WebSocket:', error)
        reject(error)
      }
    })
  }

  /**
   * 채팅방 전환 (재연결 + 핸들러 재등록)
   * ✅ FIX: 새 채팅방 핸들러를 보존하면서 안전하게 전환
   * @param newRoomId 새 채팅방 ID
   */
  async switchRoom(newRoomId: number): Promise<void> {
    if (this.currentRoomId === newRoomId && this.isConnected()) {
      console.log(`⏭️ Already in room ${newRoomId}, skipping reconnection`)
      return
    }

    console.log(
      `🔄 [DEBUG] Switching room: ${this.currentRoomId} → ${newRoomId}`
    )

    // ✅ FIX: 기존 연결만 정리 (새 room의 핸들러는 보존)
    if (this.socket) {
      console.log(`🔌 [DEBUG] Disconnecting from room ${this.currentRoomId}`)

      // WebSocket만 닫고 핸들러는 보존
      this.stopHeartbeat()
      this.socket.close()
      this.socket = null

      // ✅ active handlers만 정리 (roomHandlers는 유지)
      this.messageHandlers.clear()
      this.errorHandlers.clear()
      this.connectHandlers.clear()
      this.disconnectHandlers.clear()

      // 완전한 연결 해제를 위한 짧은 대기
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 새 채팅방 연결
    this.currentRoomId = newRoomId
    console.log(`🔌 [DEBUG] Connecting to room ${newRoomId}`)
    await this.connect(newRoomId)

    // ✅ 새 채팅방의 핸들러 재등록
    const roomHandlers = this.roomHandlers.get(newRoomId)
    if (roomHandlers && roomHandlers.size > 0) {
      console.log(
        `✅ [DEBUG] Re-registering ${roomHandlers.size} handlers for room ${newRoomId}`
      )
      roomHandlers.forEach(handler => this.messageHandlers.add(handler))
    } else {
      console.log(`⚠️ [DEBUG] No handlers found for room ${newRoomId}`)
    }
  }

  /**
   * 현재 채팅방 ID 반환
   */
  getCurrentRoomId(): number | null {
    return this.currentRoomId
  }

  /**
   * 메시지 전송
   *
   * @param chatroomId 채팅방 ID
   * @param message 메시지 내용
   * @param options 추가 옵션 (messageType, relatedBookhouseId, relatedExchangeStatusId)
   *
   * @example
   * // 일반 텍스트 메시지
   * ws.sendMessage(123, 'Hello!')
   *
   * // 교환 요청 메시지
   * ws.sendMessage(123, 'Exchange request message', {
   *   messageType: MessageType.EXCHANGE_REQUEST,
   *   relatedBookhouseId: 456,
   *   relatedExchangeStatusId: 789
   * })
   */
  sendMessage(
    chatroomId: number,
    message: string,
    options?: SendMessageOptions
  ): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected')
    }

    const payload: SendMessagePayload = {
      chatroomId,
      content: message,
      ...(options?.messageType && { messageType: options.messageType }),
      ...(options?.relatedBookhouseId && {
        relatedBookhouseId: options.relatedBookhouseId,
      }),
      ...(options?.relatedExchangeStatusId && {
        relatedExchangeStatusId: options.relatedExchangeStatusId,
      }),
    }

    console.log('📤 Sending message:', payload)
    this.socket.send(JSON.stringify(payload))
  }

  /**
   * 메시지 수신 핸들러 등록 (채팅방별)
   * @deprecated Use subscribe() for Pure Effect pattern
   * @param roomId 채팅방 ID
   * @param handler 메시지 핸들러
   * @returns cleanup 함수
   */
  onMessage(roomId: number, handler: MessageHandler): () => void {
    console.log(`🟢 [DEBUG] Registering handler for room ${roomId}`)

    // 채팅방별 핸들러 저장
    if (!this.roomHandlers.has(roomId)) {
      this.roomHandlers.set(roomId, new Set())
    }
    this.roomHandlers.get(roomId)!.add(handler)

    // 현재 활성 채팅방이면 즉시 등록
    if (roomId === this.currentRoomId) {
      this.messageHandlers.add(handler)
      console.log(`✅ [DEBUG] Handler immediately registered (current room)`)
    }

    // cleanup 함수
    return () => {
      console.log(`🧹 [DEBUG] Cleaning up handler for room ${roomId}`)
      const handlers = this.roomHandlers.get(roomId)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) {
          this.roomHandlers.delete(roomId)
          console.log(`🗑️ [DEBUG] All handlers removed for room ${roomId}`)
        }
      }
      this.messageHandlers.delete(handler)
    }
  }

  /**
   * Pure Effect 패턴: 순수 구독 메서드
   * 연결 상태와 무관하게 roomHandlers에만 등록
   * React Strict Mode 안전
   *
   * @param roomId 채팅방 ID
   * @param handler 메시지 핸들러
   * @returns unsubscribe 메서드를 가진 구독 객체
   *
   * @example
   * const subscription = websocketService.subscribe(roomId, handleMessage)
   * // cleanup에서:
   * subscription.unsubscribe()
   */
  subscribe(roomId: number, handler: MessageHandler) {
    console.log(`📝 [PURE] Subscribing to room ${roomId}`)

    // roomHandlers에만 등록 (순수 구독)
    if (!this.roomHandlers.has(roomId)) {
      this.roomHandlers.set(roomId, new Set())
    }
    this.roomHandlers.get(roomId)!.add(handler)

    console.log(
      `✅ [PURE] Handler subscribed (roomHandlers size: ${this.roomHandlers.get(roomId)?.size})`
    )

    // Pure cleanup: 해당 구독만 제거
    return {
      unsubscribe: () => {
        console.log(`🧹 [PURE] Unsubscribing from room ${roomId}`)
        const handlers = this.roomHandlers.get(roomId)
        if (handlers) {
          handlers.delete(handler)
          if (handlers.size === 0) {
            this.roomHandlers.delete(roomId)
            console.log(
              `🗑️ [PURE] All subscriptions removed for room ${roomId}`
            )
          }
        }
      },
    }
  }

  /**
   * Pure Effect 패턴: 멱등적 연결 메서드
   * 이미 연결되어 있으면 즉시 반환
   * 연결 완료 후 해당 room의 핸들러 자동 활성화
   *
   * @param roomId 채팅방 ID
   * @returns Promise<void>
   *
   * @example
   * await websocketService.ensureConnected(roomId)
   * // 여러 번 호출해도 안전 (멱등성)
   */
  async ensureConnected(roomId: number): Promise<void> {
    console.log(`🔌 [PURE] Ensuring connection to room ${roomId}`)

    // 이미 같은 방에 연결되어 있으면 즉시 반환 (멱등성)
    if (this.currentRoomId === roomId && this.isConnected()) {
      console.log(`✅ [PURE] Already connected to room ${roomId}`)
      this.activateHandlers(roomId) // 핸들러 활성화
      return
    }

    // 다른 방에 연결되어 있으면 전환
    if (this.currentRoomId !== roomId) {
      console.log(`🔄 [PURE] Switching room: ${this.currentRoomId} → ${roomId}`)
      await this.switchRoom(roomId)
      return
    }

    // 연결되지 않은 경우 새로 연결
    console.log(`🆕 [PURE] Creating new connection to room ${roomId}`)
    await this.connect(roomId)
    this.activateHandlers(roomId)
  }

  /**
   * Private: roomHandlers → messageHandlers 활성화
   * subscribe()로 등록된 핸들러들을 messageHandlers에 복사하여 실제로 메시지를 받도록 함
   *
   * @param roomId 채팅방 ID
   */
  private activateHandlers(roomId: number): void {
    const roomHandlers = this.roomHandlers.get(roomId)
    if (roomHandlers && roomHandlers.size > 0) {
      console.log(
        `⚡ [PURE] Activating ${roomHandlers.size} handlers for room ${roomId}`
      )
      roomHandlers.forEach(handler => this.messageHandlers.add(handler))
      console.log(
        `✅ [PURE] Active handlers count: ${this.messageHandlers.size}`
      )
    } else {
      console.log(`⚠️ [PURE] No handlers to activate for room ${roomId}`)
    }
  }

  /**
   * 연결 핸들러 등록
   */
  onConnect(handler: ConnectionHandler): () => void {
    this.connectHandlers.add(handler)
    return () => this.connectHandlers.delete(handler)
  }

  /**
   * 연결 해제 핸들러 등록
   */
  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectHandlers.add(handler)
    return () => this.disconnectHandlers.delete(handler)
  }

  /**
   * 에러 핸들러 등록
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler)
    return () => this.errorHandlers.delete(handler)
  }

  /**
   * 재연결 로직 (Exponential Backoff)
   * 1st retry: 1s, 2nd: 2s, 3rd: 4s, 4th: 8s, 5th: 10s (capped)
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++

      // Exponential backoff: 1s, 2s, 4s, 8s, 10s (max 10s)
      const delay = Math.min(
        1000 * Math.pow(2, this.reconnectAttempts - 1),
        10000
      )

      console.log(
        `🔄 Reconnecting in ${delay / 1000}s... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      )

      setTimeout(() => {
        this.connect(this.currentRoomId).catch(error => {
          console.error('Reconnection failed:', error)
        })
      }, delay)
    } else {
      console.error('❌ Max reconnection attempts reached')
    }
  }

  /**
   * 하트비트 시작 (연결 유지용 ping)
   * 25초마다 서버에 PING 메시지를 보내 idle timeout 방지
   */
  private startHeartbeat(): void {
    this.stopHeartbeat() // 기존 타이머 제거

    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        try {
          // 서버가 처리할 수 있는 heartbeat ping 메시지 전송
          const pingMessage = JSON.stringify({ messageType: 'PING' })
          this.socket.send(pingMessage)
          console.log('💓 Heartbeat ping sent')
        } catch (error) {
          console.error('Failed to send heartbeat ping:', error)
        }
      }
    }, this.heartbeatIntervalMs)
  }

  /**
   * 하트비트 중지
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
      console.log('💔 Heartbeat stopped')
    }
  }

  /**
   * 연결 종료
   */
  disconnect(): void {
    this.stopHeartbeat() // Stop heartbeat before closing connection
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.messageHandlers.clear()
    this.errorHandlers.clear()
    this.connectHandlers.clear()
    this.disconnectHandlers.clear()
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }

  /**
   * 재연결 시도 횟수 초기화
   */
  resetReconnectAttempts(): void {
    this.reconnectAttempts = 0
  }
}

// 싱글톤 인스턴스
export const websocketService = new WebSocketService()
