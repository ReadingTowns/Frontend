'use client'

import { useRecommendBooks } from '@/hooks/useRecommendBooks'
import { BookCard } from '@/components/books/BookCard'
import { GridBook } from '@/types/bookCard'

export default function BookRecommendations() {
  const { data, isLoading, error } = useRecommendBooks()

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">책 추천</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 h-48 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">책 추천</h2>
        <p className="text-gray-500">책 추천을 불러올 수 없습니다</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">책 추천</h2>
        <p className="text-gray-500">추천 도서가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">책 추천</h2>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {data.map(book => (
          <div key={book.bookId} className="flex-shrink-0 w-32">
            <BookCard
              variant="grid"
              book={
                {
                  ...book,
                  bookTitle: book.bookName,
                  bookCoverImage: book.bookImage,
                  relatedUserKeywords: book.relatedUserKeywords,
                  similarity: book.similarity,
                } as GridBook
              }
              columns={1}
              compact={true}
              aspectRatio="2/3"
              showSimilarity={true}
              showKeywords={true}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

BookRecommendations.displayName = 'BookRecommendations'
