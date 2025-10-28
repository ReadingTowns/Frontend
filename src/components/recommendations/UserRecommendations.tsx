'use client'

import { useState } from 'react'
import { useRecommendUsers } from '@/hooks/useRecommendUsers'
import Link from 'next/link'

type FilterType = 'taste' | 'local'

export default function UserRecommendations() {
  const [filter, setFilter] = useState<FilterType>('taste')
  const { data, isLoading, error } = useRecommendUsers(filter)

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">사용자 추천</h2>
          <FilterButtons filter={filter} setFilter={setFilter} />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-40 h-40 bg-gray-200 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">사용자 추천</h2>
          <FilterButtons filter={filter} setFilter={setFilter} />
        </div>
        <p className="text-gray-500">사용자 추천을 불러올 수 없습니다</p>
      </div>
    )
  }

  if (!data?.result || data.result.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">사용자 추천</h2>
          <FilterButtons filter={filter} setFilter={setFilter} />
        </div>
        <p className="text-gray-500">추천 사용자가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">사용자 추천</h2>
        <FilterButtons filter={filter} setFilter={setFilter} />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {data.result.map(user => (
          <Link
            key={user.memberId}
            href={`/social/${user.memberId}`}
            className="flex-shrink-0 w-40"
          >
            <img
              src={user.profileImage}
              alt={user.nickname}
              className="w-40 h-40 object-cover rounded-full"
            />
            <p className="text-sm font-medium mt-2 text-center">
              {user.nickname}
            </p>

            {/* 추천 이유 - 취향 필터일 때만 표시 */}
            {filter === 'taste' && (
              <div className="text-xs text-gray-600 mt-1">
                {user.matchedKeywords && user.matchedKeywords.length > 0 && (
                  <p className="line-clamp-1">
                    키워드: {user.matchedKeywords.join(', ')}
                  </p>
                )}
                {user.matchedBooks && user.matchedBooks.length > 0 && (
                  <p className="line-clamp-1">
                    책: {user.matchedBooks.join(', ')}
                  </p>
                )}
                {(!user.matchedKeywords || user.matchedKeywords.length === 0) &&
                  (!user.matchedBooks || user.matchedBooks.length === 0) && (
                    <p className="text-gray-400">취향이 비슷해요</p>
                  )}
              </div>
            )}

            {/* 동네 필터일 때 거리 표시 */}
            {filter === 'local' && user.distance && (
              <p className="text-xs text-gray-600 mt-1 text-center">
                {user.distance}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

function FilterButtons({
  filter,
  setFilter,
}: {
  filter: FilterType
  setFilter: (filter: FilterType) => void
}) {
  return (
    <div className="flex gap-2">
      <button
        className={`px-3 py-1 rounded-full text-sm ${
          filter === 'taste'
            ? 'bg-primary-400 text-white'
            : 'bg-gray-100 text-gray-700'
        }`}
        onClick={() => setFilter('taste')}
      >
        취향
      </button>
      <button
        className={`px-3 py-1 rounded-full text-sm ${
          filter === 'local'
            ? 'bg-primary-400 text-white'
            : 'bg-gray-100 text-gray-700'
        }`}
        onClick={() => setFilter('local')}
      >
        동네
      </button>
    </div>
  )
}

FilterButtons.displayName = 'FilterButtons'
UserRecommendations.displayName = 'UserRecommendations'
