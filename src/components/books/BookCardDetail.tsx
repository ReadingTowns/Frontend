'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookCardDetailProps } from '@/types/bookCard'

/**
 * BookCard Detail Variant
 * - 책 상세 페이지용 큰 이미지
 * - 책 등록 확인 모달용 미리보기
 * - 저자, 출판사, 설명, 출판일 전체 정보 표시
 */
export function BookCardDetail({
  book,
  size = 'large',
  showFullInfo = true,
  showReviews = false,
  showOwnerInfo = false,
  fromLibrary,
  ownerId,
}: BookCardDetailProps) {
  const [imageError, setImageError] = useState(false)

  const heightClass = size === 'large' ? 'h-80' : 'h-60'

  return (
    <div className="space-y-6">
      {/* Book Image */}
      <div
        className={`relative ${heightClass} w-full overflow-hidden rounded-lg bg-gray-100`}
      >
        {!imageError && book.bookCoverImage ? (
          <Image
            src={book.bookCoverImage}
            alt={book.bookTitle}
            fill
            className="object-cover"
            sizes="(max-width: 430px) 100vw, 430px"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
            <div className="text-center px-4">
              <p className="text-lg text-gray-600 font-medium">
                {book.bookTitle}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">{book.bookTitle}</h2>

        {showFullInfo && (
          <div className="space-y-2 text-gray-600">
            {/* 저자 */}
            <p>
              <span className="font-medium text-gray-700">저자:</span>{' '}
              {book.author}
            </p>

            {/* 출판사 */}
            {book.publisher && (
              <p>
                <span className="font-medium text-gray-700">출판사:</span>{' '}
                {book.publisher}
              </p>
            )}

            {/* 출판일 */}
            {book.publicationDate && (
              <p>
                <span className="font-medium text-gray-700">출판일:</span>{' '}
                {book.publicationDate}
              </p>
            )}

            {/* 소개 */}
            {book.description && (
              <div>
                <p className="font-medium text-gray-700 mb-1">소개:</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {book.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Owner Info (다른 유저의 서재에서 온 경우) */}
      {showOwnerInfo && fromLibrary && ownerId && (
        <div className="pt-6 border-t">
          <p className="text-sm text-gray-500">
            이 책은 다른 사용자의 서재에 있습니다
          </p>
        </div>
      )}

      {/* Reviews Section Placeholder */}
      {showReviews && (
        <div className="pt-6 border-t">
          {/* 리뷰 섹션은 기존 BookReviewSection 컴포넌트 재사용 */}
          <p className="text-sm text-gray-500">
            감상평은 BookReviewSection에서 표시됩니다
          </p>
        </div>
      )}
    </div>
  )
}

BookCardDetail.displayName = 'BookCardDetail'
