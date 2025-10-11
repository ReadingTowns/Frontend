'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import UserSearchModal from './UserSearchModal'
import type { Conversation } from '../ChatClient'

interface ChatListProps {
  selectedId: string | null
  onSelectConversation: (conversationId: string) => void
}

export default function ChatList({
  selectedId,
  onSelectConversation,
}: ChatListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isUserSearchModalOpen, setIsUserSearchModalOpen] = useState(false)

  // Mock data for development
  const mockConversations: Conversation[] = [
    {
      id: '1',
      participants: [
        { id: '1', name: '김독서', profileImage: undefined },
        { id: '2', name: '나' },
      ],
      bookTitle: '미움받을 용기',
      bookId: 'book1',
      lastMessage: '내일 오후 2시에 만날까요?',
      lastMessageTime: '방금 전',
      unreadCount: 2,
      status: 'active',
    },
    {
      id: '2',
      participants: [
        { id: '3', name: '이책방', profileImage: undefined },
        { id: '2', name: '나' },
      ],
      bookTitle: '사피엔스',
      bookId: 'book2',
      lastMessage: '책 상태가 정말 좋네요!',
      lastMessageTime: '10분 전',
      unreadCount: 0,
      status: 'active',
    },
    {
      id: '3',
      participants: [
        { id: '4', name: '박문학', profileImage: undefined },
        { id: '2', name: '나' },
      ],
      bookTitle: '1984',
      bookId: 'book3',
      lastMessage: '교환 완료했습니다. 감사합니다!',
      lastMessageTime: '어제',
      unreadCount: 0,
      status: 'completed',
    },
  ]

  const { data: conversations = mockConversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockConversations
    },
    refetchInterval: 5000, // Poll every 5 seconds
  })

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      conv.participants.some(p => p.name.toLowerCase().includes(query)) ||
      conv.bookTitle?.toLowerCase().includes(query) ||
      conv.lastMessage.toLowerCase().includes(query)
    )
  })

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded-lg mb-4" />
          <div className="h-20 bg-gray-200 rounded-lg mb-4" />
          <div className="h-20 bg-gray-200 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="대화 검색..."
            className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <ChatBubbleLeftIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">대화가 없습니다</p>
              <p className="text-sm text-gray-500 mt-2">
                책을 교환하고 싶은 이웃과 대화를 시작해보세요
              </p>
            </div>
          </div>
        ) : (
          filteredConversations.map(conversation => {
            const otherParticipant = conversation.participants.find(
              p => p.name !== '나'
            )
            const isSelected = selectedId === conversation.id

            return (
              <button
                key={conversation.id}
                onClick={() => router.push(`/chat/${conversation.id}`)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  isSelected ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Profile Image */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    {otherParticipant?.profileImage ? (
                      <img
                        src={otherParticipant.profileImage}
                        alt={otherParticipant.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-7 h-7 text-gray-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {otherParticipant?.name}
                        </h3>
                        {conversation.bookTitle && (
                          <p className="text-xs text-primary-600 mt-0.5 flex items-center gap-1">
                            <BookOpenIcon className="w-3 h-3" />
                            {conversation.bookTitle}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate pr-2">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    {conversation.status === 'completed' && (
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        교환 완료
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* New Chat Button */}
      <button
        onClick={() => setIsUserSearchModalOpen(true)}
        className="m-4 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
      >
        새 대화 시작하기
      </button>

      {/* User Search Modal */}
      <UserSearchModal
        isOpen={isUserSearchModalOpen}
        onClose={() => setIsUserSearchModalOpen(false)}
      />
    </div>
  )
}
