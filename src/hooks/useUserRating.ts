'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { UserRating, SubmitRatingRequest } from '@/types/auth'

/**
 * 나의 리뷰 별점 조회
 * GET /api/v1/members/me/star-rating
 */
export function useMyRating() {
  return useQuery({
    queryKey: ['user', 'rating', 'me'],
    queryFn: async (): Promise<UserRating> => {
      return await api.get<UserRating>('/api/v1/members/me/star-rating')
    },
    staleTime: 1000 * 60 * 10, // 10분
  })
}

/**
 * 다른 유저의 리뷰 별점 조회
 * GET /api/v1/members/star-rating?memberId={memberId}
 */
export function useUserRating(memberId: string | number) {
  return useQuery({
    queryKey: ['user', 'rating', memberId],
    queryFn: async (): Promise<UserRating> => {
      return await api.get<UserRating>('/api/v1/members/star-rating', {
        memberId: memberId.toString(),
      })
    },
    enabled: !!memberId,
    staleTime: 1000 * 60 * 5, // 5분
  })
}

/**
 * 유저에게 별점 제출
 * POST /api/v1/members/{partnerId}/star-rating
 */
export function useSubmitRating(partnerId: string | number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (starRating: number) => {
      const requestBody: SubmitRatingRequest = {
        memberId: Number(partnerId),
        starRating,
      }
      return await api.post(
        `/api/v1/members/${partnerId}/star-rating`,
        requestBody
      )
    },
    onSuccess: () => {
      // 해당 유저의 별점 정보 무효화 (재조회)
      queryClient.invalidateQueries({
        queryKey: ['user', 'rating', partnerId],
      })
    },
    onError: err => {
      console.error('Failed to submit rating:', err)
    },
  })
}
