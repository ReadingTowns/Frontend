'use client'

import { useState, useEffect } from 'react'
import { useLibrary, useBookReviewActions } from '@/hooks/useLibrary'
import {
  LibraryBookCard,
  LibraryStats,
  BookReviewModal,
} from '@/components/library'
import { BookCardSkeleton } from '@/components/ui/Skeleton'
import Link from 'next/link'

export default function LibraryPage() {
  const { books, deleteBook } = useLibrary()
  const [selectedBook, setSelectedBook] = useState<{
    id: string
    title: string
  } | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const bookReviewActions = useBookReviewActions(selectedBook?.id || '')

  const handleDeleteBook = (bookId: string) => {
    if (confirm('정말로 이 책을 서재에서 삭제하시겠습니까?')) {
      deleteBook.mutate(bookId)
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

  const totalBooks = books.data.length
  const completionRate = totalBooks > 0 ? Math.random() * 80 + 20 : 0 // 임시 완독률

  return (
    <div className="max-w-[430px] mx-auto bg-gray-50 min-h-screen py-4 px-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">내 서재</h1>
          <Link href="/library/add">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <span className="text-xl">➕</span>
            </button>
          </Link>
        </div>
        <p className="text-sm text-gray-600">나만의 책 컬렉션을 관리해보세요</p>
      </header>

      {/* Library Stats */}
      <LibraryStats
        totalBooks={totalBooks}
        completionRate={completionRate}
        isLoading={books.isLoading}
      />

      {/* Books Section */}
      <section>
        {books.isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : books.data.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                내 책 ({totalBooks}권)
              </h2>
              <select className="text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white">
                <option value="latest">최근 등록순</option>
                <option value="title">제목순</option>
                <option value="author">작가순</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {books.data.map(book => (
                <LibraryBookCard
                  key={book.id}
                  book={book}
                  onDelete={handleDeleteBook}
                  onReviewClick={handleReviewClick}
                  showActions={true}
                  isOwner={true}
                />
              ))}
            </div>

            {/* Load More Button */}
            {books.pagination && !books.pagination.last && (
              <div className="text-center mt-8">
                <button
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => books.refetch()}
                >
                  더 보기
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Floating Add Button */}
      <Link href="/library/add">
        <button className="fixed bottom-24 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors flex items-center justify-center text-2xl">
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
    </div>
  )
}
