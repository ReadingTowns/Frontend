'use client'

import { useEffect } from 'react'
import ChatList from './components/ChatList'
import { useHeader } from '@/contexts/HeaderContext'

export interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    profileImage?: string
  }[]
  bookTitle?: string
  bookId?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: 'active' | 'archived' | 'completed'
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'location' | 'book_info'
  readBy: string[]
  attachments?: string[]
}

export default function ChatClient() {
  const { setHeaderContent } = useHeader()

  useEffect(() => {
    setHeaderContent(
      <header>
        <h1 className="text-2xl font-bold">채팅</h1>
        <p className="text-sm text-gray-600 mt-1">책 교환 대화 목록</p>
      </header>
    )
  }, [setHeaderContent])

  // Both desktop and mobile show list only
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <ChatList selectedId={null} />
    </div>
  )
}
