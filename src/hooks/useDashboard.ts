import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  ExchangeData,
  RecommendedUser,
  RecommendedBook,
} from '@/types/dashboard'
import { api } from '@/lib/api'

// 교환 중인 책 조회
export function useCurrentExchange() {
  return useQuery<ExchangeData | null>({
    queryKey: ['dashboard', 'current-exchange'],
    queryFn: async () => {
      return await api.get<ExchangeData | null>('/api/v1/members/me/exchanges')
    },
    staleTime: 1000 * 60 * 5, // 5분
  })
}

// 추천 사용자 조회
export function useRecommendedUsers() {
  return useQuery<RecommendedUser[]>({
    queryKey: ['dashboard', 'recommended-users'],
    queryFn: async () => {
      return await api.get<RecommendedUser[]>('/api/v1/users/recommendations')
    },
    staleTime: 1000 * 60 * 10, // 10분
  })
}

// 추천 도서 조회
export function useRecommendedBooks() {
  return useQuery<RecommendedBook[]>({
    queryKey: ['dashboard', 'recommended-books'],
    queryFn: async () => {
      return await api.get<RecommendedBook[]>('/api/v1/books/recommendations')
    },
    staleTime: 1000 * 60 * 30, // 30분
  })
}

// 팔로우 토글
export function useFollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      isFollowing,
    }: {
      userId: number
      isFollowing: boolean
    }) => {
      if (isFollowing) {
        return await api.delete(`/api/v1/users/${userId}/follow`)
      } else {
        return await api.post(`/api/v1/users/${userId}/follow`)
      }
    },
    onSuccess: () => {
      // 추천 사용자 목록 다시 조회
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'recommended-users'],
      })
    },
  })
}

// 대시보드 전체 데이터 조회 (조합)
export function useDashboard() {
  const currentExchange = useCurrentExchange()
  const recommendedUsers = useRecommendedUsers()
  const recommendedBooks = useRecommendedBooks()

  return {
    currentExchange: {
      data: currentExchange.data,
      isLoading: currentExchange.isLoading,
      error: currentExchange.error,
    },
    recommendedUsers: {
      data: recommendedUsers.data || [],
      isLoading: recommendedUsers.isLoading,
      error: recommendedUsers.error,
    },
    recommendedBooks: {
      data: recommendedBooks.data || [],
      isLoading: recommendedBooks.isLoading,
      error: recommendedBooks.error,
    },
    isLoading:
      currentExchange.isLoading ||
      recommendedUsers.isLoading ||
      recommendedBooks.isLoading,
  }
}
