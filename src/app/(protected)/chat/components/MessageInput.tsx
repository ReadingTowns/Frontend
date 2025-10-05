'use client'

import { useState, useRef, KeyboardEvent } from 'react'

interface MessageInputProps {
  onSendMessage: (content: string) => void
  isLoading?: boolean
}

export default function MessageInput({
  onSendMessage,
  isLoading,
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const quickReplies = [
    '네, 좋습니다!',
    '언제 시간 되시나요?',
    '책 상태는 어떤가요?',
    '어디서 만날까요?',
    '감사합니다!',
  ]

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
      textareaRef.current?.focus()
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickReply = (reply: string) => {
    setMessage(reply)
    setShowQuickReplies(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="bg-white border-t border-gray-200">
      {/* Quick Replies */}
      {showQuickReplies && (
        <div className="p-2 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4">
        <div className="flex items-end gap-2">
          {/* Action Buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="빠른 답장"
            >
              <span className="text-xl">💬</span>
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="사진 전송"
            >
              <span className="text-xl">📷</span>
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="위치 공유"
            >
              <span className="text-xl">📍</span>
            </button>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: '120px',
              }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`p-2 rounded-lg transition-colors ${
              message.trim() && !isLoading
                ? 'bg-primary-400 hover:bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              <span className="text-xl">↗️</span>
            )}
          </button>
        </div>

        {/* Book Exchange Action Bar */}
        <div className="mt-3 flex gap-2">
          <button className="flex-1 py-2 px-3 bg-secondary-100 hover:bg-secondary-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            📅 교환 일정 제안
          </button>
          <button className="flex-1 py-2 px-3 bg-secondary-100 hover:bg-secondary-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            📚 책 정보 공유
          </button>
        </div>
      </div>
    </div>
  )
}
