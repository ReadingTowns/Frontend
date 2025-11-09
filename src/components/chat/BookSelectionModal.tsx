'use client'

/**
 * BookSelectionModal Component
 * 교환 수락 시 상대방 서재에서 원하는 책을 선택하는 모달
 * - 상대방 서재 책 목록 조회
 * - 라디오 버튼으로 책 선택
 * - 2컬럼 그리드 레이아웃
 * - 무한 스크롤 지원
 */

import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { LibraryBooksGrid } from '@/components/library/LibraryBooksGrid'

interface BookSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  partnerId: string
  partnerName: string
  onConfirm: (bookhouseId: number) => void
}

export function BookSelectionModal({
  isOpen,
  onClose,
  partnerId,
  partnerName,
  onConfirm,
}: BookSelectionModalProps) {
  const [selectedBookhouseId, setSelectedBookhouseId] = useState<number | null>(
    null
  )

  const handleConfirm = () => {
    if (selectedBookhouseId) {
      onConfirm(selectedBookhouseId)
      setSelectedBookhouseId(null)
    }
  }

  const handleClose = () => {
    setSelectedBookhouseId(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`받고 싶은 ${partnerName}의 책 선택`}
      size="lg"
      closeOnBackdropClick={false}
    >
      <div className="flex flex-col h-[60vh]">
        {/* Info */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{partnerName}</span>의
            서재에서 받고 싶은 책을 선택해주세요
          </p>
        </div>

        {/* Book List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <LibraryBooksGrid
            userId={partnerId}
            selectionMode={true}
            selectedBookhouseId={selectedBookhouseId || undefined}
            onSelect={setSelectedBookhouseId}
            pageSize={20}
          />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedBookhouseId}
            className="flex-1 px-4 py-3 bg-primary-400 text-white rounded-xl font-medium hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  )
}

BookSelectionModal.displayName = 'BookSelectionModal'
