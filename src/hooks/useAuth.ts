'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  profileImage?: string
  provider: 'google' | 'kakao'
  isAuthenticated: boolean
  onboardingCompleted?: boolean
  memberId?: number
}

interface AuthResponse {
  success: boolean
  user?: User
  message?: string
}

const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: authKeys.me(),
    queryFn: async (): Promise<AuthResponse> => {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      return response.json()
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: unknown) => {
      // 401 (Unauthorized) 또는 404 (Not Found) 시 재시도 안함
      if (error && typeof error === 'object' && 'status' in error) {
        const status = error.status as number
        if (status === 401 || status === 404) {
          return false
        }
      }
      return failureCount < 1 // 재시도 횟수를 1번으로 줄임
    },
    retryDelay: 500, // 재시도 간격을 500ms로 단축
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      return response.json()
    },
    onSuccess: () => {
      // localStorage 정리 (개발 환경에서 MSW가 사용하는 정보)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lastProvider')
      }

      queryClient.setQueryData(authKeys.me(), {
        success: false,
        user: undefined,
      })
      queryClient.invalidateQueries({ queryKey: authKeys.all })

      // 루트로 리다이렉트 (미들웨어에서 /login으로 리다이렉트됨)
      router.push('/')
    },
  })

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })

  return {
    user: authData?.user,
    isAuthenticated: authData?.success || false,
    isNewUser: authData?.success && !authData?.user?.onboardingCompleted,
    isLoading,
    error,
    logout: logoutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshTokenMutation.isPending,
  }
}
