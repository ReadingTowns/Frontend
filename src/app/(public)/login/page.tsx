'use client'

import { useAuth } from '@/hooks/useAuth'
import {
  GoogleLoginButton,
  KakaoLoginButton,
} from '@/components/auth/SocialLoginButtons'
import { DevLoginButton } from '@/components/auth/DevLoginButton'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { useQueryClient } from '@tanstack/react-query'

function LoginContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [isDevLoading, setIsDevLoading] = useState(false)
  const [justLoggedOut, setJustLoggedOut] = useState(false)

  const handleGoogleLogin = () => {
    // 백엔드 OAuth2 엔드포인트로 직접 리다이렉트
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
    const origin = window.location.origin
    const redirectUri = `${origin}/auth/callback`
    window.location.assign(
      `${backendUrl}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectUri)}`
    )
  }

  const handleKakaoLogin = () => {
    // 백엔드 OAuth2 엔드포인트로 직접 리다이렉트
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
    const origin = window.location.origin
    const redirectUri = `${origin}/auth/callback`
    window.location.assign(
      `${backendUrl}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(redirectUri)}`
    )
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

  // 로그아웃 직후인지 먼저 확인 (쿼리 파라미터 또는 sessionStorage)
  useEffect(() => {
    const logoutParam = searchParams.get('logout')
    const sessionLogout = sessionStorage.getItem('justLoggedOut')

    if (logoutParam === 'true' || sessionLogout === 'true') {
      setJustLoggedOut(true)
      // 로그아웃 플래그 제거
      sessionStorage.removeItem('justLoggedOut')
      // 인증 캐시 강제 초기화
      queryClient.setQueryData(['auth', 'me'], {
        code: 401,
        message: 'Unauthorized',
        result: null,
      })
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      queryClient.removeQueries() // 모든 쿼리 제거

      // URL에서 logout 파라미터 제거
      if (logoutParam) {
        router.replace('/login', { scroll: false })
      }

      // 일정 시간 후 로그아웃 상태 해제 (사용자가 다시 로그인할 수 있도록)
      const timer = setTimeout(() => {
        setJustLoggedOut(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [searchParams, queryClient, router])

  // 인증된 사용자는 홈으로 리다이렉트 (단, 로그아웃 직후 1초간 제외)
  useEffect(() => {
    // 로그아웃 직후에는 리다이렉트하지 않음
    if (justLoggedOut) {
      return
    }

    // 정상적으로 로그인된 사용자는 홈으로 리다이렉트
    if (isAuthenticated && !isLoading) {
      router.push('/home')
    }
  }, [isAuthenticated, isLoading, router, justLoggedOut])

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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
