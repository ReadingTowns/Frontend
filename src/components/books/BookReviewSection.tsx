'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/common/Modal'
import type { MyBookReview } from '@/types/book'
import {
  useCreateBookReview,
  useUpdateBookReview,
  useDeleteBookReview,
} from '@/hooks/useBookDetail'

interface BookReviewSectionProps {
  bookId: string
  bookTitle: string
  myReview: MyBookReview | null
  isLoading?: boolean
}

export default function BookReviewSection({
  bookId,
  bookTitle,
  myReview,
  isLoading,
}: BookReviewSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [reviewContent, setReviewContent] = useState(myReview?.content || '')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const createReview = useCreateBookReview(bookId)
  const updateReview = useUpdateBookReview(bookId, myReview?.reviewId || 0)
  const deleteReview = useDeleteBookReview(bookId, myReview?.reviewId || 0)

  const handleSave = async () => {
    if (!reviewContent.trim()) {
      toast('감상평을 입력해주세요.', { icon: '⚠️' })
      return
    }

    try {
      if (myReview) {
        await updateReview.mutateAsync(reviewContent)
      } else {
        await createReview.mutateAsync(reviewContent)
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save review:', error)
      // API 에러는 api.ts에서 자동으로 토스트 표시
    }
  }

  const handleDelete = async () => {
    try {
      await deleteReview.mutateAsync()
      setShowDeleteConfirm(false)
      setReviewContent('')
    } catch (error) {
      console.error('Failed to delete review:', error)
      // API 에러는 api.ts에서 자동으로 토스트 표시
    }
  }

  const handleCancel = () => {
    setReviewContent(myReview?.content || '')
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">내 감상평</h3>

      {!myReview && !isEditing ? (
        // 리뷰 없을 때 - 작성 버튼
        <button
          onClick={() => setIsEditing(true)}
          className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-gray-500 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600"
        >
          <svg
            className="mx-auto mb-2 h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="font-medium">감상평 작성하기</p>
        </button>
      ) : isEditing ? (
        // 리뷰 작성/수정 모드
        <div className="space-y-3">
          <textarea
            value={reviewContent}
            onChange={e => setReviewContent(e.target.value)}
            placeholder={`"${bookTitle}"에 대한 감상을 남겨주세요...`}
            className="min-h-[150px] w-full resize-none rounded-lg border border-gray-300 p-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20"
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {reviewContent.length}/1000
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={createReview.isPending || updateReview.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={createReview.isPending || updateReview.isPending}
                className="rounded-lg bg-primary-400 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-50"
              >
                {createReview.isPending || updateReview.isPending
                  ? '저장 중...'
                  : '저장'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // 리뷰 보기 모드
        <div className="space-y-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
              {myReview?.content}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setReviewContent(myReview?.content || '')
                setIsEditing(true)
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              수정
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              삭제
            </button>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="감상평 삭제"
        closeOnBackdropClick={false}
        closeOnEsc={!deleteReview.isPending}
        size="sm"
        showCloseButton={false}
      >
        <div className="p-6 text-center">
          <p className="mb-6 text-sm text-gray-600">
            정말로 감상평을 삭제하시겠습니까?
            <br />
            삭제된 감상평은 복구할 수 없습니다.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteReview.isPending}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteReview.isPending}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteReview.isPending ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
