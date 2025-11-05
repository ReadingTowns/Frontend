'use client'

/**
 * ExchangeStatusMessage Component
 * 교환 상태 메시지 - 수락/거절/예약/완료 등 상태별 색상 표시
 */

import { MessageType } from '@/types/exchange'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

interface ExchangeStatusMessageProps {
  messageType: MessageType
  messageText: string
  sentTime: string
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
 */
const getStyleByStatus = (type: MessageType) => {
  switch (type) {
    case MessageType.EXCHANGE_ACCEPTED:
      return {
        container:
          'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
        icon: 'text-green-600 dark:text-green-400',
        text: 'text-green-900 dark:text-green-100',
        time: 'text-green-600 dark:text-green-400',
      }
    case MessageType.EXCHANGE_REJECTED:
      return {
        container:
          'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
        icon: 'text-red-600 dark:text-red-400',
        text: 'text-red-900 dark:text-red-100',
        time: 'text-red-600 dark:text-red-400',
      }
    case MessageType.EXCHANGE_RESERVED:
      return {
        container:
          'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
        icon: 'text-blue-600 dark:text-blue-400',
        text: 'text-blue-900 dark:text-blue-100',
        time: 'text-blue-600 dark:text-blue-400',
      }
    case MessageType.EXCHANGE_COMPLETED:
      return {
        container:
          'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
        icon: 'text-purple-600 dark:text-purple-400',
        text: 'text-purple-900 dark:text-purple-100',
        time: 'text-purple-600 dark:text-purple-400',
      }
    case MessageType.EXCHANGE_RETURNED:
      return {
        container:
          'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
        icon: 'text-gray-600 dark:text-gray-400',
        text: 'text-gray-900 dark:text-gray-100',
        time: 'text-gray-600 dark:text-gray-400',
      }
    default:
      return {
        container:
          'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
        icon: 'text-gray-600 dark:text-gray-400',
        text: 'text-gray-900 dark:text-gray-100',
        time: 'text-gray-600 dark:text-gray-400',
      }
  }
}

export function ExchangeStatusMessage({
  messageType,
  messageText,
  sentTime,
}: ExchangeStatusMessageProps) {
  const icon = getIconByStatus(messageType)
  const style = getStyleByStatus(messageType)

  return (
    <div className="flex justify-center my-3 px-4">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl border
          max-w-md w-full
          ${style.container}
        `}
      >
        <div className={style.icon}>{icon}</div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${style.text}`}>{messageText}</p>
          <p className={`text-xs mt-1 ${style.time}`}>
            {new Date(sentTime).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

ExchangeStatusMessage.displayName = 'ExchangeStatusMessage'
