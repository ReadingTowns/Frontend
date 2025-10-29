'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { HeaderConfig } from '@/types/header'

interface HeaderContextType {
  headerContent: ReactNode | null
  setHeaderContent: (content: ReactNode | null) => void
  headerConfig: HeaderConfig | null
  setHeaderConfig: (config: HeaderConfig | null) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerContent, setHeaderContent] = useState<ReactNode | null>(null)
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig | null>(null)

  return (
    <HeaderContext.Provider
      value={{ headerContent, setHeaderContent, headerConfig, setHeaderConfig }}
    >
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}
