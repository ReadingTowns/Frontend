'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

function KakaoCallbackContent() {
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
          setErrorMessage(`카카오 로그인 실패: ${error}`)
          setStatus('error')
          return
        }

        if (!code) {
          setErrorMessage('인증 코드가 없습니다.')
          setStatus('error')
          return
        }

        // OAuth 콜백 처리
        const response = await fetch(
          `/api/auth/callback/kakao?code=${code}&state=${state}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setStatus('success')

            // API Route에서 Set-Cookie 헤더로 쿠키가 자동 설정됨
            // 제공자 정보 저장
            localStorage.setItem('lastProvider', 'kakao')

            // 인증 상태 업데이트
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })

            // 리다이렉트 페이지로 이동
            setTimeout(() => {
              router.push('/auth/redirect')
            }, 1000)
          } else {
            setErrorMessage(data.message || '카카오 로그인에 실패했습니다.')
            setStatus('error')
          }
        } else {
          setErrorMessage('서버 응답 오류입니다.')
          setStatus('error')
        }
      } catch (error) {
        console.error('Kakao OAuth callback error:', error)
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-500">카카오 로그인 처리 중...</p>
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
          <p className="text-green-600 font-medium">카카오 로그인 성공!</p>
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
          className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg text-sm font-medium hover:bg-yellow-500"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    </div>
  )
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  )
}
