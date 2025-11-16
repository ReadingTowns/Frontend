'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import { useChatRoomList } from '@/hooks/useChatRoom'

interface ChatListProps {
  selectedId: string | null
  onSelectConversation: (conversationId: string) => void
}

export default function ChatList({ selectedId }: ChatListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  console.log('🔍 [ChatList] Component mounted/rendered')

  // 3초마다 자동 갱신 (폴링)
  const { data: chatRooms = [], isLoading } = useChatRoomList()

  console.log('🔍 [ChatList] useChatRoomList result:', {
    isLoading,
    chatRoomsCount: chatRooms.length,
    timestamp: new Date().toISOString(),
  })

  // 검색 필터링 + 최신순 정렬 (useMemo로 최적화)
  const sortedAndFilteredChatRooms = useMemo(() => {
    // 1. 검색 필터링
    let filtered = chatRooms
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = chatRooms.filter(
        room =>
          room.partnerName.toLowerCase().includes(query) ||
          room.lastMessage?.toLowerCase().includes(query)
      )
    }

    // 2. 최신순 정렬 (lastMessageTime 기준)
    const sorted = [...filtered].sort((a, b) => {
      // lastMessageTime이 없는 경우 맨 뒤로
      if (!a.lastMessageTime) return 1
      if (!b.lastMessageTime) return -1

      // 안전한 날짜 파싱 (NaN 방지)
      const timeA = new Date(a.lastMessageTime).getTime()
      const timeB = new Date(b.lastMessageTime).getTime()

      // 파싱 실패 시 (NaN) 맨 뒤로
      if (isNaN(timeA)) {
        console.warn(
          `[ChatList] Invalid date format for ${a.partnerName}:`,
          a.lastMessageTime
        )
        return 1
      }
      if (isNaN(timeB)) {
        console.warn(
          `[ChatList] Invalid date format for ${b.partnerName}:`,
          b.lastMessageTime
        )
        return -1
      }

      // 최신순 정렬 (큰 숫자가 더 최신)
      return timeB - timeA
    })

    // 개발 환경에서만 정렬 결과 로깅
    if (process.env.NODE_ENV === 'development' && sorted.length > 0) {
      console.log(
        '[ChatList] Sorted chat rooms:',
        sorted.map(room => ({
          name: room.partnerName,
          time: room.lastMessageTime,
          parsed: new Date(room.lastMessageTime || '').toLocaleString('ko-KR'),
        }))
      )
    }

    return sorted
  }, [chatRooms, searchQuery])

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
        {sortedAndFilteredChatRooms.length === 0 ? (
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
          sortedAndFilteredChatRooms.map(chatRoom => {
            const isSelected = selectedId === String(chatRoom.chatroomId)

            return (
              <button
                key={chatRoom.chatroomId}
                onClick={() => router.push(`/chat/${chatRoom.chatroomId}`)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  isSelected ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Profile Image */}
                  {chatRoom.profileImage ? (
                    <img
                      src={chatRoom.profileImage}
                      alt={`${chatRoom.partnerName} 프로필`}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCircleIcon className="w-7 h-7 text-gray-400" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {chatRoom.partnerName}
                        </h3>
                        {(chatRoom.myBookImage ||
                          chatRoom.partnerBookImage) && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <BookOpenIcon className="w-3 h-3 text-primary-600" />
                            <span className="text-xs text-primary-600">
                              책 교환 중
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {chatRoom.lastMessageTime
                          ? new Date(
                              chatRoom.lastMessageTime
                            ).toLocaleDateString('ko-KR', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate pr-2">
                        {chatRoom.lastMessage || '메시지가 없습니다'}
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
