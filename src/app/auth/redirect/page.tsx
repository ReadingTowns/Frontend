'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthRedirectPage() {
  const {
    isAuthenticated,
    isOnboardingCompleted,
    isLoading,
    isOnboardingLoading,
  } = useAuth()
  const router = useRouter()
  const [retryCount, setRetryCount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // 이미 처리 중이면 중복 실행 방지
    if (isProcessing) return

    // 로딩 중이면 대기 (인증 또는 온보딩 데이터)
    if (isLoading || isOnboardingLoading) return

    // 인증된 경우 라우팅 처리
    if (isAuthenticated) {
      setIsProcessing(true)
      if (!isOnboardingCompleted) {
        router.push('/onboarding')
      } else {
        router.push('/home')
      }
      return
    }

    // 인증되지 않았지만 재시도 가능한 경우
    if (!isAuthenticated && retryCount < 3) {
      // OAuth 콜백 직후에는 쿠키가 설정되었지만
      // TanStack Query 캐시가 업데이트되지 않았을 수 있음
      // 짧은 딜레이 후 재시도
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1)
      }, 300)
      return () => clearTimeout(timer)
    }

    // 3번 재시도 후에도 인증되지 않으면 로그인으로
    if (!isAuthenticated && retryCount >= 3) {
      setIsProcessing(true)
      router.push('/login')
    }
  }, [
    isAuthenticated,
    isOnboardingCompleted,
    isLoading,
    isOnboardingLoading,
    router,
    retryCount,
    isProcessing,
  ])

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
