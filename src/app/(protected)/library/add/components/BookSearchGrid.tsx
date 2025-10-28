'use client'

import type { BookSearchResult } from '@/types/book'
import BookSearchCard from './BookSearchCard'

interface BookSearchGridProps {
  books: BookSearchResult[]
  onBookSelect: (book: BookSearchResult) => void
}

export default function BookSearchGrid({
  books,
  onBookSelect,
}: BookSearchGridProps) {
  if (books.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {books.map(book => (
        <BookSearchCard key={book.bookId} book={book} onClick={onBookSelect} />
      ))}
    </div>
  )
}
