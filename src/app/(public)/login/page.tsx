'use client'

import { useAuth } from '@/hooks/useAuth'
import {
  GoogleLoginButton,
  KakaoLoginButton,
} from '@/components/auth/SocialLoginButtons'
import { DevLoginButton } from '@/components/auth/DevLoginButton'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isDevLoading, setIsDevLoading] = useState(false)

  const handleGoogleLogin = () => {
    // API Routes를 통해 백엔드 OAuth2 엔드포인트로 리다이렉트
    window.location.assign('/api/oauth2/authorization/google')
  }

  const handleKakaoLogin = () => {
    // API Routes를 통해 백엔드 OAuth2 엔드포인트로 리다이렉트
    window.location.assign('/api/oauth2/authorization/kakao')
  }

  const handleDevLogin = async () => {
    setIsDevLoading(true)
    try {
      const response = await fetch('/api/auth/dev-login', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // 인증 상태 업데이트
          await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })

          // 제공자 정보 저장
          localStorage.setItem('lastProvider', 'dev')

          // 홈으로 리다이렉트
          router.push('/home')
        }
      }
    } catch (error) {
      console.error('Dev login error:', error)
      setIsDevLoading(false)
    }
  }

  // 인증된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/home')
    }
  }, [isAuthenticated, isLoading, router])

  // 로딩 중일 때
  if (isLoading || isDevLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-500">
            {isDevLoading ? '개발자 로그인 처리 중...' : '로딩 중...'}
          </p>
        </div>
      </div>
    )
  }

  // 인증된 사용자는 리다이렉트 중이므로 로딩 화면 표시
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-500">홈으로 이동 중...</p>
        </div>
      </div>
    )
  }

  // 미인증 사용자 - 로그인 화면
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">리딩타운</h1>
        <p className="text-gray-600">책으로 이웃과 연결되는 공간</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <GoogleLoginButton onClick={handleGoogleLogin} />
        <KakaoLoginButton onClick={handleKakaoLogin} />

        {/* 환경 변수로 제어되는 개발자 로그인 버튼 */}
        {process.env.NEXT_PUBLIC_SHOW_DEV_LOGIN === 'true' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Dev Mode</span>
              </div>
            </div>
            <DevLoginButton onClick={handleDevLogin} />
          </>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          로그인하여 리딩타운의 모든 서비스를 이용하세요
        </p>
      </div>
    </div>
  )
}
