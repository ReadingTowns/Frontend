'use client'

/**
 * SelectableBookCard Component
 * 교환할 내 책 선택을 위한 라디오 버튼 포함 책 카드
 * - BookCardGrid 스타일 재사용
 * - 라디오 버튼 선택 UI
 * - 선택 상태 시각적 피드백
 */

import { BookImage } from '@/components/books/BookImage'
import { BookMetadata } from '@/components/books/BookMetadata'
import type { LibraryBook } from '@/types/library'

interface SelectableBookCardProps {
  book: LibraryBook
  isSelected: boolean
  onSelect: (bookhouseId: number) => void
  disabled?: boolean
}

export function SelectableBookCard({
  book,
  isSelected,
  onSelect,
  disabled = false,
}: SelectableBookCardProps) {
  const handleClick = () => {
    if (!disabled) {
      onSelect(book.bookhouseId)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        relative cursor-pointer rounded-lg p-3 transition-all
        ${
          isSelected
            ? 'bg-primary-50 border-2 border-primary-400'
            : 'bg-white border-2 border-transparent hover:border-gray-200'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {/* Radio Button */}
      <div className="absolute top-3 right-3 z-10">
        <input
          type="radio"
          checked={isSelected}
          onChange={() => onSelect(book.bookhouseId)}
          disabled={disabled}
          className="w-5 h-5 text-primary-400 border-gray-300 focus:ring-primary-400 cursor-pointer disabled:cursor-not-allowed"
          onClick={e => e.stopPropagation()}
        />
      </div>

      {/* Book Image */}
      <div className="mb-2">
        <BookImage
          src={book.bookImage}
          alt={book.bookName}
          aspectRatio="2/3"
          fallbackVariant="title"
          title={book.bookName}
          size="small"
        />
      </div>

      {/* Book Metadata */}
      <BookMetadata
        title={book.bookName}
        author={book.author}
        compact={true}
        showCategories={true}
        categories={book.categories}
      />
    </div>
  )
}

SelectableBookCard.displayName = 'SelectableBookCard'
