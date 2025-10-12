'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { useSubmitRating } from '@/hooks/useUserRating'
import { useSnackbar } from '@/hooks/useSnackbar'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string | number
  userName: string
}

export default function RatingModal({
  isOpen,
  onClose,
  userId,
  userName,
}: RatingModalProps) {
  const { showWarning, showSuccess, showError } = useSnackbar()
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const submitRatingMutation = useSubmitRating(userId)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      showWarning('별점을 선택해주세요.')
      return
    }

    try {
      await submitRatingMutation.mutateAsync(selectedRating)
      showSuccess('별점이 제출되었습니다.')
      onClose()
    } catch (error) {
      if (error instanceof Error && error.message.includes('본인')) {
        showWarning('본인에게는 별점을 남길 수 없습니다.')
      } else {
        showError('별점 제출에 실패했습니다. 다시 시도해주세요.')
      }
    }
  }

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating)
  }

  const handleStarHover = (rating: number) => {
    setHoverRating(rating)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }

  const displayRating = hoverRating || selectedRating

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {userName} 님에게 별점 남기기
          </h2>
          <p className="mt-2 text-sm text-gray-600">교환 경험은 어떠셨나요?</p>
        </div>

        {/* 별점 선택 */}
        <div className="mb-6 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              onClick={() => handleStarClick(rating)}
              onMouseEnter={() => handleStarHover(rating)}
              onMouseLeave={handleStarLeave}
              className="transition-transform hover:scale-110"
              disabled={submitRatingMutation.isPending}
            >
              {rating <= displayRating ? (
                <StarIcon className="h-12 w-12 text-yellow-400" />
              ) : (
                <StarOutlineIcon className="h-12 w-12 text-gray-300" />
              )}
            </button>
          ))}
        </div>

        {/* 선택된 별점 표시 */}
        {selectedRating > 0 && (
          <p className="mb-6 text-center text-sm text-gray-600">
            {selectedRating}점을 선택하셨습니다
          </p>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={submitRatingMutation.isPending}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitRatingMutation.isPending || selectedRating === 0}
            className="flex-1 rounded-lg bg-primary-400 px-4 py-2 text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {submitRatingMutation.isPending ? '제출 중...' : '제출'}
          </button>
        </div>
      </div>
    </div>
  )
}

RatingModal.displayName = 'RatingModal'
