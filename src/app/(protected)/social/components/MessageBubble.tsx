'use client'

import type { Message } from '@/types/chatroom'
import { UserCircleIcon } from '@heroicons/react/24/outline'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar: boolean
  partnerName?: string
  partnerProfileImage?: string
}

export default function MessageBubble({
  message,
  isOwn,
  showAvatar,
  partnerName,
  partnerProfileImage,
}: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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
            <>
              {partnerProfileImage ? (
                <img
                  src={partnerProfileImage}
                  alt={partnerName || '상대방'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Message Content */}
      <div
        className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}
      >
        {/* Sender name (only for others and first message in group) */}
        {!isOwn && showAvatar && partnerName && (
          <span className="text-xs text-gray-600 mb-1 ml-2">{partnerName}</span>
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
