'use client'

import { LibraryBook } from '@/types/home'

interface MyLibrarySectionProps {
  books: LibraryBook[]
  isLoading?: boolean
}

/**
 * 나의 서재 섹션 컴포넌트
 * - 최근 도서 6권 표시 (2x3 그리드)
 * - 책 표지, 제목, 카테고리 태그 표시
 * - 클릭 시 서재 상세 페이지로 이동
 */
export default function MyLibrarySection({
  books,
  isLoading,
}: MyLibrarySectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
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
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <p className="text-gray-500 text-sm">아직 등록된 도서가 없습니다</p>
      </div>
    )
  }

  // 최대 6권만 표시
  const displayBooks = books.slice(0, 6)

  return (
    <div className="grid grid-cols-2 gap-4">
      {displayBooks.map(book => (
        <div
          key={book.id}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          {/* 책 표지 */}
          <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2 overflow-hidden">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
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
            {book.title}
          </h3>

          {/* 카테고리 태그 */}
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                >
                  #{category}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

MyLibrarySection.displayName = 'MyLibrarySection'
