'use client'

import { useRecommendBooks } from '@/hooks/useRecommendBooks'
import Link from 'next/link'

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
          <Link
            key={book.bookId}
            href={`/books/${book.bookId}`}
            className="flex-shrink-0 w-32 group"
          >
            {/* 책 이미지 */}
            <div className="relative w-32 h-48 mb-2 overflow-hidden rounded-lg bg-gray-100">
              {book.bookImage ? (
                <img
                  src={book.bookImage}
                  alt={book.bookName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                  <div className="text-center px-2">
                    <p className="text-xs text-gray-600 font-medium line-clamp-4">
                      {book.bookName}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 책 정보 */}
            <div className="space-y-1">
              <p className="text-sm font-medium line-clamp-2 group-hover:text-primary-600">
                {book.bookName}
              </p>
              <p className="text-xs text-gray-500 truncate">{book.author}</p>

              {/* 유사도 */}
              <p className="text-xs text-primary-600 font-medium">
                유사도: {(book.similarity * 10).toFixed(1)}%
              </p>

              {/* 매칭된 키워드 */}
              {book.relatedUserKeywords &&
                book.relatedUserKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {book.relatedUserKeywords
                      .slice(0, 2)
                      .map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    {book.relatedUserKeywords.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{book.relatedUserKeywords.length - 2}
                      </span>
                    )}
                  </div>
                )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

BookRecommendations.displayName = 'BookRecommendations'
