/**
 * Exchange Message Utilities
 * 교환 메시지 타입 판단 및 상태 히스토리 추출 유틸리티
 */

import type { Message } from '@/types/chatroom'
import { MessageType } from '@/types/exchange'
import {
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { withJosa } from '@/utils/koreanParticle'

/**
 * 상태 히스토리 아이템
 */
export interface StatusHistoryItem {
  status:
    | 'REQUEST'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'CANCELED'
    | 'RESERVED'
    | 'COMPLETED'
    | 'RETURNED'
  timestamp: string
  actor: 'me' | 'partner'
  actorName: string
  messageId: number
}

/**
 * 카드 내부로 통합할 메시지 타입인지 판단
 * ACCEPTED, REJECTED, CANCELED는 카드 내부 상태로 표시
 */
export function shouldIntegrateIntoCard(messageType?: MessageType): boolean {
  if (!messageType) return false

  return [
    MessageType.EXCHANGE_ACCEPTED,
    MessageType.EXCHANGE_REJECTED,
    MessageType.EXCHANGE_CANCELED,
  ].includes(messageType)
}

/**
 * 별도 메시지로 유지할 타입인지 판단 (internal use only)
 * RESERVED, COMPLETED, RETURNED는 시스템 메시지로 유지
 */
function shouldRenderAsSeparateMessage(messageType?: MessageType): boolean {
  if (!messageType) return false

  return [
    MessageType.EXCHANGE_RESERVED,
    MessageType.EXCHANGE_COMPLETED,
    MessageType.EXCHANGE_RETURNED,
  ].includes(messageType)
}

/**
 * 메시지 타입을 상태로 변환
 */
function messageTypeToStatus(
  messageType: MessageType
): StatusHistoryItem['status'] | null {
  switch (messageType) {
    case MessageType.EXCHANGE_REQUEST:
      return 'REQUEST'
    case MessageType.EXCHANGE_ACCEPTED:
      return 'ACCEPTED'
    case MessageType.EXCHANGE_REJECTED:
      return 'REJECTED'
    case MessageType.EXCHANGE_CANCELED:
      return 'CANCELED'
    case MessageType.EXCHANGE_RESERVED:
      return 'RESERVED'
    case MessageType.EXCHANGE_COMPLETED:
      return 'COMPLETED'
    case MessageType.EXCHANGE_RETURNED:
      return 'RETURNED'
    default:
      return null
  }
}

/**
 * 메시지 배열에서 특정 교환의 상태 히스토리 추출
 *
 * @param messages 전체 메시지 배열
 * @param relatedExchangeStatusId 추출할 교환의 ID
 * @param currentUserId 현재 사용자 ID
 * @param partnerName 상대방 이름
 * @returns 상태 히스토리 배열 (시간순 정렬)
 */
export function extractStatusHistory(
  messages: Message[],
  relatedExchangeStatusId: number | null,
  currentUserId?: number,
  partnerName?: string
): StatusHistoryItem[] {
  if (!relatedExchangeStatusId) return []

  const history: StatusHistoryItem[] = []

  // 관련된 메시지만 필터링
  const relatedMessages = messages.filter(
    msg =>
      msg.relatedExchangeStatusId === relatedExchangeStatusId &&
      msg.messageType &&
      [
        MessageType.EXCHANGE_REQUEST,
        MessageType.EXCHANGE_ACCEPTED,
        MessageType.EXCHANGE_REJECTED,
        MessageType.EXCHANGE_CANCELED,
        MessageType.EXCHANGE_RESERVED,
        MessageType.EXCHANGE_COMPLETED,
        MessageType.EXCHANGE_RETURNED,
      ].includes(msg.messageType)
  )

  // 상태 히스토리 생성
  for (const message of relatedMessages) {
    const status = messageTypeToStatus(message.messageType!)
    if (!status) continue

    const isMyAction =
      currentUserId !== undefined && message.senderId === currentUserId
    const actorName = isMyAction ? '내' : partnerName || '상대방'

    history.push({
      status,
      timestamp: message.sentTime,
      actor: isMyAction ? 'me' : 'partner',
      actorName,
      messageId: message.messageId,
    })
  }

  // 시간순 정렬 (오래된 것부터)
  return history.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
}

/**
 * 상태에 따른 표시 텍스트 반환
 */
export function getStatusDisplayText(
  status: StatusHistoryItem['status'],
  actorName: string
): string {
  switch (status) {
    case 'REQUEST':
      return `${withJosa(actorName, '이/가')} 요청함`
    case 'ACCEPTED':
      return `${withJosa(actorName, '이/가')} 수락함`
    case 'REJECTED':
      return `${withJosa(actorName, '이/가')} 거절함`
    case 'CANCELED':
      return `${withJosa(actorName, '이/가')} 취소함`
    case 'RESERVED':
      return '교환이 예약됨'
    case 'COMPLETED':
      return '교환이 완료됨'
    case 'RETURNED':
      return '교환이 반납됨'
    default:
      return ''
  }
}

/**
 * 상태에 따른 아이콘 컴포넌트 반환
 */
export function getStatusIcon(
  status: StatusHistoryItem['status']
): React.ComponentType<{ className?: string }> {
  switch (status) {
    case 'REQUEST':
      return PaperAirplaneIcon
    case 'ACCEPTED':
      return CheckCircleIcon
    case 'REJECTED':
      return XCircleIcon
    case 'CANCELED':
      return NoSymbolIcon
    case 'RESERVED':
      return ClockIcon
    case 'COMPLETED':
      return SparklesIcon
    case 'RETURNED':
      return ArrowPathIcon
    default:
      return NoSymbolIcon
  }
}

/**
 * 시간 포맷 (HH:MM)
 */
export function formatStatusTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
