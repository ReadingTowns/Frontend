'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline'
import UserCard from '@/components/neighbors/UserCard'
import { SearchInput } from '@/components/common/SearchInput'
import { TabContainer, TabEmptyState, TabLoadingState } from './common'
import { socialKeys } from '@/types/social'
import { api } from '@/lib/api'
import UserRecommendations from '@/components/recommendations/UserRecommendations'

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
      {/* 검색어 없을 때: 추천 이웃 표시 */}
      {!searchQuery && (
        <UserRecommendations
          title="🎯 추천 이웃"
          linkPath="library"
          emptyMessage="아직 추천 이웃이 없습니다. 독서 키워드를 설정하면 취향 맞는 이웃을 추천해드려요."
        />
      )}

      {/* 검색 중 */}
      {searchQuery && searchLoading && <TabLoadingState />}

      {/* 검색 결과 없음 */}
      {searchQuery &&
        !searchLoading &&
        (!searchResults || searchResults.length === 0) && (
          <TabEmptyState
            icon={XCircleIcon}
            title="검색 결과가 없습니다"
            description="다른 검색어를 시도해보세요"
          />
        )}

      {/* 검색 결과 있음 */}
      {searchQuery && searchResults && searchResults.length > 0 && (
        <div className="p-4 space-y-3">
          {searchResults.map(user => (
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
