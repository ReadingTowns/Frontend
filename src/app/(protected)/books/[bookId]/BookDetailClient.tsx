'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useBookDetailPage } from '@/hooks/useBookDetail'
import BookReviewSection from '@/components/books/BookReviewSection'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface BookDetailClientProps {
  bookId: string
}

export default function BookDetailClient({ bookId }: BookDetailClientProps) {
  const router = useRouter()
  const { book, myReview, isLoading } = useBookDetailPage(bookId)
  const [imageError, setImageError] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (book.error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-600">책 정보를 불러올 수 없습니다.</p>
        <button
          onClick={() => router.back()}
          className="rounded-lg bg-primary-400 px-6 py-2 text-white hover:bg-primary-500"
        >
          돌아가기
        </button>
      </div>
    )
  }

  if (!book.data) {
    return null
  }

  const {
    bookName,
    author,
    publisher,
    bookImage,
    description,
    publicationDate,
  } = book.data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[430px] items-center gap-4 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
            aria-label="뒤로가기"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="flex-1 truncate text-lg font-semibold">책 정보</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-[430px] bg-white">
        {/* 책 표지 */}
        <div className="flex justify-center bg-gray-100 py-8">
          {!imageError && bookImage ? (
            <Image
              src={bookImage}
              alt={bookName}
              width={200}
              height={280}
              className="rounded-lg shadow-md"
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <div className="flex h-[280px] w-[200px] items-center justify-center rounded-lg bg-gray-200">
              <svg
                className="h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          )}
        </div>

        {/* 책 정보 */}
        <div className="space-y-6 p-6">
          {/* 제목 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{bookName}</h2>
          </div>

          {/* 작가 및 출판 정보 */}
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-700">저자:</span> {author}
            </p>
            <p>
              <span className="font-medium text-gray-700">출판사:</span>{' '}
              {publisher}
            </p>
            {publicationDate && (
              <p>
                <span className="font-medium text-gray-700">출간일:</span>{' '}
                {publicationDate}
              </p>
            )}
          </div>

          {/* 책 소개 */}
          {description && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">책 소개</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {description}
              </p>
            </div>
          )}

          {/* 구분선 */}
          <div className="border-t border-gray-200" />

          {/* 리뷰 섹션 */}
          <BookReviewSection
            bookId={bookId}
            bookTitle={bookName}
            myReview={myReview.data || null}
            isLoading={myReview.isLoading}
          />
        </div>
      </div>
    </div>
  )
}
