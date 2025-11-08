'use client'

import { useState, useEffect } from 'react'
import { BookReview } from '@/types/library'
import { Modal } from '@/components/common/Modal'

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? '감상평 작성' : '감상평 수정'}
      closeOnBackdropClick={true}
      closeOnEsc={!isLoading}
      size="md"
    >
      {/* Header Description */}
      <div className="px-6 pt-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">&ldquo;{bookTitle}&rdquo;</span>에 대한
          감상평을 {mode === 'create' ? '작성' : '수정'}해주세요
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
          <p className="text-xs text-gray-500 mt-2">{content.length}/1000자</p>
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
    </Modal>
  )
}
