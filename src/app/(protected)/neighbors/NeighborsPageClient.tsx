'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import UserSearch from '@/components/neighbors/UserSearch'
import UserCard from '@/components/neighbors/UserCard'
import UserTabs from '@/components/neighbors/UserTabs'
import NeighborsHeader from '@/components/layout/NeighborsHeader'
import { useHeader } from '@/contexts/HeaderContext'

type TabType = 'recommend' | 'following' | 'followers'

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

export default function NeighborsPageClient() {
  const [activeTab, setActiveTab] = useState<TabType>('recommend')
  const [searchQuery, setSearchQuery] = useState('')
  const { setHeaderContent } = useHeader()

  // 헤더 설정
  useEffect(() => {
    setHeaderContent(<NeighborsHeader />)

    // cleanup
    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent])

  // 추천 유저 조회
  const { data: recommendations, isLoading: recommendLoading } = useQuery({
    queryKey: ['users', 'recommendations'],
    queryFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const res = await fetch(`${backendUrl}/api/v1/users/recommendations`)
      if (!res.ok) throw new Error('Failed to fetch recommendations')
      const data = await res.json()
      return data.result as User[]
    },
    enabled: activeTab === 'recommend' && !searchQuery,
  })

  // 팔로잉 리스트 조회
  const { data: following, isLoading: followingLoading } = useQuery({
    queryKey: ['users', 'following'],
    queryFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const res = await fetch(`${backendUrl}/api/v1/members/me/following`)
      if (!res.ok) throw new Error('Failed to fetch following')
      const data = await res.json()
      return data.result as User[]
    },
    enabled: activeTab === 'following' && !searchQuery,
  })

  // 팔로워 리스트 조회
  const { data: followers, isLoading: followersLoading } = useQuery({
    queryKey: ['users', 'followers'],
    queryFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const res = await fetch(`${backendUrl}/api/v1/members/me/followers`)
      if (!res.ok) throw new Error('Failed to fetch followers')
      const data = await res.json()
      return data.result as User[]
    },
    enabled: activeTab === 'followers' && !searchQuery,
  })

  // 검색 결과 조회
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['users', 'search', searchQuery],
    queryFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const res = await fetch(
        `${backendUrl}/api/v1/members/search?nickname=${searchQuery}`
      )
      if (!res.ok) throw new Error('Failed to search users')
      const data = await res.json()
      return data.result as User[]
    },
    enabled: !!searchQuery,
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSearchQuery('') // 탭 변경 시 검색어 초기화
  }

  // 현재 표시할 유저 리스트 결정
  let users: User[] = []
  let isLoading = false

  if (searchQuery) {
    users = searchResults || []
    isLoading = searchLoading
  } else {
    switch (activeTab) {
      case 'recommend':
        users = recommendations || []
        isLoading = recommendLoading
        break
      case 'following':
        users = following || []
        isLoading = followingLoading
        break
      case 'followers':
        users = followers || []
        isLoading = followersLoading
        break
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* 검색바 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <UserSearch onSearch={handleSearch} />
      </div>

      {/* 탭 네비게이션 */}
      {!searchQuery && (
        <div className="bg-white border-b border-gray-200">
          <UserTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}

      {/* 유저 리스트 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
            <p className="mt-4">불러오는 중...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? (
              <>
                <p className="text-lg mb-2">검색 결과가 없습니다</p>
                <p className="text-sm">다른 검색어를 시도해보세요</p>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">
                  {activeTab === 'recommend' && '추천할 이웃이 없습니다'}
                  {activeTab === 'following' && '팔로우 중인 이웃이 없습니다'}
                  {activeTab === 'followers' && '팔로워가 없습니다'}
                </p>
                <p className="text-sm">
                  {activeTab === 'recommend' &&
                    '곧 새로운 이웃이 추가될 예정입니다'}
                  {activeTab === 'following' &&
                    '이웃을 검색하여 팔로우해보세요'}
                  {activeTab === 'followers' &&
                    '활동을 시작하면 팔로워가 생길 거예요'}
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {users.map(user => (
              <UserCard
                key={user.memberId || Math.random()}
                user={user}
                showFollowButton
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
