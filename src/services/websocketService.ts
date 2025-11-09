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
  private reconnectDelay = 3000
  private messageHandlers: Set<MessageHandler> = new Set()
  private errorHandlers: Set<ErrorHandler> = new Set()
  private connectHandlers: Set<ConnectionHandler> = new Set()
  private disconnectHandlers: Set<ConnectionHandler> = new Set()

  // Heartbeat mechanism to keep connection alive
  private heartbeatInterval: NodeJS.Timeout | null = null
  private heartbeatIntervalMs = 25000 // 25초마다 ping (서버 30초 timeout보다 짧게 설정)

  /**
   * WebSocket 연결
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL

        if (!wsUrl) {
          throw new Error('NEXT_PUBLIC_WS_URL environment variable is not set')
        }

        console.log('🔌 Connecting to WebSocket:', wsUrl)
        this.socket = new WebSocket(wsUrl)

        this.socket.onopen = () => {
          console.log('✅ WebSocket connected')
          this.reconnectAttempts = 0
          this.startHeartbeat() // Start heartbeat to keep connection alive
          this.connectHandlers.forEach(handler => handler())
          resolve()
        }

        this.socket.onmessage = event => {
          try {
            const data: ChatMessage = JSON.parse(event.data)
            console.log('📨 Message received:', data)
            this.messageHandlers.forEach(handler => handler(data))
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
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
   * 메시지 수신 핸들러 등록
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
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
   * 재연결 로직
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(
        `🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      )

      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error)
        })
      }, this.reconnectDelay * this.reconnectAttempts)
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
