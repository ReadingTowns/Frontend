'use client'

import type { Message } from '../ChatClient'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar: boolean
}

export default function MessageBubble({
  message,
  isOwn,
  showAvatar,
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
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div
        className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}
      >
        {/* Sender name (only for others and first message in group) */}
        {!isOwn && showAvatar && (
          <span className="text-xs text-gray-600 mb-1 ml-2">
            {message.senderName}
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
            {message.type === 'text' && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}

            {message.type === 'image' && message.attachments && (
              <div className="space-y-2">
                {message.attachments.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="Shared image"
                    className="rounded-lg max-w-full"
                  />
                ))}
                {message.content && (
                  <p className="text-sm mt-2">{message.content}</p>
                )}
              </div>
            )}

            {message.type === 'book_info' && (
              <div className="bg-white/10 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-medium text-sm">{message.content}</p>
                    <p className="text-xs opacity-80">책 정보</p>
                  </div>
                </div>
              </div>
            )}

            {message.type === 'location' && (
              <div className="bg-white/10 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-80">위치 공유</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Time & Read Status */}
          <div
            className={`flex items-center gap-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>
            {isOwn && (
              <span className="text-xs">
                {message.readBy.length > 1 ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
