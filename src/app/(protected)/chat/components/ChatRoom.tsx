'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import type { Message } from '../ChatClient'
import {
  ArrowLeftIcon,
  UserCircleIcon,
  EllipsisVerticalIcon,
  BookOpenIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface ChatRoomProps {
  conversationId: string
  onBack?: () => void
}

export default function ChatRoom({ conversationId, onBack }: ChatRoomProps) {
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  // Mock current user
  const currentUserId = '2'

  // Mock messages for development
  const mockMessages: Message[] = [
    {
      id: '1',
      conversationId,
      senderId: '1',
      senderName: '김독서',
      content: '안녕하세요! 미움받을 용기 책 교환 가능할까요?',
      timestamp: '2024-01-20T10:00:00',
      type: 'text',
      readBy: ['1', '2'],
    },
    {
      id: '2',
      conversationId,
      senderId: '2',
      senderName: '나',
      content: '네, 가능합니다! 책 상태는 양호한 편이에요.',
      timestamp: '2024-01-20T10:05:00',
      type: 'text',
      readBy: ['1', '2'],
    },
    {
      id: '3',
      conversationId,
      senderId: '1',
      senderName: '김독서',
      content: '좋아요! 언제 시간 되시나요?',
      timestamp: '2024-01-20T10:10:00',
      type: 'text',
      readBy: ['1', '2'],
    },
    {
      id: '4',
      conversationId,
      senderId: '2',
      senderName: '나',
      content: '주말 오후가 괜찮은데, 토요일 2시 어떠신가요?',
      timestamp: '2024-01-20T10:15:00',
      type: 'text',
      readBy: ['1', '2'],
    },
    {
      id: '5',
      conversationId,
      senderId: '1',
      senderName: '김독서',
      content: '내일 오후 2시에 만날까요?',
      timestamp: '2024-01-20T10:20:00',
      type: 'text',
      readBy: ['1'],
    },
  ]

  const { data: messages = mockMessages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockMessages
    },
    refetchInterval: 2000, // Poll every 2 seconds for new messages
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      // TODO: Replace with actual API call
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId,
        senderId: currentUserId,
        senderName: '나',
        content,
        timestamp: new Date().toISOString(),
        type: 'text',
        readBy: [currentUserId],
      }
      return newMessage
    },
    onSuccess: newMessage => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: Message[] = []) => [...old, newMessage]
      )
      scrollToBottom()
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(Math.random() > 0.8)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      sendMessageMutation.mutate(content)
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.timestamp).toLocaleDateString('ko-KR', {
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
        <ClockIcon className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
            )}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900">김독서</h2>
              <p className="text-xs text-primary-600 flex items-center gap-1">
                <BookOpenIcon className="w-3 h-3" />
                미움받을 용기
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <EllipsisVerticalIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
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
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
                showAvatar={
                  index === 0 ||
                  dateMessages[index - 1]?.senderId !== message.senderId
                }
              />
            ))}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-gray-500" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Scroll to bottom ref */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={sendMessageMutation.isPending}
      />
    </div>
  )
}
