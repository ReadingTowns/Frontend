'use client'

/**
 * OwnerSelectStep Component
 * Step 2: 책 소유자 선택
 */

import Image from 'next/image'
import { ChevronLeftIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { useBookOwners } from '@/hooks/useBookhouse'
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
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            책 소유자 선택
          </h2>
        </div>
        <p className="text-sm text-gray-500">
          이 책을 가진 사람들과 교환해보세요
        </p>
      </div>

      {/* 선택한 책 정보 */}
      <div className="px-4 py-3 bg-gray-50 border-b border-border">
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

      {/* 소유자 목록 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500 px-4">
            <p className="text-sm text-center">
              소유자 목록을 불러오는 중 오류가 발생했습니다
            </p>
          </div>
        ) : !owners || owners.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 px-4">
            <p className="text-sm text-center">이 책을 가진 사람이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {owners.map(owner => (
              <button
                key={owner.bookhouseId}
                onClick={() => onOwnerSelect(owner)}
                className="w-full px-4 py-3 flex gap-3 hover:bg-gray-50
                         transition-colors text-left"
              >
                {/* 프로필 이미지 */}
                <div className="relative w-12 h-12 flex-shrink-0">
                  {owner.profileImage ? (
                    <Image
                      src={owner.profileImage}
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
      </div>
    </div>
  )
}

OwnerSelectStep.displayName = 'OwnerSelectStep'
