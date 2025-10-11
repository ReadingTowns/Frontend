import {
  SparklesIcon,
  BookOpenIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

interface RecommendedBook {
  id: number
  title: string
  author: string
  image?: string
  reason: string
  categories: string[]
  rating?: number
}

interface BookRecommendationsProps {
  books?: RecommendedBook[]
  isLoading?: boolean
}

export default function BookRecommendations({
  books = [],
  isLoading,
}: BookRecommendationsProps) {
  const handleBookClick = (bookId: number) => {
    // TODO: 책 상세 페이지로 이동
    console.log('책 상세 보기:', bookId)
  }

  if (isLoading) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">오늘의 추천 도서</h2>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-16 h-24 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                    <div className="h-5 bg-gray-200 rounded w-10"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (books.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">오늘의 추천 도서</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-center py-8 text-gray-500">
            <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>추천할 도서가 없어요</p>
            <p className="text-sm mt-1">더 많은 책을 읽고 평가해보세요!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">오늘의 추천 도서</h2>
      <div className="space-y-3">
        {books.map(book => (
          <div
            key={book.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleBookClick(book.id)}
          >
            <div className="flex gap-4">
              <div className="w-16 h-24 bg-gradient-to-br from-primary-300 to-secondary-300 rounded overflow-hidden flex-shrink-0">
                {book.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.image}
                    alt={`${book.title} 표지`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <BookOpenIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  AI 추천 이유: {book.reason}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {book.categories.map(category => (
                    <span
                      key={category}
                      className="inline-block px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                {book.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {book.rating}/5
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
