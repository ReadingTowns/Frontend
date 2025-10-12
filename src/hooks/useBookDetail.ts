'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { BookDetail, BookReviewItem, MyBookReview } from '@/types/book'
import { api } from '@/lib/api'

/**
 * 책 상세 정보 조회
 * GET /api/v1/books/{bookId}
 */
export function useBookDetail(bookId: string) {
  return useQuery({
    queryKey: ['book', 'detail', bookId],
    queryFn: async (): Promise<BookDetail> => {
      return await api.get<BookDetail>(`/api/v1/books/${bookId}`)
    },
    enabled: !!bookId,
    staleTime: 1000 * 60 * 10, // 10분
  })
}

/**
 * 내 책 리뷰 조회
 * GET /api/v1/books/{bookId}/reviews/me
 */
export function useMyBookReview(bookId: string) {
  return useQuery({
    queryKey: ['book', 'review', 'me', bookId],
    queryFn: async (): Promise<MyBookReview | null> => {
      try {
        return await api.get<MyBookReview>(`/api/v1/books/${bookId}/reviews/me`)
      } catch (error) {
        // 404 = 리뷰가 없는 경우
        if (error instanceof Error && error.message.includes('404')) {
          return null
        }
        throw error
      }
    },
    enabled: !!bookId,
  })
}

/**
 * 책 리뷰 생성
 * POST /api/v1/books/{bookId}/review
 */
export function useCreateBookReview(bookId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: string) => {
      return await api.post(`/api/v1/books/${bookId}/review`, { content })
    },
    onMutate: async (content: string) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: ['book', 'review', 'me', bookId],
      })

      // 이전 데이터 저장
      const previousReview = queryClient.getQueryData<MyBookReview | null>([
        'book',
        'review',
        'me',
        bookId,
      ])

      // 낙관적 업데이트
      queryClient.setQueryData<MyBookReview>(['book', 'review', 'me', bookId], {
        reviewId: 0, // 임시 ID
        content,
      })

      return { previousReview }
    },
    onError: (err, _content, context) => {
      // 롤백
      if (context?.previousReview !== undefined) {
        queryClient.setQueryData(
          ['book', 'review', 'me', bookId],
          context.previousReview
        )
      }
      console.error('Failed to create review:', err)
    },
    onSettled: () => {
      // 최종 동기화
      queryClient.invalidateQueries({
        queryKey: ['book', 'review', 'me', bookId],
      })
    },
  })
}

/**
 * 책 리뷰 수정
 * PATCH /api/v1/books/review/{reviewId}
 */
export function useUpdateBookReview(bookId: string, reviewId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: string) => {
      return await api.patch(`/api/v1/books/review/${reviewId}`, { content })
    },
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({
        queryKey: ['book', 'review', 'me', bookId],
      })

      const previousReview = queryClient.getQueryData<MyBookReview | null>([
        'book',
        'review',
        'me',
        bookId,
      ])

      // 낙관적 업데이트
      if (previousReview) {
        queryClient.setQueryData<MyBookReview>(
          ['book', 'review', 'me', bookId],
          {
            ...previousReview,
            content,
          }
        )
      }

      return { previousReview }
    },
    onError: (err, _content, context) => {
      if (context?.previousReview) {
        queryClient.setQueryData(
          ['book', 'review', 'me', bookId],
          context.previousReview
        )
      }
      console.error('Failed to update review:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['book', 'review', 'me', bookId],
      })
    },
  })
}

/**
 * 책 리뷰 삭제
 * DELETE /api/v1/books/review/{reviewId}
 */
export function useDeleteBookReview(bookId: string, reviewId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      return await api.delete(`/api/v1/books/review/${reviewId}`)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['book', 'review', 'me', bookId],
      })

      const previousReview = queryClient.getQueryData<MyBookReview | null>([
        'book',
        'review',
        'me',
        bookId,
      ])

      // 낙관적 업데이트 (null로 설정)
      queryClient.setQueryData(['book', 'review', 'me', bookId], null)

      return { previousReview }
    },
    onError: (err, _variables, context) => {
      if (context?.previousReview !== undefined) {
        queryClient.setQueryData(
          ['book', 'review', 'me', bookId],
          context.previousReview
        )
      }
      console.error('Failed to delete review:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['book', 'review', 'me', bookId],
      })
    },
  })
}

/**
 * 책 상세 페이지 통합 훅
 */
export function useBookDetailPage(bookId: string) {
  const bookDetail = useBookDetail(bookId)
  const myReview = useMyBookReview(bookId)

  return {
    book: {
      data: bookDetail.data,
      isLoading: bookDetail.isLoading,
      error: bookDetail.error,
    },
    myReview: {
      data: myReview.data,
      isLoading: myReview.isLoading,
      error: myReview.error,
      hasReview: !!myReview.data,
    },
    isLoading: bookDetail.isLoading || myReview.isLoading,
  }
}
