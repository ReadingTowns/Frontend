'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthRedirectPage() {
  const { isAuthenticated, isNewUser, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // 인증되지 않은 경우 로그인 페이지로
        router.push('/login')
        return
      }

      if (isNewUser) {
        // 신규 사용자는 온보딩으로
        router.push('/onboarding')
        return
      }

      // 기존 사용자는 홈으로
      router.push('/home')
    }
  }, [isAuthenticated, isNewUser, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          로그인 처리 중...
        </h2>
        <p className="text-gray-600">잠시만 기다려주세요</p>
      </div>
    </div>
  )
}
