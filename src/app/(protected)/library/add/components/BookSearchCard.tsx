'use client'

import Image from 'next/image'
import type { BookSearchResult } from '@/types/book'

interface BookSearchCardProps {
  book: BookSearchResult
  onClick: (book: BookSearchResult) => void
}

export default function BookSearchCard({ book, onClick }: BookSearchCardProps) {
  return (
    <button
      onClick={() => onClick(book)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="relative w-full aspect-[3/4]">
        <Image
          src={book.bookImage}
          alt={book.bookName}
          fill
          className="object-cover"
          sizes="(max-width: 430px) 50vw, 215px"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
          {book.bookName}
        </h3>
        <p className="text-xs text-gray-500">{book.author}</p>
      </div>
    </button>
  )
}
