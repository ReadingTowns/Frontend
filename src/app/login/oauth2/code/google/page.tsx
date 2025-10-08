'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function GoogleOAuthCallbackContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Google OAuth 콜백 처리
    // 백엔드로 직접 리다이렉트하여 쿠키 설정 후 /auth/callback으로 돌아옴
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      // 에러 처리
      window.location.href = `/login?error=${encodeURIComponent(error)}`
      return
    }

    if (code) {
      // 백엔드로 직접 리다이렉트 (백엔드가 쿠키 설정 후 /auth/callback으로 리다이렉트)
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      window.location.href = `${backendUrl}/login/oauth2/code/google?code=${code}&state=${state}`
    } else {
      // 인증 코드가 없으면 로그인 페이지로
      window.location.href = '/login?error=no_code'
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
        <p className="text-gray-500">Google 로그인 처리 중...</p>
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
