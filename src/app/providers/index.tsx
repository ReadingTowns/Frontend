'use client'

import { ReactNode } from 'react'
import QueryProvider from './QueryProvider'
import { SnackbarProvider } from '@/contexts/SnackbarContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <SnackbarProvider>{children}</SnackbarProvider>
    </QueryProvider>
  )
}
