'use client'

/**
 * MessageBubble Component
 * 메시지 타입에 따라 다른 UI를 렌더링
 * - TEXT: 일반 텍스트 메시지
 * - EXCHANGE_REQUEST: 교환 요청 카드
 * - EXCHANGE_ACCEPTED/REJECTED/RESERVED/COMPLETED/RETURNED: 상태 메시지
 * - SYSTEM: 시스템 메시지
 */

import type { Message, ExchangeBooksResponse } from '@/types/chatroom'
import { MessageType } from '@/types/exchange'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { SystemMessage } from '@/components/chat/SystemMessage'
import { ExchangeRequestCard } from '@/components/chat/ExchangeRequestCard'
import { ExchangeStatusMessage } from '@/components/chat/ExchangeStatusMessage'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar: boolean
  partnerName?: string
  exchangeBooks?: ExchangeBooksResponse
  chatroomId?: number
  onNewRequest?: () => void
}

export default function MessageBubble({
  message,
  isOwn,
  showAvatar,
  partnerName,
  exchangeBooks,
  chatroomId,
  onNewRequest,
}: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Determine message type (default to TEXT for backward compatibility)
  const messageType = message.messageType || MessageType.TEXT

  // Render different components based on message type
  switch (messageType) {
    case MessageType.SYSTEM:
      return (
        <SystemMessage
          messageType={messageType}
          messageText={message.messageText}
          sentTime={message.sentTime}
        />
      )

    case MessageType.EXCHANGE_REQUEST:
      if (!exchangeBooks || !chatroomId) {
        return (
          <div className="my-3 px-4">
            <p className="text-center text-sm text-gray-500">
              교환 정보를 불러오는 중...
            </p>
          </div>
        )
      }
      return (
        <ExchangeRequestCard
          myBook={exchangeBooks.myBook}
          partnerBook={exchangeBooks.partnerBook}
          chatroomId={chatroomId}
          onNewRequest={onNewRequest}
        />
      )

    case MessageType.EXCHANGE_ACCEPTED:
    case MessageType.EXCHANGE_REJECTED:
    case MessageType.EXCHANGE_RESERVED:
    case MessageType.EXCHANGE_COMPLETED:
    case MessageType.EXCHANGE_RETURNED:
      return (
        <ExchangeStatusMessage
          messageType={messageType}
          messageText={message.messageText}
          sentTime={message.sentTime}
        />
      )

    case MessageType.TEXT:
    default:
      // Regular text message
      return (
        <div
          className={`flex gap-2 mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
        >
          {/* Avatar for other user */}
          {!isOwn && (
            <div
              className={`w-8 h-8 flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}
            >
              {showAvatar && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </div>
          )}

          {/* Message Content */}
          <div
            className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}
          >
            {/* Sender name (only for others and first message in group) */}
            {!isOwn && showAvatar && partnerName && (
              <span className="text-xs text-gray-600 mb-1 ml-2">
                {partnerName}
              </span>
            )}

            <div
              className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  isOwn
                    ? 'bg-primary-400 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.messageText}
                </p>
              </div>

              {/* Time */}
              <div
                className={`flex items-center gap-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <span className="text-xs text-gray-500">
                  {formatTime(message.sentTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
  }
}
