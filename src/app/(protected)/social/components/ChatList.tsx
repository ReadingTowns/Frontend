'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useChatRoomList } from '@/hooks/useChatRoom'

interface ChatListProps {
  selectedId: string | null
}

export default function ChatList({ selectedId }: ChatListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // Real API integration
  const { data: chatRooms = [], isLoading } = useChatRoomList()

  const filteredConversations = chatRooms.filter(room => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      room.partnerName.toLowerCase().includes(query) ||
      room.lastMessage?.toLowerCase().includes(query)
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
          filteredConversations.map(room => {
            const isSelected = selectedId === String(room.chatRoomId)

            return (
              <button
                key={room.chatRoomId}
                onClick={() => router.push(`/social/${room.chatRoomId}`)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  isSelected ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Profile Image */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCircleIcon className="w-7 h-7 text-gray-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {room.partnerName}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-500">
                        {room.lastMessageTime || ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate pr-2">
                        {room.lastMessage || '메시지가 없습니다'}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

ChatList.displayName = 'ChatList'
