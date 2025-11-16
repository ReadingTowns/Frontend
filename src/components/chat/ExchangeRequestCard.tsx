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

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { showError } from '@/lib/toast'
import type { ExchangeBookInfo, Message } from '@/types/chatroom'
import {
  useCreateExchangeRequest,
  useAcceptExchange,
  useRejectExchange,
  useCancelExchange,
} from '@/hooks/useExchange'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { BookSelectionModal } from './BookSelectionModal'
import {
  extractStatusHistory,
  getStatusDisplayText,
  getStatusIcon,
  formatStatusTime,
} from '@/utils/exchangeMessageUtils'

interface ExchangeRequestCardProps {
  myBook: ExchangeBookInfo
  partnerBook: ExchangeBookInfo
  chatroomId: number
  requestSenderId?: number
  currentUserId?: number
  partnerId?: string
  partnerName?: string
  relatedExchangeStatusId?: number | null
  showAvatar: boolean
  messages?: Message[] // 상태 히스토리 추출용
}

export function ExchangeRequestCard({
  myBook,
  partnerBook,
  chatroomId,
  requestSenderId,
  currentUserId,
  partnerId,
  partnerName,
  relatedExchangeStatusId,
  showAvatar,
  messages = [],
}: ExchangeRequestCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isBookSelectionModalOpen, setIsBookSelectionModalOpen] =
    useState(false)
  const [isNewRequestMode, setIsNewRequestMode] = useState(false) // REJECTED 상태용
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false) // 히스토리 펼치기 상태

  const createExchangeMutation = useCreateExchangeRequest(chatroomId)
  const acceptMutation = useAcceptExchange(chatroomId)
  const rejectMutation = useRejectExchange(chatroomId)
  const cancelMutation = useCancelExchange(chatroomId)

  // 상태 히스토리 추출
  const statusHistory = useMemo(
    () =>
      extractStatusHistory(
        messages,
        relatedExchangeStatusId ?? null,
        currentUserId,
        partnerName
      ),
    [messages, relatedExchangeStatusId, currentUserId, partnerName]
  )

  // relatedExchangeStatusId로 현재 교환 찾기 (만료 여부 포함)
  const currentExchange = useMemo(() => {
    if (myBook.exchangeStatusId === relatedExchangeStatusId) {
      return { book: myBook, isExpired: false }
    }
    if (partnerBook.exchangeStatusId === relatedExchangeStatusId) {
      return { book: partnerBook, isExpired: false }
    }
    // ⚠️ 만료된 교환 - MessageBubble에서 이미 처리되어야 하지만 방어 코드
    console.warn(
      '⚠️ Expired exchange in ExchangeRequestCard:',
      relatedExchangeStatusId
    )
    return { book: myBook, isExpired: true }
  }, [myBook, partnerBook, relatedExchangeStatusId])

  // 만료된 교환은 간단한 메시지만 표시
  if (currentExchange.isExpired) {
    return (
      <div className="my-4 mx-4 bg-gray-50 rounded-2xl border border-gray-300 p-5 text-center">
        <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 font-medium">만료된 교환 요청</p>
        <p className="text-xs text-gray-500 mt-1">
          이 교환 요청은 더 이상 유효하지 않습니다
        </p>
      </div>
    )
  }

  // 현재 교환의 상태
  const exchangeStatus = currentExchange.book.isAccepted
  const exchangeStatusId = currentExchange.book.exchangeStatusId

  // 상태 판단 로직 (현재 교환의 isAccepted 필드 기반)
  const isPending = exchangeStatus === 'PENDING'
  const isRequest = exchangeStatus === 'REQUEST'
  const isAccepted = exchangeStatus === 'ACCEPTED'
  const isRejected = exchangeStatus === 'REJECTED'
  const isReserved = exchangeStatus === 'RESERVED'
  const isExchanged = exchangeStatus === 'EXCHANGED'

  // 내가 요청자인지 판단
  // requestSenderId와 currentUserId를 비교
  // requestSenderId === currentUserId → 내가 보낸 요청
  // requestSenderId !== currentUserId → 받은 요청
  const isMyRequest =
    requestSenderId !== undefined &&
    currentUserId !== undefined &&
    requestSenderId === currentUserId
  const isPartnerRequest =
    requestSenderId !== undefined &&
    currentUserId !== undefined &&
    requestSenderId !== currentUserId

  // 헤더 텍스트
  const getHeaderText = () => {
    const bookTitle = currentExchange.book.bookName

    if (isExchanged) return `"${bookTitle}" 교환이 완료되었습니다`
    if (isReserved) return `"${bookTitle}" 교환이 예약되었습니다`
    if (isAccepted) return `"${bookTitle}" 교환 요청이 수락되었습니다`
    if (isRejected) return `"${bookTitle}" 교환 요청이 거절되었습니다`
    if (isRequest && isMyRequest) return `"${bookTitle}"을(를) 요청했습니다`
    if (isRequest && isPartnerRequest) return `"${bookTitle}"에 대한 교환 요청`
    if (isPending) return `"${bookTitle}" 교환 진행 중`
    return `"${bookTitle}" 교환 진행 중`
  }

  // 액션 버튼 렌더링
  const renderActions = () => {
    // EXCHANGED - 완료된 교환: 메시지만 표시
    if (isExchanged) {
      return (
        <div className="text-center py-3 text-green-600 font-medium">
          <CheckCircleIcon className="w-6 h-6 inline mr-2" />
          교환이 완료되었습니다
        </div>
      )
    }

    // RESERVED - 예약된 교환: 시스템 메시지에서 처리하므로 버튼 없음
    if (isReserved) {
      return null
    }

    // ACCEPTED - 수락됨: myBook이면 수락 완료, partnerBook이면 대기
    if (isAccepted) {
      // myBook이 수락된 경우 (내가 수락함)
      const isMyBookAccepted =
        currentExchange.book.exchangeStatusId === myBook.exchangeStatusId

      if (isMyBookAccepted) {
        // ✨ NEW: 상대방이 교환을 취소한 경우 (partnerBook = null)
        // 내가 수락했지만 상대방이 취소 → 새 교환 요청 보낼 수 있음
        if (partnerBook.exchangeStatusId === null) {
          console.log(
            '🟡 [ExchangeRequestCard] ACCEPTED but partner canceled:',
            {
              myBookStatus: myBook.isAccepted,
              partnerBookStatus: partnerBook.isAccepted,
              myBookId: myBook.exchangeStatusId,
              partnerBookId: partnerBook.exchangeStatusId,
            }
          )

          return (
            <button
              onClick={() => {
                setIsNewRequestMode(true)
                setIsBookSelectionModalOpen(true)
              }}
              className="w-full py-3 bg-primary-400 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors"
            >
              새 교환 요청 보내기
            </button>
          )
        }

        return (
          <div className="text-center py-3 text-green-600 font-medium">
            <CheckCircleIcon className="w-6 h-6 inline mr-2" />
            교환 요청을 수락했습니다
          </div>
        )
      }

      // partnerBook이 수락된 경우 (상대방이 수락함)
      return (
        <div className="text-center py-3 text-gray-600">
          <ClockIcon className="w-6 h-6 inline mr-2" />
          상대방의 응답을 기다리는 중입니다
        </div>
      )
    }

    // REJECTED - 거절됨
    if (isRejected) {
      // 디버깅 로그
      console.log('🔴 [ExchangeRequestCard] REJECTED state:', {
        isRejected,
        isMyRequest,
        isPartnerRequest,
        requestSenderId,
        currentUserId,
        exchangeStatus: currentExchange.book.isAccepted,
        bookName: currentExchange.book.bookName,
      })

      // 내가 요청자였다면 새 요청 버튼 표시
      if (isMyRequest) {
        return (
          <button
            onClick={() => {
              setIsNewRequestMode(true)
              setIsBookSelectionModalOpen(true)
            }}
            className="w-full py-3 bg-primary-400 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors"
          >
            새 교환 요청 보내기
          </button>
        )
      }
      // 상대가 요청자였다면 메시지만 표시
      return (
        <div className="text-center py-3 text-gray-600 font-medium">
          <XCircleIcon className="w-6 h-6 inline mr-2 text-red-500" />
          교환 요청이 거절되었습니다
        </div>
      )
    }

    // REQUEST - 요청 상태
    if (isRequest) {
      if (!exchangeStatusId) return null

      // 내가 요청자: 취소 버튼
      if (isMyRequest) {
        return (
          <button
            onClick={() => cancelMutation.mutate(exchangeStatusId)}
            disabled={cancelMutation.isPending}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelMutation.isPending ? '취소 중...' : '요청 취소'}
          </button>
        )
      }

      // 상대가 요청자: 수락/거절 버튼
      if (isPartnerRequest) {
        // partnerBook.bookhouseId null 여부로 첫 수락 vs 최종 확인 구분
        if (partnerBook.bookhouseId === null) {
          // B의 첫 수락: 모달 열어서 책 선택 → create + accept
          return (
            <div className="flex gap-3">
              <button
                onClick={() => rejectMutation.mutate(exchangeStatusId)}
                disabled={rejectMutation.isPending}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircleIcon className="w-5 h-5" />
                {rejectMutation.isPending ? '처리 중...' : '거절'}
              </button>
              <button
                onClick={() => {
                  setIsNewRequestMode(false)
                  setIsBookSelectionModalOpen(true)
                }}
                disabled={createExchangeMutation.isPending}
                className="flex-1 py-3 bg-primary-400 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                {createExchangeMutation.isPending ? '처리 중...' : '수락'}
              </button>
            </div>
          )
        } else {
          // A의 최종 확인: 바로 accept만 호출
          return (
            <div className="flex gap-3">
              <button
                onClick={() => rejectMutation.mutate(exchangeStatusId)}
                disabled={rejectMutation.isPending}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircleIcon className="w-5 h-5" />
                {rejectMutation.isPending ? '처리 중...' : '거절'}
              </button>
              <button
                onClick={() => acceptMutation.mutate(exchangeStatusId)}
                disabled={acceptMutation.isPending}
                className="flex-1 py-3 bg-primary-400 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                {acceptMutation.isPending ? '처리 중...' : '수락'}
              </button>
            </div>
          )
        }
      }
    }

    // PENDING - 대기 상태: 버튼 없음
    if (isPending) {
      return (
        <div className="text-center py-3 text-gray-600">
          <ClockIcon className="w-6 h-6 inline mr-2" />
          교환 진행 중
        </div>
      )
    }

    return null
  }

  return (
    <div
      className={`flex gap-2 mb-3 ${isMyRequest ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar for other user */}
      {!isMyRequest && (
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
        className={`max-w-[70%] ${isMyRequest ? 'items-end' : 'items-start'} flex flex-col`}
      >
        {/* Sender name (only for others and first message in group) */}
        {!isMyRequest && showAvatar && partnerName && (
          <span className="text-xs text-gray-600 mb-1 ml-2">{partnerName}</span>
        )}

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 w-full">
          {/* 헤더 */}
          <div className="text-center mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              {getHeaderText()}
            </h3>
          </div>

          {/* 책 정보 카드 - 요청된 책만 표시 */}
          <div className="flex flex-col items-center mb-5">
            <div className="w-32 h-44 bg-gray-100 rounded-lg overflow-hidden mb-3 relative shadow-sm">
              {!imageError && currentExchange.book.bookImage ? (
                <Image
                  src={currentExchange.book.bookImage}
                  alt={currentExchange.book.bookName}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
            <p className="text-base font-semibold text-gray-900 text-center line-clamp-2 px-4">
              {currentExchange.book.bookName}
            </p>
            {/* 요청 방향 뱃지 */}
            <span
              className={`text-xs px-3 py-1 rounded-full mt-2 ${
                isMyRequest
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-green-50 text-green-600'
              }`}
            >
              {isMyRequest ? '요청 보낸 책' : '요청받은 책'}
            </span>
          </div>

          {/* 상태 히스토리 */}
          {statusHistory.length === 1 &&
            (() => {
              // 히스토리가 1개일 때: 심플 UI (펼치기/접기 없음)
              const latestStatus = statusHistory[0]
              const StatusIcon = getStatusIcon(latestStatus.status)
              return (
                <div className="mb-5 border-t border-gray-200 pt-4">
                  <span className="text-sm font-medium text-gray-700 block mb-3">
                    교환 상태
                  </span>
                  <div className="flex items-start gap-3">
                    <StatusIcon className="w-5 h-5 flex-shrink-0 text-gray-600" />
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          latestStatus.actor === 'me'
                            ? 'text-primary-600'
                            : 'text-gray-700'
                        }`}
                      >
                        {getStatusDisplayText(
                          latestStatus.status,
                          latestStatus.actorName
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatStatusTime(latestStatus.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })()}

          {statusHistory.length > 1 && (
            // 히스토리가 2개 이상일 때: 타임라인 UI
            <div className="mb-5 border-t border-gray-200 pt-4">
              <button
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 transition-colors mb-3"
              >
                <span className="font-medium">교환 상태</span>
                {isHistoryExpanded ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </button>

              <div className="space-y-2">
                {/* 이전 히스토리 (펼쳤을 때만 표시) - 시간순 정렬 (과거→현재) */}
                {isHistoryExpanded &&
                  statusHistory.slice(0, -1).map(item => {
                    const HistoryIcon = getStatusIcon(item.status)
                    return (
                      <div
                        key={item.messageId}
                        className="flex items-start gap-3 pl-4 border-l-2 border-gray-200"
                      >
                        <HistoryIcon className="w-5 h-5 flex-shrink-0 text-gray-600" />
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              item.actor === 'me'
                                ? 'text-primary-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {getStatusDisplayText(item.status, item.actorName)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatStatusTime(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })}

                {/* 최신 상태 (항상 표시, 최하단) */}
                {(() => {
                  const latestStatus = statusHistory[statusHistory.length - 1]
                  const StatusIcon = getStatusIcon(latestStatus.status)
                  return (
                    <div className="flex items-start gap-3 pl-4 border-l-2 border-primary-400">
                      <StatusIcon className="w-5 h-5 flex-shrink-0 text-primary-600" />
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            latestStatus.actor === 'me'
                              ? 'text-primary-600'
                              : 'text-gray-700'
                          }`}
                        >
                          {getStatusDisplayText(
                            latestStatus.status,
                            latestStatus.actorName
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatStatusTime(latestStatus.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          {renderActions()}

          {/* 책 선택 모달 */}
          {partnerId && partnerName && (
            <BookSelectionModal
              isOpen={isBookSelectionModalOpen}
              onClose={() => {
                setIsBookSelectionModalOpen(false)
                setIsNewRequestMode(false)
              }}
              partnerId={partnerId}
              partnerName={partnerName}
              onConfirm={async bookhouseId => {
                try {
                  // 1단계: 새 교환 요청 생성
                  await createExchangeMutation.mutateAsync({
                    chatroomId,
                    bookhouseId,
                  })

                  // 2단계: isNewRequestMode가 false일 때만 accept 호출
                  // (REQUEST 상태에서 수락할 때만 accept 필요)
                  if (!isNewRequestMode && exchangeStatusId) {
                    await acceptMutation.mutateAsync(exchangeStatusId)
                  }

                  setIsBookSelectionModalOpen(false)
                  setIsNewRequestMode(false)
                } catch (error: unknown) {
                  console.error('Failed to create exchange request:', error)
                  // API 응답의 message 사용
                  const errorMessage =
                    (error as { message?: string })?.message ||
                    '교환 요청 생성에 실패했습니다.'
                  showError(errorMessage)
                  // 모달은 닫지 않음 (다른 책 선택 가능)
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

ExchangeRequestCard.displayName = 'ExchangeRequestCard'
