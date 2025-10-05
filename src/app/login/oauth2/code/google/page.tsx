'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

function GoogleOAuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        if (error) {
          setErrorMessage(`Google 로그인 실패: ${error}`)
          setStatus('error')
          return
        }

        if (!code) {
          setErrorMessage('인증 코드가 없습니다.')
          setStatus('error')
          return
        }

        // OAuth 콜백을 백엔드로 전달
        const response = await fetch(
          `https://api.readingtown.site/login/oauth2/code/google?code=${code}&state=${state}`,
          {
            method: 'GET',
            credentials: 'include',
            redirect: 'manual', // 수동으로 리다이렉트 처리
          }
        )

        if (
          response.type === 'opaqueredirect' ||
          response.status === 302 ||
          response.ok
        ) {
          setStatus('success')

          // 쿠키가 설정되었다고 가정하고 사용자 정보 확인
          localStorage.setItem('lastProvider', 'google')

          // 인증 상태 업데이트
          queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })

          // 인증 상태 확인을 위한 리다이렉트
          setTimeout(() => {
            router.push('/auth/redirect')
          }, 1000)
        } else {
          // 에러 응답 처리
          const errorText = await response.text()
          console.error('OAuth callback error:', errorText)
          setErrorMessage('Google 로그인 처리 중 오류가 발생했습니다.')
          setStatus('error')
        }
      } catch (error) {
        console.error('Google OAuth callback error:', error)

        // CORS 에러일 가능성이 높으므로 직접 리다이렉트 시도
        if (
          error instanceof TypeError &&
          error.message.includes('Failed to fetch')
        ) {
          // 백엔드로 직접 리다이렉트
          const code = searchParams.get('code')
          const state = searchParams.get('state')
          if (code) {
            window.location.href = `https://api.readingtown.site/login/oauth2/code/google?code=${code}&state=${state}`
            return
          }
        }

        setErrorMessage('로그인 처리 중 오류가 발생했습니다.')
        setStatus('error')
      }
    }

    handleCallback()
  }, [searchParams, router, queryClient])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-500">Google 로그인 처리 중...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-green-600 font-medium">Google 로그인 성공!</p>
          <p className="text-gray-500 text-sm mt-1">홈으로 이동 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          로그인 실패
        </h2>
        <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-primary-400 text-white rounded-lg text-sm font-medium hover:bg-primary-500"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    </div>
  )
}

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      }
    >
      <GoogleOAuthCallbackContent />
    </Suspense>
  )
}
