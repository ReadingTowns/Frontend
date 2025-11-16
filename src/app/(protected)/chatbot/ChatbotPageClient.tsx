'use client'

import { useEffect, useRef, useState } from 'react'
import { useHeaderConfig } from '@/hooks/useHeaderConfig'
import MessageBubble from '@/app/(protected)/chat/components/MessageBubble'
import MessageInput from '@/app/(protected)/chat/components/MessageInput'
import { ChatbotTypingIndicator } from '@/components/chatbot/ChatbotTypingIndicator'
import { useChatbotHistory } from '@/hooks/useChatbotHistory'
import { useSendChatbotMessage } from '@/hooks/useSendChatbotMessage'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { MessageType } from '@/types/exchange'
import { showError } from '@/lib/toast'

export default function ChatbotPageClient() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  // Header configuration
  useHeaderConfig({
    variant: 'navigation',
    title: 'AI 챗봇',
  })

  // Fetch chat history with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: historyError,
  } = useChatbotHistory()

  // Show error toast for chat history loading errors
  useEffect(() => {
    if (historyError) {
      const errorMessage =
        (historyError as { message?: string })?.message ||
        '채팅 기록을 불러오는데 실패했습니다.'
      showError(errorMessage)
    }
  }, [historyError])

  // Send message mutation
  const sendMessageMutation = useSendChatbotMessage()

  // Flatten all messages from pages
  const allMessages = data?.pages.flatMap(page => page.messages).reverse() ?? []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // ResizeObserver: layout shift 자동 감지 및 스크롤 유지
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      // 스크롤이 맨 밑 근처에 있었는지 확인 (100px 이내)
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100

      if (isNearBottom) {
        // requestAnimationFrame으로 브라우저 렌더링 사이클과 동기화
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight
        })
      }
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (allMessages.length > 0) {
      scrollToBottom()
    }
  }, [allMessages.length])

  // Auto-scroll when typing state changes to true
  useEffect(() => {
    if (isTyping) {
      scrollToBottom()
    }
  }, [isTyping])

  // Handle send message
  const handleSendMessage = async (message: string) => {
    setIsTyping(true)

    try {
      await sendMessageMutation.mutateAsync(message)
      // 메시지 전송 즉시 스크롤 (낙관적 업데이트)
      scrollToBottom()
    } catch (error) {
      console.error('Failed to send message:', error)
      // API 에러는 api.ts에서 자동으로 토스트 표시
    } finally {
      setIsTyping(false)
    }
  }

  // Handle scroll to load more messages
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget

    // Load more when scrolled to top
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  // Group messages by date
  const groupedMessages: Array<{
    date: string | null
    messages: typeof allMessages
  }> = []

  allMessages.forEach(message => {
    if (message.showDate && message.dateLabel) {
      groupedMessages.push({ date: message.dateLabel, messages: [] })
    }
    if (groupedMessages.length === 0) {
      groupedMessages.push({ date: null, messages: [] })
    }
    groupedMessages[groupedMessages.length - 1].messages.push(message)
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 min-h-0"
        onScroll={handleScroll}
      >
        {/* Load more indicator */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-2">
            <LoadingSpinner size="sm" />
          </div>
        )}

        {/* Message Groups */}
        {groupedMessages.map((group, groupIdx) => (
          <div key={groupIdx}>
            {/* Date Separator */}
            {group.date && (
              <div className="my-4 text-center">
                <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
                  {group.date}
                </span>
              </div>
            )}

            {/* Messages */}
            {group.messages.map((message, idx) => {
              const isOwn = message.role === 'USER'
              const showTime = message.showTime && message.timeLabel
              const prevMessage = group.messages[idx - 1]
              const showAvatar =
                !prevMessage || prevMessage.role !== message.role

              return (
                <div key={message.messageId}>
                  <MessageBubble
                    message={{
                      messageId: message.messageId,
                      senderId: isOwn ? 1 : 0, // Mock sender IDs
                      messageText: message.message,
                      sentTime: message.createdAt,
                      messageType: MessageType.TEXT,
                    }}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    partnerName={isOwn ? undefined : 'AI 챗봇'}
                  />
                  {/* Time label */}
                  {showTime && (
                    <div
                      className={`mb-2 text-xs text-gray-500 ${
                        isOwn ? 'text-right pr-2' : 'text-left pl-2'
                      }`}
                    >
                      {message.timeLabel}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && <ChatbotTypingIndicator />}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200">
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isTyping || sendMessageMutation.isPending}
        />
      </div>
    </div>
  )
}
