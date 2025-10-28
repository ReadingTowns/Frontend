'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  useMyLibraryBooksInfinite,
  useBookReviewActions,
} from '@/hooks/useLibrary'
import { useHeader } from '@/contexts/HeaderContext'
import { useSnackbar } from '@/hooks/useSnackbar'
import { BookCard } from '@/components/books/BookCard'
import { GridBook } from '@/types/bookCard'
import { BookReviewModal } from '@/components/library/BookReviewModal'
import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import { api } from '@/lib/api'

export default function LibraryPageClient() {
  const { setHeaderContent } = useHeader()
  const { showError } = useSnackbar()
  const [selectedBook, setSelectedBook] = useState<{
    id: string
    title: string
  } | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  // 무한 스크롤 쿼리
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useMyLibraryBooksInfinite(12)

  // 모든 페이지의 책 데이터를 평탄화
  const books = data?.pages.flatMap(page => page.content) || []

  const bookReviewActions = useBookReviewActions(selectedBook?.id || '')

  // Intersection Observer로 스크롤 감지
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = observerTarget.current
    if (!element) return

    const option = { threshold: 0.5 }
    const observer = new IntersectionObserver(handleObserver, option)
    observer.observe(element)

    return () => observer.disconnect()
  }, [handleObserver])

  // 페이지 마운트 시 서재 데이터 강제 재조회 (낙관적 업데이트 문제 해결)
  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    // 새로운 헤더로 교체
    setHeaderContent(
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">나의 서재</h1>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
            +옵션 없음
          </button>
        </div>
        <p className="text-sm text-gray-600">내 서재에 보관하고 있는 책들</p>
      </header>
    )

    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent])

  const handleDeleteBook = async (bookId: string) => {
    if (confirm('정말로 이 책을 서재에서 삭제하시겠습니까?')) {
      try {
        await api.delete(`/api/v1/bookhouse/books/${bookId}`)
        refetch() // 삭제 후 목록 새로고침
      } catch (error) {
        console.error('Failed to delete book:', error)
        showError('책 삭제에 실패했습니다.')
      }
    }
  }

  const handleReviewClick = (bookId: string, bookTitle: string) => {
    setSelectedBook({ id: bookId, title: bookTitle })
    setIsReviewModalOpen(true)
  }

  const handleReviewSubmit = (content: string) => {
    if (selectedBook) {
      if (bookReviewActions.hasReview) {
        bookReviewActions.updateReview.mutate({ content })
      } else {
        bookReviewActions.addReview.mutate({ content })
      }
    }
  }

  const handleReviewModalClose = () => {
    setSelectedBook(null)
    setIsReviewModalOpen(false)
  }

  // 성공적으로 감상평이 추가/수정되면 모달 닫기
  useEffect(() => {
    if (
      bookReviewActions.addReview.isSuccess ||
      bookReviewActions.updateReview.isSuccess
    ) {
      handleReviewModalClose()
    }
  }, [
    bookReviewActions.addReview.isSuccess,
    bookReviewActions.updateReview.isSuccess,
  ])

  return (
    <>
      {/* Books Section */}
      <section>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">서재를 불러오는 중...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              서재가 비어있어요
            </h3>
            <p className="text-gray-600 mb-6">
              첫 번째 책을 등록하고 나만의 서재를 만들어보세요!
            </p>
            <Link href="/library/add">
              <button className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors">
                첫 책 등록하기
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* 3열 그리드로 변경 */}
            <div className="grid grid-cols-3 gap-3">
              {books.map(book => (
                <BookCard
                  key={book.bookId}
                  variant="grid"
                  book={
                    {
                      ...book,
                      bookTitle: book.bookName,
                      bookCoverImage: book.bookImage,
                    } as GridBook
                  }
                  columns={3}
                  compact={true}
                  aspectRatio="2/3"
                  showActions={true}
                  showCategories={true}
                  showStatus={true}
                  isOwner={true}
                  onActionClick={(action, book) => {
                    if (action === 'review') {
                      handleReviewClick(String(book.bookId), book.bookTitle)
                    }
                    if (action === 'delete') {
                      handleDeleteBook(String(book.bookId))
                    }
                  }}
                />
              ))}
            </div>

            {/* 무한 스크롤 트리거 및 로딩 인디케이터 */}
            <div ref={observerTarget} className="text-center mt-8 pb-4">
              {isFetchingNextPage && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-600">
                    더 많은 책 불러오는 중...
                  </p>
                </div>
              )}
              {!hasNextPage && books.length > 0 && (
                <p className="text-sm text-gray-500">
                  모든 책을 불러왔습니다 📚
                </p>
              )}
            </div>
          </>
        )}
      </section>

      {/* Floating Add Button - 회색 톤으로 변경 */}
      <Link href="/library/add">
        <button className="fixed bottom-24 right-4 w-16 h-16 bg-gray-200 text-gray-800 rounded-full shadow-xl hover:bg-gray-300 transition-all flex items-center justify-center text-3xl font-light">
          +
        </button>
      </Link>

      {/* Book Review Modal */}
      <BookReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleReviewModalClose}
        bookId={selectedBook?.id || ''}
        bookTitle={selectedBook?.title || ''}
        existingReview={bookReviewActions.review.data || undefined}
        mode={bookReviewActions.mode}
        onSubmit={handleReviewSubmit}
        isLoading={
          bookReviewActions.addReview.isLoading ||
          bookReviewActions.updateReview.isLoading
        }
      />
    </>
  )
}
