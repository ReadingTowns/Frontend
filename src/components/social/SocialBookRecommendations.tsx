'use client'

/**
 * SocialBookRecommendations Component
 * 소셜 탭 전용 책 추천 컴포넌트 (책 교환용)
 * - 홈의 BookRecommendations 로직 재사용
 * - 교환 맥락에 맞는 제목과 메시지
 */

import { useRecommendBooks } from '@/hooks/useRecommendBooks'
import { BookCard } from '@/components/books/BookCard'
import { GridBook } from '@/types/bookCard'

export default function SocialBookRecommendations() {
  const { data, isLoading, error } = useRecommendBooks()

  if (isLoading) {
    return (
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">📚 추천 도서</h2>
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
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">📚 추천 도서</h2>
        <p className="text-gray-500">도서 추천을 불러올 수 없습니다</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">📚 추천 도서</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">아직 추천 도서가 없습니다</p>
          <p className="text-sm text-gray-400">
            독서 키워드를 설정하면 취향 맞는 책을 추천해드려요
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white">
      <div className="mb-4">
        <h2 className="text-xl font-bold">📚 추천 도서</h2>
        <p className="text-sm text-gray-600 mt-1">
          이런 책들은 어떠세요? 교환 요청해보세요!
        </p>
      </div>

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

SocialBookRecommendations.displayName = 'SocialBookRecommendations'
