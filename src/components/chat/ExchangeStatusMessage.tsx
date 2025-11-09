'use client'

/**
 * ExchangeStatusMessage Component
 * 교환 상태 메시지 - 수락/거절/예약/완료 등 상태별 색상 표시
 */

import { useState } from 'react'
import { MessageType } from '@/types/exchange'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SparklesIcon,
  ArrowPathIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useCompleteExchange, useReturnExchange } from '@/hooks/useExchange'
import { useExchangeBooks } from '@/hooks/useChatRoom'
import { Modal } from '@/components/common/Modal'
import type { Message } from '@/types/chatroom'

interface ExchangeStatusMessageProps {
  messageType: MessageType
  messageText: string
  sentTime: string
  isOwn: boolean
  showAvatar: boolean
  partnerName?: string
  chatroomId?: number
  messages?: Message[]
}

/**
 * 상태별 아이콘 매핑
 */
const getIconByStatus = (type: MessageType) => {
  const iconClassName = 'w-5 h-5'

  switch (type) {
    case MessageType.EXCHANGE_ACCEPTED:
      return <CheckCircleIcon className={iconClassName} />
    case MessageType.EXCHANGE_REJECTED:
      return <XCircleIcon className={iconClassName} />
    case MessageType.EXCHANGE_CANCELED:
      return <XCircleIcon className={iconClassName} />
    case MessageType.EXCHANGE_RESERVED:
      return <ClockIcon className={iconClassName} />
    case MessageType.EXCHANGE_COMPLETED:
      return <SparklesIcon className={iconClassName} />
    case MessageType.EXCHANGE_RETURNED:
      return <ArrowPathIcon className={iconClassName} />
    default:
      return <CheckCircleIcon className={iconClassName} />
  }
}

/**
 * 상태별 스타일 매핑
 * - 배경색 제거, outline만 사용
 * - 다크모드 제거
 * - 연한 톤 사용 (300 계열)
 * - 초록색 → primary color 변경
 */
const getStyleByStatus = (type: MessageType) => {
  switch (type) {
    case MessageType.EXCHANGE_ACCEPTED:
      return {
        container: 'bg-white border-2 border-primary-300',
        icon: 'text-primary-400',
        text: 'text-gray-900',
        time: 'text-gray-600',
      }
    case MessageType.EXCHANGE_REJECTED:
      return {
        container: 'bg-white border-2 border-red-300',
        icon: 'text-red-500',
        text: 'text-gray-900',
        time: 'text-gray-600',
      }
    case MessageType.EXCHANGE_CANCELED:
      return {
        container: 'bg-white border-2 border-gray-300',
        icon: 'text-gray-500',
        text: 'text-gray-900',
        time: 'text-gray-600',
      }
    case MessageType.EXCHANGE_RESERVED:
      return {
        container: 'bg-white border-2 border-primary-200',
        icon: 'text-secondary-200',
        text: 'text-gray-900',
        time: 'text-gray-600',
      }
    case MessageType.EXCHANGE_COMPLETED:
      return {
        container: 'bg-white border-2 border-secondary-200',
        icon: 'text-secondary-600',
        text: 'text-gray-900',
        time: 'text-gray-600',
      }
    case MessageType.EXCHANGE_RETURNED:
      return {
        container: 'bg-white border-2 border-secondary-200',
        icon: 'text-secondary-600',
        text: 'text-gray-900',
        time: 'text-gray-600',
      }
    default:
      return {
        container: 'bg-white border-2 border-gray-300',
        icon: 'text-gray-500',
        text: 'text-gray-900',
        time: 'text-gray-600',
      }
  }
}

export function ExchangeStatusMessage({
  messageType,
  messageText,
  sentTime,
  isOwn,
  showAvatar,
  partnerName,
  chatroomId,
  messages = [],
}: ExchangeStatusMessageProps) {
  const icon = getIconByStatus(messageType)
  const style = getStyleByStatus(messageType)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const completeMutation = useCompleteExchange(chatroomId || 0)
  const returnMutation = useReturnExchange(chatroomId || 0)

  // 실시간 교환 책 상태 조회 (시스템 메시지 렌더링 시마다 조회)
  const { data: exchangeBooks } = useExchangeBooks(chatroomId || 0)

  // 1. 양쪽 책 모두 EXCHANGED 상태인지 확인 (교환 완료됨)
  const isBothBooksExchanged =
    exchangeBooks?.myBook.isAccepted === 'EXCHANGED' &&
    exchangeBooks?.partnerBook.isAccepted === 'EXCHANGED'

  // 2. books가 null인 경우 체크 (반납 완료 상태)
  const isBooksReturned =
    exchangeBooks?.myBook.isAccepted === null &&
    exchangeBooks?.partnerBook.isAccepted === null

  // 3. RETURNED 메시지 존재 여부 체크 (추가 안전장치)
  const hasReturnedMessage = messages.some(
    msg => msg.messageType === MessageType.EXCHANGE_RETURNED
  )

  // 4. 버튼을 숨겨야 하는 상황 (이중 체크)
  const shouldHideButtons = isBooksReturned || hasReturnedMessage

  // RESERVED 또는 COMPLETED는 시스템 메시지로 중앙 정렬
  const isSystemMessage =
    messageType === MessageType.EXCHANGE_RESERVED ||
    messageType === MessageType.EXCHANGE_COMPLETED ||
    messageType === MessageType.EXCHANGE_RETURNED

  const handleCompleteClick = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmComplete = () => {
    completeMutation.mutate()
    setShowConfirmModal(false)
  }

  const handleReturnClick = () => {
    setShowReturnModal(true)
  }

  const handleConfirmReturn = () => {
    returnMutation.mutate()
    setShowReturnModal(false)
  }

  // 시스템 메시지 (중앙 정렬)
  if (isSystemMessage) {
    return (
      <div className="my-4 px-4">
        {/* 메시지 카드 */}
        <div
          className={`mx-auto max-w-md rounded-xl ${style.container} px-4 py-3`}
        >
          {/* 시간 */}
          <p className="text-center text-xs text-gray-500 mb-2">
            {new Date(sentTime).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className={style.icon}>{icon}</div>
            <p className={`text-sm font-medium ${style.text}`}>{messageText}</p>
          </div>

          {/* 교환 완료 버튼 (RESERVED일 때만, 교환 완료되지 않았고 반납되지 않았을 때만) */}
          {messageType === MessageType.EXCHANGE_RESERVED &&
            chatroomId &&
            !isBothBooksExchanged &&
            !shouldHideButtons && (
              <button
                onClick={handleCompleteClick}
                disabled={completeMutation.isPending}
                className="w-full mt-3 py-2 bg-primary-400 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {completeMutation.isPending ? '처리 중...' : '교환 완료'}
              </button>
            )}

          {/* 반납 완료 버튼 (COMPLETED일 때만, 반납되지 않았을 때만) */}
          {messageType === MessageType.EXCHANGE_COMPLETED &&
            chatroomId &&
            !shouldHideButtons && (
              <button
                onClick={handleReturnClick}
                disabled={returnMutation.isPending}
                className="w-full mt-3 py-2 bg-secondary-200 hover:bg-secondary-300 text-gray-800 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {returnMutation.isPending ? '처리 중...' : '반납 완료'}
              </button>
            )}
        </div>

        {/* 교환 완료 확인 모달 */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="교환 완료 확인"
          size="sm"
        >
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-6">
              교환을 완료하시겠습니까? 완료 후에는 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmComplete}
                disabled={completeMutation.isPending}
                className="flex-1 py-2 bg-primary-400 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {completeMutation.isPending ? '처리 중...' : '확인'}
              </button>
            </div>
          </div>
        </Modal>

        {/* 반납 완료 확인 모달 */}
        <Modal
          isOpen={showReturnModal}
          onClose={() => setShowReturnModal(false)}
          title="반납 완료 확인"
          size="sm"
        >
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-6">
              책을 반납 완료하시겠습니까? 완료 후에는 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmReturn}
                disabled={returnMutation.isPending}
                className="flex-1 py-2 bg-secondary-200 hover:bg-secondary-300 text-gray-800 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {returnMutation.isPending ? '처리 중...' : '확인'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  // 일반 메시지 (기존 스타일)
  return (
    <div
      className={`flex gap-2 mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar for other user */}
      {!isOwn && (
        <div
          className={`w-8 h-8 flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}
        >
          {showAvatar && (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div
        className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}
      >
        {/* Sender name (only for others and first message in group) */}
        {!isOwn && showAvatar && partnerName && (
          <span className="text-xs text-gray-600 mb-1 ml-2">{partnerName}</span>
        )}

        <div
          className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {/* Status Message Card */}
          <div
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl
              ${style.container}
            `}
          >
            <div className={style.icon}>{icon}</div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${style.text}`}>
                {messageText}
              </p>
            </div>
          </div>

          {/* Time */}
          <div
            className={`flex items-center gap-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <span className="text-xs text-gray-500">
              {new Date(sentTime).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

ExchangeStatusMessage.displayName = 'ExchangeStatusMessage'
