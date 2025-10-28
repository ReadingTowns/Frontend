'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { BookCard } from '@/components/books/BookCard'
import { Book } from '@/types/bookCard'
import { useBookDetailPage } from '@/hooks/useBookDetail'
import { useUserProfile, useUserBookReview } from '@/hooks/useLibrary'
import BookReviewSection from '@/components/books/BookReviewSection'
import BookReviewList from '@/components/books/BookReviewList'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import {
  UserCircleIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

interface BookDetailClientProps {
  bookId: string
}

export default function BookDetailClient({ bookId }: BookDetailClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { book, myReview, isLoading } = useBookDetailPage(bookId)

  // 쿼리 파라미터 확인: 다른 유저의 서재에서 온 경우
  const fromLibrary = searchParams.get('from') === 'library'
  const ownerId = searchParams.get('ownerId')

  // 책 주인 정보 조회 (다른 유저의 서재에서 온 경우만)
  const { data: ownerProfile } = useUserProfile(ownerId || '')

  // 책 주인의 감상평 조회 (다른 유저의 서재에서 온 경우만)
  const { data: ownerReview, isLoading: ownerReviewLoading } =
    useUserBookReview(bookId, ownerId || '')

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
        {/* 책 정보 카드 */}
        <div className="p-6">
          <BookCard
            variant="detail"
            book={
              {
                bookId: Number(bookId),
                bookTitle: bookName,
                bookCoverImage: bookImage,
                author,
                publisher,
                description,
                publicationDate,
              } as Book
            }
            size="large"
            showFullInfo={true}
            showOwnerInfo={fromLibrary}
            fromLibrary={fromLibrary}
            ownerId={ownerId || undefined}
          />

          {/* 구분선 */}
          <div className="border-t border-gray-200 mt-6" />

          {/* 책 주인 정보 (다른 유저의 서재에서 온 경우만 표시) */}
          {fromLibrary && ownerProfile && (
            <>
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  책 소유자 정보
                </h3>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 flex-shrink-0 rounded-full bg-cover bg-center bg-gray-200"
                      style={{
                        backgroundImage: ownerProfile.profileImage
                          ? `url(${ownerProfile.profileImage})`
                          : 'none',
                      }}
                    >
                      {!ownerProfile.profileImage && (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-400">
                          <UserCircleIcon className="h-7 w-7 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {ownerProfile.nickname}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4" />
                        {ownerProfile.currentTown || '위치 정보 없음'}
                      </div>
                      {ownerProfile.userRating && (
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1">
                            {ownerProfile.userRating.toFixed(1)}
                          </span>
                          <span className="mx-1">•</span>
                          <span>후기 {ownerProfile.userRatingCount}개</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {ownerProfile.availableTime && (
                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">교환 가능 시간:</span>{' '}
                        {ownerProfile.availableTime}
                      </p>
                    </div>
                  )}

                  {/* 책 주인의 감상평 (있는 경우 책 소유자 정보 영역 내에 표시) */}
                  {ownerReviewLoading ? (
                    <div className="mt-3 animate-pulse border-t border-gray-200 pt-3">
                      <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-gray-200" />
                        <div className="h-3 w-5/6 rounded bg-gray-200" />
                        <div className="h-3 w-4/6 rounded bg-gray-200" />
                      </div>
                    </div>
                  ) : (
                    ownerReview && (
                      <div className="mt-3 border-t border-gray-200 pt-3">
                        <p className="mb-2 text-xs font-medium text-gray-700">
                          감상평
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                          {ownerReview.content}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-200" />
            </>
          )}

          {/* 내 리뷰 섹션 */}
          <BookReviewSection
            bookId={bookId}
            bookTitle={bookName}
            myReview={myReview.data || null}
            isLoading={myReview.isLoading}
          />

          {/* 구분선 */}
          <div className="border-t border-gray-200" />

          {/* 다른 사용자 리뷰 섹션 */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900">
              다른 사용자 리뷰
            </h3>
            <BookReviewList bookId={bookId} />
          </div>
        </div>
      </div>
    </div>
  )
}
