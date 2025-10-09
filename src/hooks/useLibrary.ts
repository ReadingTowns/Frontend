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

// 서재에 책 등록
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
    onSuccess: () => {
      // 내 서재 책 리스트 무효화
      queryClient.invalidateQueries({ queryKey: ['library', 'my-books'] })
    },
  })
}

// 서재에서 책 삭제
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
    onSuccess: () => {
      // 내 서재 책 리스트 무효화
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

// 책 감상평 등록
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
    onSuccess: () => {
      // 해당 책의 감상평 무효화
      queryClient.invalidateQueries({ queryKey: ['book', 'review', bookId] })
    },
  })
}

// 책 감상평 수정
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
    onSuccess: () => {
      // 해당 책의 감상평 무효화
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
