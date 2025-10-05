'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

export default function AuthCallbackPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    // 백엔드에서 OAuth 인증 성공 후 이 페이지로 리다이렉트됨
    // 이 시점에 이미 백엔드가 쿠키를 설정했어야 함

    // 인증 상태 새로고침
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })

    // 인증 확인 페이지로 이동
    router.push('/auth/redirect')
  }, [router, queryClient])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
        <p className="text-gray-500">로그인 처리 중...</p>
      </div>
    </div>
  )
}
