'use client'

import { LibraryBook } from '@/types/library'
import Link from 'next/link'
import { useState } from 'react'
import { EllipsisVerticalIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { StatusBadge } from './StatusBadge'
import { CategoryTags } from './CategoryTags'

interface LibraryBookCardProps {
  book: LibraryBook
  onDelete?: (bookId: string) => void
  onReviewClick?: (bookId: string, bookTitle: string) => void
  showActions?: boolean
  isOwner?: boolean
  compact?: boolean // 3열 모드
}

export function LibraryBookCard({
  book,
  onDelete,
  onReviewClick,
  showActions = true,
  isOwner = true,
  compact = false,
}: LibraryBookCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(String(book.bookId))
    }
    setShowMenu(false)
  }

  const handleReviewClick = () => {
    if (onReviewClick) {
      onReviewClick(String(book.bookId), book.bookName)
    }
    setShowMenu(false)
  }

  return (
    <div className="relative">
      {/* Book Image with Aspect Ratio */}
      <div
        className={`w-full ${compact ? 'aspect-[2/3]' : 'h-40'} bg-cover bg-center bg-gray-200 rounded-lg relative mb-2`}
        style={{
          backgroundImage: book.bookImage ? `url(${book.bookImage})` : 'none',
        }}
      >
        {!book.bookImage && (
          <div className="w-full h-full bg-gradient-to-br from-primary-300 to-secondary-300 rounded-lg flex items-center justify-center">
            <BookOpenIcon
              className={compact ? 'w-6 h-6 text-white' : 'w-8 h-8 text-white'}
            />
          </div>
        )}

        {/* Status Badge (if exists) */}
        {book.statusLabel && book.statusColor && (
          <div className="absolute top-2 right-2">
            <StatusBadge label={book.statusLabel} color={book.statusColor} />
          </div>
        )}

        {/* Actions Menu for Owner (점 3개) */}
        {showActions && isOwner && !book.statusLabel && (
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-6 h-6 bg-white bg-opacity-80 rounded-full flex items-center justify-center text-gray-600 hover:bg-opacity-100 transition-colors"
            >
              <EllipsisVerticalIcon className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                <button
                  onClick={handleReviewClick}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  감상평 작성
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="space-y-1">
        <h3
          className={`font-medium ${compact ? 'text-xs' : 'text-sm'} text-gray-900 line-clamp-1`}
        >
          {book.bookName}
        </h3>

        {/* Category Tags */}
        {book.categories && (
          <CategoryTags categories={book.categories} maxDisplay={2} />
        )}
      </div>

      {/* Action Buttons for non-owner */}
      {!isOwner && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <Link
            href={`/bookstore/${book.bookId}`}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            자세히 보기
          </Link>
        </div>
      )}

      {/* Close menu when clicking outside */}
      {showMenu && (
        <div className="fixed inset-0 z-5" onClick={() => setShowMenu(false)} />
      )}
    </div>
  )
}
