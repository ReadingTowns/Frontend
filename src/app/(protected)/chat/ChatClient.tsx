'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ChatList from './components/ChatList'
import ChatRoom from './components/ChatRoom'
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
  const router = useRouter()
  const { setHeaderContent } = useHeader()
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      setHeaderContent(
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <h1 className="text-xl font-bold">채팅</h1>
          </div>
        </header>
      )
    } else {
      setHeaderContent(
        <header>
          <h1 className="text-2xl font-bold">채팅</h1>
          <p className="text-sm text-gray-600 mt-1">책 교환 대화 목록</p>
        </header>
      )
    }
  }, [selectedConversation, setHeaderContent])

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
  }

  // Both desktop and mobile show list only
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <ChatList
        selectedId={null}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  )
}
