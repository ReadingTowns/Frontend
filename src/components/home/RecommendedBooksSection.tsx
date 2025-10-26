'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useBookRecommendations } from '@/hooks/useBookRecommendations'

interface RecommendedBooksSectionProps {
  /**
   * 섹션 제목
   */
  title?: string
  /**
   * 표시할 최대 책 개수 (전체 목록: undefined)
   */
  limit?: number
  /**
   * 더보기 버튼 표시 여부
   */
  showMoreButton?: boolean
}

/**
 * 추천 도서 섹션 컴포넌트
 * - 사용자 맞춤 추천 도서 목록 표시
 * - 로딩/에러/빈 상태 처리
 * - 책 커버 이미지와 정보 표시
 */
export default function RecommendedBooksSection({
  title = '추천 도서',
  limit,
  showMoreButton = false,
}: RecommendedBooksSectionProps) {
  const {
    data: recommendations = [],
    isLoading,
    error,
  } = useBookRecommendations()

  // 표시할 책 목록 (limit이 있으면 제한)
  const displayBooks = limit ? recommendations.slice(0, limit) : recommendations

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(limit || 6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-1" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">추천 도서를 불러오지 못했습니다</p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary-600 hover:underline text-sm"
        >
          다시 시도
        </button>
      </div>
    )
  }

  // 빈 상태
  if (displayBooks.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">추천 도서가 없습니다</p>
        <p className="text-sm text-gray-400 mt-1">
          서재에 책을 추가하면 맞춤 추천을 받을 수 있습니다
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 섹션 헤더 */}
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          {showMoreButton && recommendations.length > (limit || 0) && (
            <Link
              href="/home?tab=recommendations"
              className="text-sm text-primary-600 hover:underline"
            >
              더보기
            </Link>
          )}
        </div>
      )}

      {/* 책 그리드 */}
      <div className="grid grid-cols-3 gap-4">
        {displayBooks.map(book => (
          <Link
            key={book.bookId}
            href={`/books/${book.bookId}`}
            className="group block"
          >
            {/* 책 커버 */}
            <div className="relative aspect-[2/3] mb-2 overflow-hidden rounded-lg bg-gray-100">
              {book.bookCoverImage ? (
                <Image
                  src={book.bookCoverImage}
                  alt={book.bookTitle}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 430px) 33vw, 143px"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary-100 to-secondary-100">
                  <div className="text-center px-2">
                    <p className="text-xs text-gray-600 font-medium line-clamp-3">
                      {book.bookTitle}
                    </p>
                    {book.matchScore && (
                      <p className="text-xs text-primary-600 mt-1">
                        {book.matchScore.toFixed(1)}% 매칭
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 책 정보 */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary-600">
                {book.bookTitle}
              </h4>
              <p className="text-xs text-gray-500 truncate">{book.author}</p>
              {book.reason && (
                <p className="text-xs text-primary-600 line-clamp-1">
                  {book.reason}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

RecommendedBooksSection.displayName = 'RecommendedBooksSection'
