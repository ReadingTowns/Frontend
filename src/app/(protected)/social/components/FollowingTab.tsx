'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserGroupIcon, XCircleIcon } from '@heroicons/react/24/outline'
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
    staleTime: 0, // 캐시 없음 - 항상 최신 데이터
    refetchOnMount: 'always', // 컴포넌트 마운트 시 항상 재요청
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

  const users = searchQuery ? searchResults || [] : following || []
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
          icon={searchQuery ? XCircleIcon : UserGroupIcon}
          title={
            searchQuery ? '검색 결과가 없습니다' : '팔로우 중인 이웃이 없습니다'
          }
          description={
            searchQuery
              ? '다른 검색어를 시도해보세요'
              : '이웃을 검색하여 팔로우해보세요'
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

FollowingTab.displayName = 'FollowingTab'
