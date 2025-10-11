'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBookReviewActions } from '@/hooks/useLibrary'
import { useHeader } from '@/contexts/HeaderContext'
import { LibraryBookCard } from '@/components/library/LibraryBookCard'
import { BookReviewModal } from '@/components/library/BookReviewModal'
import { LibraryBook } from '@/types/library'
import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/outline'

export default function LibraryPageClient() {
  const { setHeaderContent } = useHeader()
  const queryClient = useQueryClient()
  const [books, setBooks] = useState<LibraryBook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState<{
    id: string
    title: string
  } | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

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

  // 클라이언트에서 서재 데이터 fetch
  useEffect(() => {
    const fetchLibraryBooks = async () => {
      try {
        setIsLoading(true)
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
        const response = await fetch(
          `${backendUrl}/api/v1/bookhouse/members/me?page=0&size=10`,
          {
            credentials: 'include', // 쿠키 자동 전송
          }
        )

        if (!response.ok) {
          console.error('Failed to fetch library books:', response.status)
          setBooks([])
          return
        }

        const data = await response.json()
        const fetchedBooks = data.result?.content || []
        setBooks(fetchedBooks)

        // TanStack Query 캐시 업데이트
        queryClient.setQueryData(['library', 'books'], {
          data: fetchedBooks,
          pagination: { last: fetchedBooks.length < 10 },
        })
      } catch (error) {
        console.error('Failed to fetch library books:', error)
        setBooks([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLibraryBooks()
  }, [queryClient])

  const handleDeleteBook = async (bookId: string) => {
    if (confirm('정말로 이 책을 서재에서 삭제하시겠습니까?')) {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
        const response = await fetch(
          `${backendUrl}/api/v1/bookhouse/books/${bookId}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        )

        if (response.ok) {
          setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId))
          queryClient.invalidateQueries({ queryKey: ['library', 'books'] })
        }
      } catch (error) {
        console.error('Failed to delete book:', error)
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
              {books.map((book: LibraryBook) => (
                <LibraryBookCard
                  key={book.id}
                  book={book}
                  onDelete={handleDeleteBook}
                  onReviewClick={handleReviewClick}
                  showActions={true}
                  isOwner={true}
                  compact={true}
                />
              ))}
            </div>

            {/* Load More Button */}
            {books.length >= 10 && (
              <div className="text-center mt-8">
                <button
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    // 더 많은 데이터 로드 로직
                  }}
                >
                  더 보기
                </button>
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
