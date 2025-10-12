'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type {
  SnackbarMessage,
  SnackbarType,
  SnackbarContextValue,
} from '@/types/snackbar'
import SnackbarContainer from '@/components/common/SnackbarContainer'

const SnackbarContext = createContext<SnackbarContextValue | undefined>(
  undefined
)

interface SnackbarProviderProps {
  children: ReactNode
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([])

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id))
  }, [])

  const showSnackbar = useCallback(
    (message: string, type: SnackbarType = 'info', duration = 3000) => {
      const id = `${Date.now()}-${Math.random()}`
      const newMessage: SnackbarMessage = {
        id,
        message,
        type,
        duration,
      }

      setMessages(prev => [...prev, newMessage])

      // 자동 제거
      if (duration > 0) {
        setTimeout(() => {
          removeMessage(id)
        }, duration)
      }
    },
    [removeMessage]
  )

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showSnackbar(message, 'success', duration)
    },
    [showSnackbar]
  )

  const showError = useCallback(
    (message: string, duration?: number) => {
      showSnackbar(message, 'error', duration)
    },
    [showSnackbar]
  )

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showSnackbar(message, 'warning', duration)
    },
    [showSnackbar]
  )

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showSnackbar(message, 'info', duration)
    },
    [showSnackbar]
  )

  const value: SnackbarContextValue = {
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <SnackbarContainer messages={messages} onRemove={removeMessage} />
    </SnackbarContext.Provider>
  )
}

export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext)
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}
