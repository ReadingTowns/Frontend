'use client'

/**
 * OwnerSelectStep Component
 * Step 2: 책 소유자 선택
 */

import Image from 'next/image'
import { ChevronLeftIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { useBookOwners } from '@/hooks/useBookhouse'
import { getAbsoluteImageUrl } from '@/lib/imageUtils'
import {
  TabContainer,
  TabLoadingState,
  TabEmptyState,
} from '@/app/(protected)/social/components/common'
import type { BookSearchResult, BookhouseOwner } from '@/types/exchange'

interface OwnerSelectStepProps {
  selectedBook: BookSearchResult
  onOwnerSelect: (owner: BookhouseOwner) => void
  onBack: () => void
}

export function OwnerSelectStep({
  selectedBook,
  onOwnerSelect,
  onBack,
}: OwnerSelectStepProps) {
  const { data: owners, isLoading, error } = useBookOwners(selectedBook.bookId)

  return (
    <>
      {/* 뒤로가기 버튼 */}
      <div className="px-4 py-3 border-b border-border bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">뒤로가기</span>
        </button>
      </div>

      <TabContainer>
        {/* 선택한 책 정보 - 카드 형태로 */}
        <div className="p-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-border">
            <p className="text-xs text-gray-500 mb-2">선택한 책</p>
            <div className="flex gap-3">
              <div className="relative w-12 h-16 flex-shrink-0">
                {selectedBook.bookImage ? (
                  <Image
                    src={selectedBook.bookImage}
                    alt={selectedBook.bookName}
                    fill
                    className="object-cover rounded shadow-sm"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">📖</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {selectedBook.bookName}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {selectedBook.author}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 소유자 목록 */}
        {isLoading ? (
          <TabLoadingState message="소유자 목록을 불러오는 중..." />
        ) : error ? (
          <TabEmptyState
            icon={ChevronLeftIcon}
            title="소유자 목록을 불러오는 중 오류가 발생했습니다"
          />
        ) : !owners || owners.length === 0 ? (
          <TabEmptyState
            icon={ChevronLeftIcon}
            title="이 책을 가진 사람이 없습니다"
            description="다른 책을 검색해보세요"
          />
        ) : (
          <div className="p-4 space-y-3">
            {owners.map(owner => (
              <button
                key={owner.bookhouseId}
                onClick={() => onOwnerSelect(owner)}
                className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md
                         transition-all flex gap-3 text-left"
              >
                {/* 프로필 이미지 */}
                <div className="relative w-12 h-12 flex-shrink-0">
                  {owner.profileImage ? (
                    <Image
                      src={getAbsoluteImageUrl(owner.profileImage) || ''}
                      alt={owner.memberName}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-400 text-lg">👤</span>
                    </div>
                  )}
                </div>

                {/* 유저 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {owner.memberName}
                    </p>
                    {owner.isFollowing && (
                      <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-600 rounded">
                        팔로잉
                      </span>
                    )}
                  </div>

                  {/* 별점 */}
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const filled = i < Math.floor(owner.starRating)
                      return filled ? (
                        <StarIconSolid
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                        />
                      ) : (
                        <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                      )
                    })}
                    <span className="text-xs text-gray-500 ml-1">
                      {owner.starRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </TabContainer>
    </>
  )
}

OwnerSelectStep.displayName = 'OwnerSelectStep'
