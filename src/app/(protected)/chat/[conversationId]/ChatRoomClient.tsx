'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useHeader } from '@/contexts/HeaderContext'
import {
  useChatRoomMessages,
  usePartnerProfile,
  useExchangeBooks,
} from '@/hooks/useChatRoom'
import type { Message } from '@/types/chatroom'
import MessageBubble from '../components/MessageBubble'
import MessageInput from '../components/MessageInput'
import {
  ChatBubbleLeftIcon,
  BookOpenIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

interface ChatRoomClientProps {
  conversationId: string
}

export default function ChatRoomClient({
  conversationId,
}: ChatRoomClientProps) {
  const router = useRouter()
  const { setHeaderContent } = useHeader()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatroomId = parseInt(conversationId)

  // Fetch partner profile
  const { data: partner } = usePartnerProfile(chatroomId)

  // Fetch exchange books info
  const { data: exchangeBooks } = useExchangeBooks(chatroomId)

  // Fetch messages
  const { data: messagesData, isLoading } = useChatRoomMessages(chatroomId)

  // Get current user ID from first page response
  const myMemberId = messagesData?.pages[0]?.myMemberId

  // Set header with partner info
  useEffect(() => {
    if (!partner) return

    setHeaderContent(
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.push('/social')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <span className="text-xl">←</span>
        </button>
        <div>
          <h1 className="text-xl font-bold">{partner.nickname}</h1>
          {exchangeBooks && exchangeBooks[0]?.myBook?.bookName && (
            <p className="text-xs text-primary-600 flex items-center gap-1">
              <BookOpenIcon className="w-3 h-3" />
              {exchangeBooks[0].myBook.bookName}
            </p>
          )}
        </div>
      </header>
    )

    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent, router, partner, exchangeBooks])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Extract all messages from infinite query pages
  const messages =
    messagesData?.pages.flatMap(page => page.message).reverse() || []

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages.length])

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      // TODO: Implement message sending API
      console.log('Sending message:', content)
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.sentTime).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, Message[]>
  )

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <ArrowPathIcon className="w-12 h-12 text-gray-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center py-12">
              <ChatBubbleLeftIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                메시지가 없습니다
              </h3>
              <p className="text-gray-600">첫 메시지를 보내보세요!</p>
            </div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-200" />
                <span className="px-3 text-xs text-gray-500 bg-gray-50">
                  {date}
                </span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* Messages */}
              {dateMessages.map((message, index) => (
                <MessageBubble
                  key={message.messageId}
                  message={message}
                  isOwn={message.senderId === myMemberId}
                  showAvatar={
                    index === 0 ||
                    dateMessages[index - 1]?.senderId !== message.senderId
                  }
                  partnerName={partner?.nickname}
                />
              ))}
            </div>
          ))
        )}

        {/* Scroll to bottom ref */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} isLoading={false} />
    </div>
  )
}
