'use client'

import { useState } from 'react'
import { useRecommendUsers } from '@/hooks/useRecommendUsers'
import Link from 'next/link'
import {
  MapPinIcon,
  ClockIcon,
  BookOpenIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

type FilterType = 'taste' | 'local'

export default function UserRecommendations() {
  const [filter, setFilter] = useState<FilterType>('taste')
  const { data, isLoading, error } = useRecommendUsers(filter)

  if (isLoading) {
    return (
      <div className="p-4 bg-white">
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
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">사용자 추천</h2>
          <FilterButtons filter={filter} setFilter={setFilter} />
        </div>
        <p className="text-gray-500">사용자 추천을 불러올 수 없습니다</p>
      </div>
    )
  }

  // api.ts가 자동으로 result를 추출해서 반환하므로 data가 직접 배열
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">사용자 추천</h2>
          <FilterButtons filter={filter} setFilter={setFilter} />
        </div>
        <p className="text-gray-500">추천 사용자가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">사용자 추천</h2>
        <FilterButtons filter={filter} setFilter={setFilter} />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {data.map(user => (
          <Link
            key={user.memberId}
            href={`/social/${user.memberId}`}
            className="flex-shrink-0 w-48 border border-gray-200 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-4 flex flex-col h-[320px]">
              {/* Section 1: 프로필 이미지와 유사도 (고정 높이) */}
              <div className="relative mb-3">
                <div className="w-32 h-32 mx-auto">
                  <img
                    src={user.profileImage}
                    alt={user.nickname}
                    className="w-full h-full object-cover rounded-full border-4 border-primary-400"
                  />
                </div>
                {user.similarity !== undefined && (
                  <span className="absolute -top-2 -right-2 bg-primary-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {(user.similarity * 100).toFixed(0)}%
                  </span>
                )}
              </div>

              {/* Section 2: 기본 정보 (고정 높이) */}
              <div className="flex-shrink-0 mb-3 h-[24px]">
                {/* 닉네임과 평점을 한 줄에 표시 */}
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.nickname}
                  </p>
                  {user.userRating !== null &&
                    user.userRating !== undefined && (
                      <div className="flex items-center">
                        <StarIconSolid className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-xs text-gray-600 ml-0.5">
                          {user.userRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Section 3: 위치 및 시간 정보 (고정 높이) */}
              <div className="flex-shrink-0 space-y-1 mb-3 h-[40px]">
                {/* 동네 정보 - 항상 표시 */}
                <div className="flex items-center text-xs text-gray-500">
                  <MapPinIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  <span className="line-clamp-1">
                    {user.currentTown || '동네 정보 없음'}
                  </span>
                </div>

                {/* 교환 가능 시간 - 항상 표시 */}
                <div className="flex items-center text-xs text-primary-600">
                  <ClockIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  <span>{user.availableTime || '시간 협의'}</span>
                </div>
              </div>

              {/* Section 4: 매칭 정보 (가변 높이, flex-grow로 하단 정렬) */}
              <div className="flex-grow flex flex-col justify-end">
                {/* 추천 이유 - 취향 필터일 때 */}
                {filter === 'taste' && (
                  <div className="border-t border-gray-100 pt-2 min-h-[60px]">
                    {user.matchedKeywords && user.matchedKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {user.matchedKeywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-primary-50 text-primary-700 rounded text-[10px] font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="h-[20px]" /> // 키워드 영역 높이 유지
                    )}

                    {user.matchedBooks && user.matchedBooks.length > 0 ? (
                      <div className="flex items-start text-[11px] text-gray-600 mt-1">
                        <BookOpenIcon className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {user.matchedBooks.join(', ')}
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-[11px] text-center mt-1">
                        취향이 비슷해요
                      </p>
                    )}
                  </div>
                )}

                {/* 동네 필터일 때 거리 표시 */}
                {filter === 'local' && (
                  <div className="border-t border-gray-100 pt-2 min-h-[40px] flex items-center justify-center">
                    <p className="text-xs text-primary-600 text-center font-medium">
                      {user.distance || '거리 정보 없음'}
                    </p>
                  </div>
                )}
              </div>
            </div>
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
