'use client'

/**
 * ExchangeRequestCard Component
 * 채팅 내 교환 요청 카드 UI
 * - 내 책과 상대 책 정보 표시
 * - 상태별 액션 버튼 (수락/거절/취소/교환완료/새 요청)
 *
 * API: GET /api/v1/chatrooms/{chatroomId}/books
 * 응답: { myBook: ExchangeBookInfo, partnerBook: ExchangeBookInfo }
 */

import { useState } from 'react'
import Image from 'next/image'
import type { ExchangeBookInfo } from '@/types/chatroom'
import {
  useAcceptExchange,
  useRejectExchange,
  useCancelExchange,
  useCompleteExchange,
} from '@/hooks/useExchange'
import {
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface ExchangeRequestCardProps {
  myBook: ExchangeBookInfo
  partnerBook: ExchangeBookInfo
  chatroomId: number
  onNewRequest?: () => void
}

export function ExchangeRequestCard({
  myBook,
  partnerBook,
  chatroomId,
  onNewRequest,
}: ExchangeRequestCardProps) {
  const [imageError, setImageError] = useState<{
    my: boolean
    partner: boolean
  }>({ my: false, partner: false })

  const acceptMutation = useAcceptExchange(chatroomId)
  const rejectMutation = useRejectExchange(chatroomId)
  const cancelMutation = useCancelExchange(chatroomId)
  const completeMutation = useCompleteExchange(chatroomId)

  // 상태 판단 로직
  const isMyBookPending = myBook.isAccepted === 'PENDING'
  const isPartnerBookPending = partnerBook.isAccepted === 'PENDING'
  const isBothAccepted =
    myBook.isAccepted === 'ACCEPTED' && partnerBook.isAccepted === 'ACCEPTED'
  const isEitherRejected =
    myBook.isAccepted === 'REJECTED' || partnerBook.isAccepted === 'REJECTED'
  const isBothExchanged =
    myBook.isAccepted === 'EXCHANGED' && partnerBook.isAccepted === 'EXCHANGED'

  // 내가 요청자인지 판단
  // 내가 상대 책을 요청 → partnerBook.isAccepted = PENDING
  // 상대가 내 책을 요청 → myBook.isAccepted = PENDING
  const isMyRequest = isPartnerBookPending && !isMyBookPending
  const isPartnerRequest = isMyBookPending && !isPartnerBookPending

  // 헤더 텍스트
  const getHeaderText = () => {
    if (isBothExchanged) return '교환이 완료되었습니다'
    if (isBothAccepted) return '양측 모두 수락했습니다'
    if (isEitherRejected) return '교환 요청이 거절되었습니다'
    if (isMyRequest) return '교환 요청을 보냈습니다'
    if (isPartnerRequest) return '교환 요청을 받았습니다'
    return '교환 진행 중'
  }

  // 액션 버튼 렌더링
  const renderActions = () => {
    // REJECTED 상태: 새 요청 버튼
    if (isEitherRejected) {
      return (
        <button
          onClick={onNewRequest}
          className="w-full py-3 bg-primary-400 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors"
        >
          새 교환 요청 보내기
        </button>
      )
    }

    // EXCHANGED 상태: 완료 메시지만
    if (isBothExchanged) {
      return (
        <div className="text-center py-3 text-green-600 font-medium">
          <CheckCircleIcon className="w-6 h-6 inline mr-2" />
          교환이 완료되었습니다
        </div>
      )
    }

    // ACCEPTED - 양측 모두 수락: 교환 완료 버튼
    if (isBothAccepted) {
      return (
        <button
          onClick={() => completeMutation.mutate(myBook.exchangeStatusId)}
          disabled={completeMutation.isPending}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {completeMutation.isPending ? '처리 중...' : '교환 완료'}
        </button>
      )
    }

    // ACCEPTED - 한쪽만 수락: 대기 메시지
    if (
      myBook.isAccepted === 'ACCEPTED' ||
      partnerBook.isAccepted === 'ACCEPTED'
    ) {
      return (
        <div className="text-center py-3 text-gray-600">
          <ClockIcon className="w-6 h-6 inline mr-2" />
          상대방의 수락을 기다리는 중입니다
        </div>
      )
    }

    // PENDING - 내가 요청자: 취소 버튼
    if (isMyRequest) {
      return (
        <button
          onClick={() => cancelMutation.mutate(myBook.exchangeStatusId)}
          disabled={cancelMutation.isPending}
          className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelMutation.isPending ? '취소 중...' : '요청 취소'}
        </button>
      )
    }

    // PENDING - 상대가 요청자: 수락/거절 버튼
    if (isPartnerRequest) {
      return (
        <div className="flex gap-3">
          <button
            onClick={() => rejectMutation.mutate(partnerBook.exchangeStatusId)}
            disabled={rejectMutation.isPending}
            className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <XCircleIcon className="w-5 h-5" />
            {rejectMutation.isPending ? '처리 중...' : '거절'}
          </button>
          <button
            onClick={() => acceptMutation.mutate(partnerBook.exchangeStatusId)}
            disabled={acceptMutation.isPending}
            className="flex-1 py-3 bg-primary-400 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircleIcon className="w-5 h-5" />
            {acceptMutation.isPending ? '처리 중...' : '수락'}
          </button>
        </div>
      )
    }

    return null
  }

  return (
    <div className="my-4 mx-4 bg-white rounded-2xl shadow-md border border-gray-200 p-5">
      {/* 헤더 */}
      <div className="text-center mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          {getHeaderText()}
        </h3>
      </div>

      {/* 책 정보 카드 */}
      <div className="flex items-center justify-between gap-4 mb-5">
        {/* 내 책 */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden mb-2 relative">
            {!imageError.my && myBook.bookImage ? (
              <Image
                src={myBook.bookImage}
                alt={myBook.bookName}
                fill
                className="object-cover"
                onError={() => setImageError(prev => ({ ...prev, my: true }))}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900 text-center line-clamp-2">
            {myBook.bookName}
          </p>
          <span className="text-xs text-gray-500 mt-1">내 책</span>
        </div>

        {/* 화살표 아이콘 */}
        <div className="flex-shrink-0">
          <ArrowsRightLeftIcon className="w-8 h-8 text-primary-400" />
        </div>

        {/* 상대 책 */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden mb-2 relative">
            {!imageError.partner && partnerBook.bookImage ? (
              <Image
                src={partnerBook.bookImage}
                alt={partnerBook.bookName}
                fill
                className="object-cover"
                onError={() =>
                  setImageError(prev => ({ ...prev, partner: true }))
                }
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900 text-center line-clamp-2">
            {partnerBook.bookName}
          </p>
          <span className="text-xs text-gray-500 mt-1">상대 책</span>
        </div>
      </div>

      {/* 액션 버튼 */}
      {renderActions()}
    </div>
  )
}

ExchangeRequestCard.displayName = 'ExchangeRequestCard'
