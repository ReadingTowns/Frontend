'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useHeaderConfig } from '@/hooks/useHeaderConfig'
import {
  useChatRoomMessages,
  usePartnerProfile,
  useExchangeBooks,
  useDeleteChatRoom,
} from '@/hooks/useChatRoom'
import { useWebSocket } from '@/hooks/useWebSocket'
import type { Message } from '@/types/chatroom'
import type { ChatMessage } from '@/services/websocketService'
import MessageBubble from '../components/MessageBubble'
import MessageInput from '../components/MessageInput'
import ChatRoomExitModal from '../components/ChatRoomExitModal'
import { ChatBubbleLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface ChatRoomClientProps {
  conversationId: string
}

export default function ChatRoomClient({
  conversationId,
}: ChatRoomClientProps) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showExitDialog, setShowExitDialog] = useState(false)

  const chatroomId = parseInt(conversationId)

  // Delete chatroom mutation
  const deleteChatRoomMutation = useDeleteChatRoom()

  // Fetch partner profile
  const { data: partner } = usePartnerProfile(chatroomId)

  // Fetch exchange books info (legacy)
  const { data: exchangeBooks } = useExchangeBooks(chatroomId)

  // Fetch messages
  const { data: messagesData, isLoading } = useChatRoomMessages(chatroomId)

  // Get current user ID from first page response
  const myMemberId = messagesData?.pages[0]?.myMemberId || 0

  // ✅ FIX: useCallback으로 안정적인 콜백 참조 유지
  const handleMessageReceived = useCallback((message: ChatMessage) => {
    console.log('📨 New message received:', message)
    // 자동으로 TanStack Query 캐시 업데이트됨 (useWebSocket 훅 내부)
  }, [])

  const handleError = useCallback((error: Event) => {
    console.error('WebSocket error:', error)
  }, [])

  const handleConnect = useCallback(() => {
    console.log('✅ WebSocket connected')
  }, [])

  const handleDisconnect = useCallback(() => {
    console.log('🔌 WebSocket disconnected')
  }, [])

  // WebSocket 연결 및 실시간 메시지
  const { sendMessage: sendWebSocketMessage, isConnected } = useWebSocket({
    chatroomId,
    onMessageReceived: handleMessageReceived,
    onError: handleError,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
  })

  // Exit chatroom handler
  const handleExitChatRoom = useCallback(async () => {
    try {
      await deleteChatRoomMutation.mutateAsync(chatroomId)
      router.push('/social')
    } catch (error) {
      console.error('Failed to exit chat room:', error)
      alert('채팅방 나가기에 실패했습니다.')
    }
  }, [chatroomId, deleteChatRoomMutation, router])

  // Chat 헤더 설정
  useHeaderConfig(
    {
      variant: 'chat',
      partner: partner
        ? {
            id: partner.memberId,
            nickname: partner.nickname,
            profileImage: partner.profileImage,
          }
        : { id: 0, nickname: '채팅' },
      isConnected,
      bookInfo: exchangeBooks?.myBook?.bookName
        ? {
            bookName: exchangeBooks.myBook.bookName,
            bookImage: exchangeBooks.myBook.bookImage || undefined,
          }
        : undefined,
      onBack: () => router.push('/social'),
      actions: (
        <button
          onClick={() => setShowExitDialog(true)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          나가기
        </button>
      ),
    },
    [partner, isConnected, exchangeBooks]
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Extract all messages from infinite query pages
  const messages = messagesData?.pages.flatMap(page => page.message) || []

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages.length])

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      try {
        sendWebSocketMessage(content)
      } catch (error) {
        console.error('Failed to send message:', error)
        alert('메시지 전송에 실패했습니다. 연결 상태를 확인해주세요.')
      }
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
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
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
                  exchangeBooks={exchangeBooks}
                  chatroomId={chatroomId}
                  onNewRequest={() => {
                    // TODO: Navigate to new exchange request dialog
                    console.log('New exchange request clicked')
                  }}
                />
              ))}
            </div>
          ))
        )}

        {/* Scroll to bottom ref */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={!isConnected}
      />

      {/* Exit Confirmation Modal */}
      <ChatRoomExitModal
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onConfirm={handleExitChatRoom}
        isLoading={deleteChatRoomMutation.isPending}
      />
    </div>
  )
}
