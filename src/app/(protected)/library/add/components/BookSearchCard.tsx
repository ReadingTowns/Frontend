'use client'

import { BookCard } from '@/components/books/BookCard'
import { GridBook } from '@/types/bookCard'
import type { BookSearchResult } from '@/types/book'

interface BookSearchCardProps {
  book: BookSearchResult
  onClick: (book: BookSearchResult) => void
}

export default function BookSearchCard({ book, onClick }: BookSearchCardProps) {
  return (
    <div onClick={() => onClick(book)} className="cursor-pointer">
      <BookCard
        variant="grid"
        book={
          {
            bookId: book.bookId,
            bookTitle: book.bookName,
            bookCoverImage: book.bookImage,
            author: book.author,
          } as GridBook
        }
        columns={2}
        aspectRatio="3/4"
        compact={false}
        onClick={() => onClick(book)}
      />
    </div>
  )
}
