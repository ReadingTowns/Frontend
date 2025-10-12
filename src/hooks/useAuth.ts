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
  const { data: onboardingData } = useQuery({
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
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

      try {
        const response = await fetch(`${backendUrl}/api/v1/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        })

        // 401이나 다른 에러여도 무시 (로그아웃은 항상 성공 처리)
        if (response.ok) {
          return response.json()
        }

        // 401 등의 에러여도 성공으로 처리
        return { success: true }
      } catch {
        // 네트워크 에러여도 성공으로 처리
        return { success: true }
      }
    },
    onSuccess: () => {
      // 1. 쿠키 강제 삭제 (HttpOnly 쿠키는 백엔드에서 삭제되지만, 클라이언트에서도 시도)
      if (typeof document !== 'undefined') {
        // 쿠키 삭제 시도 (HttpOnly가 아닌 쿠키만 삭제 가능)
        document.cookie =
          'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.readingtown.site'
        document.cookie =
          'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.readingtown.site'
      }

      // 2. localStorage 완전 정리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lastProvider')
        // 추가로 다른 인증 관련 데이터가 있다면 여기서 삭제
      }

      // 3. TanStack Query 캐시 완전 초기화
      queryClient.setQueryData(authKeys.me(), {
        code: API_CODES.UNAUTHORIZED,
        message: '로그아웃되었습니다',
        result: null,
      })
      // 모든 쿼리 무효화 (전체 캐시 정리)
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      // 추가: 모든 쿼리 제거 (완전 초기화)
      queryClient.removeQueries()

      // 4. 로그인 페이지로 강제 리다이렉트
      // window.location.href로 전체 페이지 새로고침
      window.location.href = '/login'
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
    isOnboardingCompleted: onboardingData?.result?.onboardingCompleted ?? false,
    isLoading,
    logout: logoutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshTokenMutation.isPending,
  }
}
