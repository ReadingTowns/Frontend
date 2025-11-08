'use client'

import { Modal } from '@/components/common/Modal'

interface ChatRoomExitModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export default function ChatRoomExitModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ChatRoomExitModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="채팅방 나가기"
      closeOnBackdropClick={false}
      closeOnEsc={!isLoading}
      size="sm"
      showCloseButton={false}
    >
      <div className="p-6 text-center">
        {/* 경고 아이콘 */}
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* 설명 */}
        <p className="text-sm text-gray-600 mb-6">
          채팅방을 나가면 모든 대화 내용이 삭제됩니다. 정말 나가시겠습니까?
        </p>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                나가는 중...
              </span>
            ) : (
              '나가기'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

ChatRoomExitModal.displayName = 'ChatRoomExitModal'
