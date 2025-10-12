'use client'

import { useState, useEffect } from 'react'
import { BookReview } from '@/types/library'

interface BookReviewModalProps {
  isOpen: boolean
  onClose: () => void
  bookId: string
  bookTitle: string
  existingReview?: BookReview
  mode: 'create' | 'edit'
  onSubmit: (content: string) => void
  isLoading?: boolean
}

export function BookReviewModal({
  isOpen,
  onClose,
  bookTitle,
  existingReview,
  mode,
  onSubmit,
  isLoading = false,
}: BookReviewModalProps) {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (isOpen) {
      setContent(existingReview?.content || '')
    }
  }, [isOpen, existingReview])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content.trim())
    }
  }

  const handleClose = () => {
    setContent('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === 'create' ? '감상평 작성' : '감상평 수정'}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">&ldquo;{bookTitle}&rdquo;</span>에
            대한 감상평을 {mode === 'create' ? '작성' : '수정'}해주세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              감상평
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
              rows={6}
              placeholder="이 책을 읽고 느낀 점이나 인상 깊었던 부분을 자유롭게 작성해주세요..."
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              {content.length}/1000자
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white bg-primary-500 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {mode === 'create' ? '작성 중...' : '수정 중...'}
                </div>
              ) : mode === 'create' ? (
                '작성 완료'
              ) : (
                '수정 완료'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
