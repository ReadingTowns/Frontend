'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthMeApiResponse, OnboardingCheckResponse } from '@/types/auth'
import { API_CODES } from '@/constants/apiCodes'
import { ApiResponse } from '@/types/common'

const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  onboarding: () => [...authKeys.all, 'onboarding'] as const,
}

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: authData, isLoading } = useQuery({
    queryKey: authKeys.me(),
    queryFn: async (): Promise<AuthMeApiResponse> => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const response = await fetch(`${backendUrl}/api/v1/members/me/profile`, {
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

  // 온보딩 완료 여부 확인
  const { data: onboardingData, isLoading: isOnboardingLoading } = useQuery({
    queryKey: authKeys.onboarding(),
    queryFn: async (): Promise<ApiResponse<OnboardingCheckResponse>> => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const response = await fetch(
        `${backendUrl}/api/v1/members/onboarding/check`,
        {
          credentials: 'include',
        }
      )
      return response.json()
    },
    enabled: authData?.code === API_CODES.SUCCESS && !!authData?.result, // 인증된 경우에만 실행
    staleTime: 1000 * 60 * 5,
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // 백엔드 로그아웃 API 호출 (쿠키 삭제)
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const response = await fetch(`${backendUrl}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      // 1. localStorage 정리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lastProvider')
        sessionStorage.setItem('justLoggedOut', 'true')
      }

      // 2. 로그인 페이지로 즉시 리다이렉트 (백엔드가 이미 쿠키 삭제함)
      // replace()를 사용하여 브라우저 히스토리를 대체하고 페이지 완전 리로드
      window.location.replace('/login?logout=true')

      return response.json()
    },
  })

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const response = await fetch(`${backendUrl}/api/v1/auth/reissue`, {
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
    user: authData?.result,
    isAuthenticated: authData?.code === API_CODES.SUCCESS && !!authData?.result,
    isOnboardingCompleted: onboardingData?.result?.isOnboarded ?? false, // 백엔드 필드명 isOnboarded 사용
    isLoading,
    isOnboardingLoading,
    logout: logoutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshTokenMutation.isPending,
  }
}
