'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { BookCardGridProps } from '@/types/bookCard'
import { BookImage } from './BookImage'
import { BookMetadata } from './BookMetadata'
import { StatusBadge } from '@/components/library/StatusBadge'

/**
 * BookCard Grid Variant
 * - 서재, 추천, 검색, 교환 도서에 사용
 * - 3열 / 2열 / 1열 그리드 지원
 * - 액션 메뉴, 유사도, 키워드, 상태 배지 옵션
 */
export function BookCardGrid({
  book,
  compact = false,
  aspectRatio = '2/3',
  showActions = false,
  showSimilarity = false,
  showKeywords = false,
  showCategories = false,
  showStatus = false,
  showPartner = false,
  isOwner = true,
  ownerId,
  onClick,
  onActionClick,
  onExchangeRequest,
}: BookCardGridProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleCardClick = () => {
    if (onClick) {
      onClick(book)
    } else {
      // 기본 동작: 책 상세 페이지로 이동
      if (!isOwner && ownerId) {
        router.push(`/books/${book.bookId}?from=library&ownerId=${ownerId}`)
      } else {
        router.push(`/books/${book.bookId}`)
      }
    }
  }

  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleActionClick = (
    e: React.MouseEvent,
    action: 'review' | 'delete'
  ) => {
    e.stopPropagation()
    onActionClick?.(action, book)
    setShowMenu(false)
  }

  const handleExchangeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onExchangeRequest && book.bookhouseId) {
      onExchangeRequest(book.bookId, book.bookhouseId, book.bookTitle)
    }
  }

  return (
    <div className="relative cursor-pointer group" onClick={handleCardClick}>
      {/* Book Image Container */}
      <div className="relative mb-2">
        <BookImage
          src={book.bookCoverImage}
          alt={book.bookTitle}
          aspectRatio={aspectRatio}
          fallbackVariant="title"
          title={book.bookTitle}
          size={compact ? 'small' : 'medium'}
        />

        {/* Status Badge (교환 중/대기 상태) */}
        {showStatus && book.statusLabel && book.statusColor && (
          <div className="absolute top-2 right-2">
            <StatusBadge label={book.statusLabel} color={book.statusColor} />
          </div>
        )}

        {/* Actions Menu (서재 점 3개 메뉴) */}
        {showActions && isOwner && !book.statusLabel && (
          <div className="absolute top-2 right-2">
            <button
              onClick={handleMenuButtonClick}
              className="w-6 h-6 bg-white bg-opacity-80 rounded-full flex items-center justify-center text-gray-600 hover:bg-opacity-100 transition-colors"
              aria-label="액션 메뉴"
            >
              <EllipsisVerticalIcon className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                <button
                  onClick={e => handleActionClick(e, 'review')}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  감상평 작성
                </button>
                <button
                  onClick={e => handleActionClick(e, 'delete')}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Book Metadata */}
      <BookMetadata
        title={book.bookTitle}
        author={book.author}
        compact={compact}
        showSimilarity={showSimilarity}
        similarity={book.similarity}
        showKeywords={showKeywords}
        keywords={book.relatedUserKeywords}
        showCategories={showCategories}
        categories={book.categories}
        showPartner={showPartner}
        partnerNickname={book.partnerNickname}
      />

      {/* Action Buttons (다른 유저 서재에서 교환 신청) */}
      {!isOwner && onExchangeRequest && ownerId && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex gap-2">
          <button
            onClick={handleExchangeClick}
            className="flex-1 text-xs bg-primary-400 text-white px-3 py-2 rounded-lg font-medium hover:bg-primary-500 transition-colors"
          >
            교환 신청
          </button>
        </div>
      )}

      {/* Close menu overlay */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={e => {
            e.stopPropagation()
            setShowMenu(false)
          }}
        />
      )}
    </div>
  )
}

BookCardGrid.displayName = 'BookCardGrid'
