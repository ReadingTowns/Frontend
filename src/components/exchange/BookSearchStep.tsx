'use client'

/**
 * BookSearchStep Component
 * Step 1: 교환할 책 검색
 */

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useBookSearch } from '@/hooks/useBookhouse'
import type { BookSearchResult } from '@/types/exchange'

interface BookSearchStepProps {
  onBookSelect: (book: BookSearchResult) => void
}

export function BookSearchStep({ onBookSelect }: BookSearchStepProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // 디바운싱: 500ms 지연
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data, isLoading, error } = useBookSearch({
    query: debouncedQuery,
    page: 0,
    size: 20,
    enabled: debouncedQuery.length > 0,
  })

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-lg font-semibold text-gray-900">교환할 책 검색</h2>
        <p className="text-sm text-gray-500 mt-1">
          교환하고 싶은 책을 검색해보세요
        </p>
      </div>

      {/* 검색 입력 */}
      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="책 제목이나 저자로 검색"
            className="w-full pl-10 pr-4 py-2 bg-white
                     border border-gray-300
                     rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-400
                     text-gray-900
                     placeholder-gray-400"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="flex-1 overflow-y-auto">
        {!debouncedQuery ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">검색어를 입력해주세요</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            <p className="text-sm">검색 중 오류가 발생했습니다</p>
          </div>
        ) : !data || !Array.isArray(data) || data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">검색 결과가 없습니다</p>
          </div>
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
      </div>
    </div>
  )
}

BookSearchStep.displayName = 'BookSearchStep'
