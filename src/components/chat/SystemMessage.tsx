'use client'

/**
 * SystemMessage Component
 * 시스템 메시지를 표시하는 컴포넌트
 * 교환 상태 변경 등 자동 생성된 메시지 표시
 */

import { MessageType } from '@/types/exchange'
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface SystemMessageProps {
  messageType: MessageType
  messageText: string
  sentTime: string
}

/**
 * 메시지 타입별 아이콘 매핑
 */
const getIconByType = (type: MessageType) => {
  const iconClassName = 'w-4 h-4'

  switch (type) {
    case MessageType.EXCHANGE_ACCEPTED:
      return <CheckCircleIcon className={`${iconClassName} text-green-600`} />
    case MessageType.EXCHANGE_REJECTED:
      return <XCircleIcon className={`${iconClassName} text-red-600`} />
    case MessageType.EXCHANGE_RESERVED:
      return <ClockIcon className={`${iconClassName} text-blue-600`} />
    case MessageType.EXCHANGE_COMPLETED:
      return <CheckCircleIcon className={`${iconClassName} text-purple-600`} />
    case MessageType.EXCHANGE_RETURNED:
      return <ArrowPathIcon className={`${iconClassName} text-gray-600`} />
    case MessageType.SYSTEM:
    default:
      return <ClockIcon className={`${iconClassName} text-gray-500`} />
  }
}

/**
 * 메시지 타입별 스타일 매핑
 */
const getStyleByType = (type: MessageType) => {
  switch (type) {
    case MessageType.EXCHANGE_ACCEPTED:
      return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
    case MessageType.EXCHANGE_REJECTED:
      return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    case MessageType.EXCHANGE_RESERVED:
      return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
    case MessageType.EXCHANGE_COMPLETED:
      return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
    case MessageType.EXCHANGE_RETURNED:
      return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    case MessageType.SYSTEM:
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  }
}

export function SystemMessage({
  messageType,
  messageText,
  sentTime,
}: SystemMessageProps) {
  const icon = getIconByType(messageType)
  const styleClass = getStyleByType(messageType)

  return (
    <div className="flex justify-center my-4">
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full text-sm
          ${styleClass}
        `}
      >
        {icon}
        <span className="font-medium">{messageText}</span>
        <span className="text-xs opacity-70">
          {new Date(sentTime).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  )
}

SystemMessage.displayName = 'SystemMessage'
