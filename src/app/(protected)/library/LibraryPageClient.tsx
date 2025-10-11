'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBookReviewActions } from '@/hooks/useLibrary'
import { useHeader } from '@/contexts/HeaderContext'
import LibraryHeader from '@/components/layout/LibraryHeader'
import { LibraryBookCard } from '@/components/library/LibraryBookCard'
import { LibraryStats } from '@/components/library/LibraryStats'
import { BookReviewModal } from '@/components/library/BookReviewModal'
import { LibraryBook } from '@/types/library'
import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/outline'

interface LibraryPageClientProps {
  initialBooks: LibraryBook[]
}

export default function LibraryPageClient({
  initialBooks,
}: LibraryPageClientProps) {
  const { setHeaderContent } = useHeader()
  const queryClient = useQueryClient()
  const [books, setBooks] = useState(initialBooks)
  const [selectedBook, setSelectedBook] = useState<{
    id: string
    title: string
  } | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const bookReviewActions = useBookReviewActions(selectedBook?.id || '')

  useEffect(() => {
    setHeaderContent(<LibraryHeader />)

    // SSR 데이터를 TanStack Query 캐시에 미리 로드
    queryClient.setQueryData(['library', 'books'], {
      data: initialBooks,
      pagination: { last: initialBooks.length < 10 },
    })

    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent, queryClient, initialBooks])

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

  const totalBooks = books.length
  const completionRate = totalBooks > 0 ? Math.random() * 80 + 20 : 0 // 임시 완독률

  return (
    <>
      {/* Library Stats */}
      <LibraryStats
        totalBooks={totalBooks}
        completionRate={completionRate}
        isLoading={false}
      />

      {/* Books Section */}
      <section>
        {books.length === 0 ? (
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
              {books.map((book: LibraryBook) => (
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
    </>
  )
}
