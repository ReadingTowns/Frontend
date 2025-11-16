'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline'
import UserCard from '@/components/neighbors/UserCard'
import { SearchInput } from '@/components/common/SearchInput'
import { TabContainer, TabEmptyState, TabLoadingState } from './common'
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

export default function ExploreTab() {
  const [searchQuery, setSearchQuery] = useState('')

  // 추천 유저 조회
  // API endpoint doesn't exist yet - disabled for now
  const { data: recommendations, isLoading } = useQuery({
    queryKey: socialKeys.recommendations(),
    queryFn: async () => {
      return await api.get<User[]>('/api/v1/users/recommendations')
    },
    enabled: false, // Disabled: API endpoint not available yet
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

  const users = searchQuery ? searchResults || [] : recommendations || []
  const loading = searchQuery ? searchLoading : isLoading

  return (
    <TabContainer
      searchBar={
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="이웃 검색..."
          isLoading={searchLoading}
        />
      }
    >
      {loading ? (
        <TabLoadingState />
      ) : users.length === 0 ? (
        <TabEmptyState
          icon={searchQuery ? XCircleIcon : MagnifyingGlassIcon}
          title={searchQuery ? '검색 결과가 없습니다' : '이웃 찾기'}
          description={
            searchQuery
              ? '다른 검색어를 시도해보세요'
              : '검색을 통해 새로운 이웃을 찾아보세요'
          }
        />
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
    </TabContainer>
  )
}

ExploreTab.displayName = 'ExploreTab'
