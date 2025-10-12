'use client'

import { useEffect, useState } from 'react'
import type { SnackbarMessage } from '@/types/snackbar'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface SnackbarContainerProps {
  messages: SnackbarMessage[]
  onRemove: (id: string) => void
}

export default function SnackbarContainer({
  messages,
  onRemove,
}: SnackbarContainerProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-[430px] px-4 pointer-events-none">
      {messages.map(message => (
        <SnackbarItem
          key={message.id}
          message={message}
          onRemove={() => onRemove(message.id)}
        />
      ))}
    </div>
  )
}

interface SnackbarItemProps {
  message: SnackbarMessage
  onRemove: () => void
}

function SnackbarItem({ message, onRemove }: SnackbarItemProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 마운트 시 애니메이션
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    // 애니메이션 후 제거
    setTimeout(onRemove, 300)
  }

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
      case 'error':
        return <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 flex-shrink-0" />
    }
  }

  const getStyles = () => {
    switch (message.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        transition-all duration-300 pointer-events-auto
        ${getStyles()}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      {getIcon()}
      <p className="flex-1 text-sm font-medium">{message.message}</p>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="닫기"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
