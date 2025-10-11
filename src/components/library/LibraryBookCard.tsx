'use client'

import { LibraryBook } from '@/types/library'
import Link from 'next/link'
import { useState } from 'react'
import { EllipsisVerticalIcon, BookOpenIcon } from '@heroicons/react/24/outline'

interface LibraryBookCardProps {
  book: LibraryBook
  onDelete?: (bookId: string) => void
  onReviewClick?: (bookId: string, bookTitle: string) => void
  showActions?: boolean
  isOwner?: boolean
}

export function LibraryBookCard({
  book,
  onDelete,
  onReviewClick,
  showActions = true,
  isOwner = true,
}: LibraryBookCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(book.id)
    }
    setShowMenu(false)
  }

  const handleReviewClick = () => {
    if (onReviewClick) {
      onReviewClick(book.id, book.title)
    }
    setShowMenu(false)
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Book Image */}
      <div
        className="w-full h-32 bg-cover bg-center bg-gray-100 rounded mb-3 relative"
        style={{
          backgroundImage: book.image ? `url(${book.image})` : 'none',
        }}
      >
        {!book.image && (
          <div className="w-full h-full bg-gradient-to-br from-primary-300 to-secondary-300 rounded flex items-center justify-center">
            <BookOpenIcon className="w-8 h-8 text-white" />
          </div>
        )}

        {/* Actions Menu for Owner */}
        {showActions && isOwner && (
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
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-xs text-gray-600">{book.authorName}</p>
      </div>

      {/* Action Buttons for non-owner */}
      {!isOwner && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <Link
            href={`/bookstore/${book.id}`}
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
