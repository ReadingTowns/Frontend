'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserGroupIcon, XCircleIcon } from '@heroicons/react/24/outline'
import UserCard from '@/components/neighbors/UserCard'
import UserSearch from '@/components/neighbors/UserSearch'
import { socialKeys } from '@/types/social'
import { api } from '@/lib/api'

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

export default function FollowingTab() {
  const [searchQuery, setSearchQuery] = useState('')

  // 팔로잉 리스트 조회
  const { data: following, isLoading } = useQuery({
    queryKey: socialKeys.following(),
    queryFn: async () => {
      const users = await api.get<User[]>('/api/v1/members/me/following')
      // 팔로잉 리스트의 모든 유저는 이미 팔로우 상태
      return users.map(user => ({ ...user, followed: true, isFollowing: true }))
    },
    enabled: !searchQuery,
  })

  // 검색 결과 조회
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: socialKeys.search(searchQuery),
    queryFn: async () => {
      return await api.get<User[]>('/api/v1/members/search', {
        nickname: searchQuery,
      })
    },
    enabled: searchQuery.length >= 2,
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const users = searchQuery ? searchResults || [] : following || []
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
                <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg mb-2">팔로우 중인 이웃이 없습니다</p>
                <p className="text-sm">이웃을 검색하여 팔로우해보세요</p>
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
                showLibraryButton
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

FollowingTab.displayName = 'FollowingTab'
