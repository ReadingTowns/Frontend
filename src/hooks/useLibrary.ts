'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  LibraryBooksResponse,
  AddLibraryBookRequest,
  UserProfile,
  BookReview,
  AddReviewRequest,
  UpdateReviewRequest,
  LibraryBooksApiResponse,
  AddLibraryBookApiResponse,
  DeleteLibraryBookApiResponse,
  UserProfileApiResponse,
  GetReviewApiResponse,
  AddReviewApiResponse,
  UpdateReviewApiResponse,
} from '@/types/library'
import { PaginationInfo } from '@/types/common'

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

// 내 서재 책 리스트 조회
export function useMyLibraryBooks(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ['library', 'my-books', params],
    queryFn: async (): Promise<LibraryBooksResponse & PaginationInfo> => {
      const searchParams = new URLSearchParams()
      if (params?.page !== undefined)
        searchParams.set('page', params.page.toString())
      if (params?.size) searchParams.set('size', params.size.toString())

      const response = await fetch(
        `${BASE_URL}/api/v1/bookhouse/members/me?${searchParams.toString()}`,
        {
          credentials: 'include',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch my library books')
      }

      const data: LibraryBooksApiResponse = await response.json()
      return data.result
    },
  })
}

// 특정 사용자의 서재 책 리스트 조회
export function useUserLibraryBooks(
  userId: string,
  params?: {
    page?: number
    size?: number
  }
) {
  return useQuery({
    queryKey: ['library', 'user-books', userId, params],
    queryFn: async (): Promise<LibraryBooksResponse & PaginationInfo> => {
      const searchParams = new URLSearchParams()
      if (params?.page !== undefined)
        searchParams.set('page', params.page.toString())
      if (params?.size) searchParams.set('size', params.size.toString())

      const response = await fetch(
        `${BASE_URL}/api/v1/bookhouse/members/${userId}?${searchParams.toString()}`,
        {
          credentials: 'include',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch user library books')
      }

      const data: LibraryBooksApiResponse = await response.json()
      return data.result
    },
    enabled: !!userId,
  })
}

// 서재에 책 등록 (낙관적 업데이트 적용)
export function useAddLibraryBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookData: AddLibraryBookRequest) => {
      const response = await fetch(`${BASE_URL}/api/v1/bookhouse/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bookData),
      })

      if (!response.ok) {
        throw new Error('Failed to add library book')
      }

      const data: AddLibraryBookApiResponse = await response.json()
      return data
    },
    // 낙관적 업데이트: 책 등록 요청 전에 UI에 즉시 추가
    onMutate: async (bookData: AddLibraryBookRequest) => {
      await queryClient.cancelQueries({ queryKey: ['library', 'my-books'] })

      const previousData = queryClient.getQueriesData({
        queryKey: ['library', 'my-books'],
      })

      // 임시 책 데이터 추가 (bookId는 임시로 Date.now() 사용)
      queryClient.setQueriesData(
        { queryKey: ['library', 'my-books'] },
        (
          old: (LibraryBooksResponse & PaginationInfo) | undefined
        ): (LibraryBooksResponse & PaginationInfo) | undefined => {
          if (!old) return old
          return {
            ...old,
            content: [
              {
                bookId: Date.now(), // 임시 ID
                bookImage: bookData.image,
                bookName: bookData.title,
                author: bookData.author,
              },
              ...old.content,
            ],
            curElements: old.curElements + 1,
            totalElements: old.totalElements + 1,
          }
        }
      )

      return { previousData }
    },
    onError: (err, _bookData, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      console.error('Failed to add book:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['library', 'my-books'] })
    },
  })
}

// 서재에서 책 삭제 (낙관적 업데이트 적용)
export function useDeleteLibraryBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookId: string) => {
      const response = await fetch(
        `${BASE_URL}/api/v1/bookhouse/books/${bookId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete library book')
      }

      const data: DeleteLibraryBookApiResponse = await response.json()
      return data
    },
    // 낙관적 업데이트: 삭제 요청 전에 UI에서 즉시 제거
    onMutate: async (bookId: string) => {
      // 진행 중인 쿼리 취소 (충돌 방지)
      await queryClient.cancelQueries({ queryKey: ['library', 'my-books'] })

      // 이전 데이터 스냅샷 저장 (롤백용)
      const previousData = queryClient.getQueriesData({
        queryKey: ['library', 'my-books'],
      })

      // 캐시에서 해당 책 제거 (낙관적 업데이트)
      queryClient.setQueriesData(
        { queryKey: ['library', 'my-books'] },
        (
          old: (LibraryBooksResponse & PaginationInfo) | undefined
        ): (LibraryBooksResponse & PaginationInfo) | undefined => {
          if (!old) return old
          return {
            ...old,
            content: old.content.filter(book => book.bookId !== Number(bookId)),
            curElements: old.curElements - 1,
            totalElements: old.totalElements - 1,
          }
        }
      )

      return { previousData }
    },
    // 에러 발생 시 이전 데이터로 롤백
    onError: (err, _bookId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      console.error('Failed to delete book:', err)
    },
    // 성공/실패 관계없이 최종적으로 서버 데이터 재조회
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['library', 'my-books'] })
    },
  })
}

// 사용자 프로필 조회
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', 'profile', userId],
    queryFn: async (): Promise<UserProfile> => {
      const response = await fetch(
        `${BASE_URL}/api/v1/members/${userId}/profile`,
        {
          credentials: 'include',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }

      const data: UserProfileApiResponse = await response.json()
      return data.result
    },
    enabled: !!userId,
  })
}

// 책 감상평 조회
export function useBookReview(bookId: string) {
  return useQuery({
    queryKey: ['book', 'review', bookId],
    queryFn: async (): Promise<BookReview | null> => {
      const response = await fetch(
        `${BASE_URL}/api/v1/books/${bookId}/reviews/me`,
        {
          credentials: 'include',
        }
      )

      if (response.status === 404) {
        return null // 감상평이 없는 경우
      }

      if (!response.ok) {
        throw new Error('Failed to fetch book review')
      }

      const data: GetReviewApiResponse = await response.json()
      return data.result
    },
    enabled: !!bookId,
  })
}

// 책 감상평 등록 (낙관적 업데이트 적용)
export function useAddBookReview(bookId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reviewData: AddReviewRequest) => {
      const response = await fetch(
        `${BASE_URL}/api/v1/books/${bookId}/review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(reviewData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add book review')
      }

      const data: AddReviewApiResponse = await response.json()
      return data
    },
    // 낙관적 업데이트: 감상평 작성 전에 UI에 즉시 표시
    onMutate: async (reviewData: AddReviewRequest) => {
      await queryClient.cancelQueries({ queryKey: ['book', 'review', bookId] })

      const previousReview = queryClient.getQueryData<BookReview | null>([
        'book',
        'review',
        bookId,
      ])

      // 임시 감상평 데이터 (reviewId는 임시로 0 사용)
      queryClient.setQueryData<BookReview>(['book', 'review', bookId], {
        reviewId: 0, // 임시 ID
        content: reviewData.content,
      })

      return { previousReview }
    },
    onError: (err, _reviewData, context) => {
      if (context?.previousReview !== undefined) {
        queryClient.setQueryData(
          ['book', 'review', bookId],
          context.previousReview
        )
      }
      console.error('Failed to add review:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['book', 'review', bookId] })
    },
  })
}

// 책 감상평 수정 (낙관적 업데이트 적용)
export function useUpdateBookReview(bookId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reviewData: UpdateReviewRequest) => {
      const response = await fetch(
        `${BASE_URL}/api/v1/books/${bookId}/review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(reviewData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update book review')
      }

      const data: UpdateReviewApiResponse = await response.json()
      return data
    },
    // 낙관적 업데이트: 감상평 수정 전에 UI에 즉시 반영
    onMutate: async (reviewData: UpdateReviewRequest) => {
      await queryClient.cancelQueries({ queryKey: ['book', 'review', bookId] })

      const previousReview = queryClient.getQueryData<BookReview | null>([
        'book',
        'review',
        bookId,
      ])

      // 기존 감상평 데이터를 업데이트
      if (previousReview) {
        queryClient.setQueryData<BookReview>(['book', 'review', bookId], {
          ...previousReview,
          content: reviewData.content,
        })
      }

      return { previousReview }
    },
    onError: (err, _reviewData, context) => {
      if (context?.previousReview) {
        queryClient.setQueryData(
          ['book', 'review', bookId],
          context.previousReview
        )
      }
      console.error('Failed to update review:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['book', 'review', bookId] })
    },
  })
}

// 서재 통합 훅 (내 서재용)
export function useLibrary() {
  const books = useMyLibraryBooks()
  const addBook = useAddLibraryBook()
  const deleteBook = useDeleteLibraryBook()

  return {
    books: {
      data: books.data?.content || [],
      pagination: books.data
        ? {
            curPage: books.data.curPage,
            curElements: books.data.curElements,
            totalPages: books.data.totalPages,
            totalElements: books.data.totalElements,
            last: books.data.last,
          }
        : null,
      isLoading: books.isLoading,
      error: books.error,
      refetch: books.refetch,
    },
    addBook: {
      mutate: addBook.mutate,
      isLoading: addBook.isPending,
      error: addBook.error,
      isSuccess: addBook.isSuccess,
    },
    deleteBook: {
      mutate: deleteBook.mutate,
      isLoading: deleteBook.isPending,
      error: deleteBook.error,
      isSuccess: deleteBook.isSuccess,
    },
  }
}

// 책 감상평 통합 훅
export function useBookReviewActions(bookId: string) {
  const review = useBookReview(bookId)
  const addReview = useAddBookReview(bookId)
  const updateReview = useUpdateBookReview(bookId)

  return {
    review: {
      data: review.data,
      isLoading: review.isLoading,
      error: review.error,
      refetch: review.refetch,
    },
    addReview: {
      mutate: addReview.mutate,
      isLoading: addReview.isPending,
      error: addReview.error,
      isSuccess: addReview.isSuccess,
    },
    updateReview: {
      mutate: updateReview.mutate,
      isLoading: updateReview.isPending,
      error: updateReview.error,
      isSuccess: updateReview.isSuccess,
    },
    hasReview: !!review.data,
    mode: (review.data ? 'edit' : 'create') as 'create' | 'edit',
  }
}
