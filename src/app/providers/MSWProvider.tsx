'use client'

import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      import('@/mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'warn',
          serviceWorker: {
            url: '/mockServiceWorker.js'
          }
        }).then(() => {
          console.log('MSW started successfully!')
          setMswReady(true)
        })
      })
    } else {
      setMswReady(true)
    }
  }, [])

  if (!mswReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-500">MSW 초기화 중...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}