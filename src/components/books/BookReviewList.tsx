'use client'

import { useBookReviews } from '@/hooks/useBookDetail'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface BookReviewListProps {
  bookId: string
}

export default function BookReviewList({ bookId }: BookReviewListProps) {
  const { data: reviews, isLoading, error } = useBookReviews(bookId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-sm text-red-600">
          리뷰를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">아직 작성된 리뷰가 없습니다.</p>
        <p className="mt-1 text-xs text-gray-400">
          이 책에 대한 첫 리뷰를 작성해보세요!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          {/* 리뷰 작성자 */}
          <p className="mb-2 font-medium text-gray-900">
            {review.authorName.trim()} 님의 한줄 감상평
          </p>

          {/* 리뷰 내용 */}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {review.content}
          </p>
        </div>
      ))}

      {/* 리뷰 개수 표시 */}
      <p className="text-center text-xs text-gray-500">
        총 {reviews.length}개의 리뷰
      </p>
    </div>
  )
}

BookReviewList.displayName = 'BookReviewList'
