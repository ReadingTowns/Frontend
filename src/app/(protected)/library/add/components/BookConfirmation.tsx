'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAddBookById } from '@/hooks/useLibrary'
import type { BookSearchResult } from '@/types/book'

interface BookConfirmationProps {
  book: BookSearchResult
  onBack: () => void
}

export default function BookConfirmation({
  book,
  onBack,
}: BookConfirmationProps) {
  const router = useRouter()
  const addBookMutation = useAddBookById()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await addBookMutation.mutateAsync(book.bookId)
      // 성공 시 서재 목록으로 이동
      router.push('/library')
    } catch (error) {
      console.error('Failed to add book:', error)
      alert('책 등록에 실패했습니다. 다시 시도해주세요.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* 책 정보 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* 표지 */}
          <div className="relative w-40 h-56 mx-auto mb-6">
            <Image
              src={book.bookImage}
              alt={book.bookName}
              fill
              className="object-cover rounded-lg"
              sizes="160px"
            />
          </div>

          {/* 책 정보 */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {book.bookName}
              </h2>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-sm font-medium mr-2">저자</span>
              <span className="text-sm">{book.author}</span>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              이 책을 서재에 등록하시겠습니까?
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="bg-white border-t border-gray-200 p-4 space-y-2">
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="w-full bg-primary-400 hover:bg-primary-500 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {isSubmitting ? '등록 중...' : '서재에 등록'}
        </button>
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  )
}
