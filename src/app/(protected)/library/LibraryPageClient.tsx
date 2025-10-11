'use client'

import { useState, useEffect } from 'react'
import { useMyLibraryBooks, useBookReviewActions } from '@/hooks/useLibrary'
import { useHeader } from '@/contexts/HeaderContext'
import { LibraryBookCard } from '@/components/library/LibraryBookCard'
import { BookReviewModal } from '@/components/library/BookReviewModal'
import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import { api } from '@/lib/api'

export default function LibraryPageClient() {
  const { setHeaderContent } = useHeader()
  const [page, setPage] = useState(0)
  const [selectedBook, setSelectedBook] = useState<{
    id: string
    title: string
  } | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  // TanStack Query로 서재 데이터 fetch
  const { data, isLoading, refetch } = useMyLibraryBooks({ page, size: 12 })
  const books = data?.content || []
  const pagination = data
    ? {
        curPage: data.curPage,
        totalPages: data.totalPages,
        last: data.last,
      }
    : null

  const bookReviewActions = useBookReviewActions(selectedBook?.id || '')

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
        alert('책 삭제에 실패했습니다.')
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
                <LibraryBookCard
                  key={book.bookId}
                  book={book}
                  onDelete={handleDeleteBook}
                  onReviewClick={handleReviewClick}
                  showActions={true}
                  isOwner={true}
                  compact={true}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && !pagination.last && (
              <div className="text-center mt-8">
                <button
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={isLoading}
                >
                  {isLoading ? '로딩 중...' : '더 보기'}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  {pagination.curPage + 1} / {pagination.totalPages} 페이지
                </p>
              </div>
            )}
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
