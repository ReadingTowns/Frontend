'use client'

/**
 * BookSearchStep Component
 * Step 1: 교환할 책 검색
 */

import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useBookSearch } from '@/hooks/useBookhouse'
import {
  TabContainer,
  TabLoadingState,
  TabEmptyState,
} from '@/app/(protected)/social/components/common'
import { SearchInput } from '@/components/common/SearchInput'
import type { BookSearchResult } from '@/types/exchange'

interface BookSearchStepProps {
  onBookSelect: (book: BookSearchResult) => void
}

export function BookSearchStep({ onBookSelect }: BookSearchStepProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const { data, isLoading, error } = useBookSearch({
    query: debouncedQuery,
    page: 0,
    size: 20,
    enabled: debouncedQuery.length > 0,
  })

  // 검색 입력 컴포넌트
  const searchInput = (
    <SearchInput
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="책 제목이나 저자로 검색"
      debounceMs={500}
      onDebouncedChange={setDebouncedQuery}
    />
  )

  return (
    <TabContainer searchBar={searchInput}>
      {!debouncedQuery ? (
        <TabEmptyState
          icon={MagnifyingGlassIcon}
          title="검색어를 입력해주세요"
        />
      ) : isLoading ? (
        <TabLoadingState />
      ) : error ? (
        <TabEmptyState
          icon={ExclamationCircleIcon}
          title="검색 중 오류가 발생했습니다"
        />
      ) : !data || !Array.isArray(data) || data.length === 0 ? (
        <TabEmptyState
          icon={MagnifyingGlassIcon}
          title="검색 결과가 없습니다"
        />
      ) : (
        <div className="divide-y divide-border">
          {data.map(book => (
            <button
              key={book.bookId}
              onClick={() => onBookSelect(book)}
              className="w-full px-4 py-3 flex gap-3 hover:bg-gray-50
                       transition-colors text-left"
            >
              {/* 책 표지 */}
              <div className="relative w-12 h-16 flex-shrink-0">
                {book.bookImage ? (
                  <Image
                    src={book.bookImage}
                    alt={book.bookName}
                    fill
                    className="object-cover rounded shadow-sm"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">📖</span>
                  </div>
                )}
              </div>

              {/* 책 정보 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {book.bookName}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {book.author}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </TabContainer>
  )
}

BookSearchStep.displayName = 'BookSearchStep'
