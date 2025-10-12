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
 * GET /api/v1/members/{partnerId}/star-rating
 */
export function useUserRating(memberId: string | number) {
  return useQuery({
    queryKey: ['user', 'rating', memberId],
    queryFn: async (): Promise<UserRating> => {
      return await api.get<UserRating>(
        `/api/v1/members/${memberId}/star-rating`
      )
    },
    enabled: !!memberId,
    staleTime: 1000 * 60 * 5, // 5분
  })
}

/**
 * 유저에게 별점 제출 (낙관적 업데이트 적용)
 * POST /api/v1/members/star-rating
 */
export function useSubmitRating(partnerId: string | number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (starRating: number) => {
      const requestBody: SubmitRatingRequest = {
        memberId: Number(partnerId),
        starRating,
      }
      return await api.post('/api/v1/members/star-rating', requestBody)
    },
    onMutate: async (starRating: number) => {
      // 진행 중인 쿼리 취소 (낙관적 업데이트와 충돌 방지)
      await queryClient.cancelQueries({
        queryKey: ['user', 'rating', partnerId],
      })

      // 이전 데이터 스냅샷 저장 (롤백용)
      const previousRating = queryClient.getQueryData<UserRating>([
        'user',
        'rating',
        partnerId,
      ])

      // 낙관적 업데이트: 별점 정보 즉시 업데이트
      if (previousRating) {
        const updatedRating: UserRating = {
          ...previousRating,
          userRatingSum: previousRating.userRatingSum + starRating,
          userRatingCount: previousRating.userRatingCount + 1,
          userRating:
            (previousRating.userRatingSum + starRating) /
            (previousRating.userRatingCount + 1),
        }
        queryClient.setQueryData<UserRating>(
          ['user', 'rating', partnerId],
          updatedRating
        )
      }

      return { previousRating }
    },
    onError: (err, _starRating, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousRating) {
        queryClient.setQueryData(
          ['user', 'rating', partnerId],
          context.previousRating
        )
      }
      console.error('Failed to submit rating:', err)
    },
    onSettled: () => {
      // 성공/실패 관계없이 최종적으로 서버 데이터 재조회 (데이터 일관성 보장)
      queryClient.invalidateQueries({
        queryKey: ['user', 'rating', partnerId],
      })
    },
  })
}
