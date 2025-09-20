'use client'

import { useAuth } from '@/hooks/useAuth'
import {
  GoogleLoginButton,
  KakaoLoginButton,
} from '@/components/auth/SocialLoginButtons'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const handleGoogleLogin = () => {
    // API Routes를 통해 백엔드 OAuth2 엔드포인트로 리다이렉트
    window.location.assign('/api/oauth2/authorization/google')
  }

  const handleKakaoLogin = () => {
    // API Routes를 통해 백엔드 OAuth2 엔드포인트로 리다이렉트
    window.location.assign('/api/oauth2/authorization/kakao')
  }

  // 인증된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/home')
    }
  }, [isAuthenticated, isLoading, router])

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-500">로딩 중...</p>
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
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          로그인하여 리딩타운의 모든 서비스를 이용하세요
        </p>
      </div>
    </div>
  )
}
