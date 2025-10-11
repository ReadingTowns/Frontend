'use client'

import { ExchangedBook } from '@/types/home'

interface ExchangedBooksSectionProps {
  books: ExchangedBook[]
  isLoading?: boolean
}

/**
 * 교환한 도서 섹션 컴포넌트
 * - 최근 교환한 도서 3권 표시
 * - 책 표지, 제목, 교환 상대 닉네임, 교환 날짜 표시
 */
export default function ExchangedBooksSection({
  books,
  isLoading,
}: ExchangedBooksSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-1" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (!books || books.length === 0) {
    return (
      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <p className="text-gray-500 text-sm">아직 교환한 도서가 없습니다</p>
      </div>
    )
  }

  // 최근 3권만 표시
  const displayBooks = books.slice(0, 3)

  return (
    <div className="grid grid-cols-3 gap-4">
      {displayBooks.map(book => (
        <div
          key={book.exchangeId}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          {/* 책 표지 */}
          <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2 overflow-hidden">
            {book.bookCoverImage ? (
              <img
                src={book.bookCoverImage}
                alt={book.bookTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                표지 없음
              </div>
            )}
          </div>

          {/* 책 제목 */}
          <h3 className="text-sm font-medium line-clamp-2 mb-1">
            {book.bookTitle}
          </h3>

          {/* 교환 상대 정보 */}
          <p className="text-xs text-gray-500">
            {book.partnerNickname}님과 교환
          </p>
        </div>
      ))}
    </div>
  )
}

ExchangedBooksSection.displayName = 'ExchangedBooksSection'
