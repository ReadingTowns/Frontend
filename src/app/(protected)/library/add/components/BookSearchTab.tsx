'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import BookSearchInput from './BookSearchInput'
import BookSearchGrid from './BookSearchGrid'
import { useBookSearch } from '@/hooks/useBookSearch'
import type { BookSearchResult } from '@/types/book'

interface BookSearchTabProps {
  onBookSelect: (book: BookSearchResult) => void
  onBack: () => void
}

export default function BookSearchTab({ onBookSelect }: BookSearchTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: books, isLoading, error } = useBookSearch(searchQuery)

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* 검색 입력 헤더 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <BookSearchInput
          onSearchChange={setSearchQuery}
          placeholder="책 제목을 입력하세요"
        />
      </div>

      {/* 검색 결과 영역 */}
      <div className="flex-1 overflow-y-auto">
        {/* 초기 상태 (검색 전) */}
        {!searchQuery && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <MagnifyingGlassIcon className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">책 제목을 검색하세요</p>
            <p className="text-sm mt-2">원하는 책을 찾아 서재에 등록해보세요</p>
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading && searchQuery && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-400" />
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-red-500 px-4">
            <p className="text-lg font-medium">검색 중 오류가 발생했습니다</p>
            <p className="text-sm mt-2 text-center">다시 시도해주세요</p>
          </div>
        )}

        {/* 검색 결과 없음 */}
        {books && books.length === 0 && searchQuery && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <BookOpenIcon className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">검색 결과가 없습니다</p>
            <p className="text-sm mt-2">다른 검색어로 시도해보세요</p>
          </div>
        )}

        {/* 검색 결과 */}
        {books && books.length > 0 && (
          <BookSearchGrid books={books} onBookSelect={onBookSelect} />
        )}
      </div>
    </div>
  )
}
