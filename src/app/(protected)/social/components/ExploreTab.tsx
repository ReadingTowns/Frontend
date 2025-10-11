'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import UserCard from '@/components/neighbors/UserCard'
import UserSearch from '@/components/neighbors/UserSearch'
import { socialKeys } from '@/types/social'
import { createChatRoom } from '@/services/userSearchService'
import type { CreateChatRequest } from '@/types/userSearch'

interface User {
  memberId: number
  nickname: string
  profileImage: string
  followed?: boolean
  currentTown?: string
  userRating?: number | null
  userRatingCount?: number
  commonInterests?: string[]
  distance?: string
}

export default function ExploreTab() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

  // 추천 유저 조회
  // API endpoint doesn't exist yet - disabled for now
  const { data: recommendations, isLoading } = useQuery({
    queryKey: socialKeys.recommendations(),
    queryFn: async () => {
      const res = await fetch(`${backendUrl}/api/v1/users/recommendations`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch recommendations')
      const data = await res.json()
      return data.result as User[]
    },
    enabled: false, // Disabled: API endpoint not available yet
  })

  // 검색 결과 조회
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: socialKeys.search(searchQuery),
    queryFn: async () => {
      const res = await fetch(
        `${backendUrl}/api/v1/members/search?nickname=${searchQuery}`,
        {
          credentials: 'include',
        }
      )
      if (!res.ok) throw new Error('Failed to search users')
      const data = await res.json()
      return data.result as User[]
    },
    enabled: searchQuery.length >= 2,
  })

  // 채팅방 생성 mutation
  const createChatMutation = useMutation({
    mutationFn: createChatRoom,
    onSuccess: result => {
      queryClient.invalidateQueries({ queryKey: socialKeys.conversations() })
      router.push(`/social/${result.chatroomId}`)
    },
    onError: error => {
      console.error('Failed to create chat:', error)
      alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.')
    },
  })

  const handleChatClick = (user: User) => {
    const request: CreateChatRequest = {
      partnerId: String(user.memberId),
      initialMessage: `안녕하세요! ${user.nickname}님과 책에 대해 이야기하고 싶습니다.`,
    }
    createChatMutation.mutate(request)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const users = searchQuery ? searchResults || [] : recommendations || []
  const loading = searchQuery ? searchLoading : isLoading

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* 검색바 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <UserSearch onSearch={handleSearch} />
      </div>

      {/* 유저 리스트 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
            <p className="mt-4">불러오는 중...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? (
              <>
                <XCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg mb-2">검색 결과가 없습니다</p>
                <p className="text-sm">다른 검색어를 시도해보세요</p>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg mb-2">이웃 찾기</p>
                <p className="text-sm">검색을 통해 새로운 이웃을 찾아보세요</p>
              </>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {users.map(user => (
              <UserCard
                key={user.memberId}
                user={user}
                showFollowButton
                onChatClick={() => handleChatClick(user)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

ExploreTab.displayName = 'ExploreTab'
