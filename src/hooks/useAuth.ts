'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface User {
  id: string
  email: string
  name: string
  profileImage?: string
  provider: 'google' | 'kakao'
  isAuthenticated: boolean
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
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false
      }
      return failureCount < 2
    },
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
      queryClient.setQueryData(authKeys.me(), {
        success: false,
        user: undefined,
      })
      queryClient.invalidateQueries({ queryKey: authKeys.all })
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
    isLoading,
    error,
    logout: logoutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshTokenMutation.isPending,
  }
}