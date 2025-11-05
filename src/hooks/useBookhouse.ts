/**
 * useBookhouse Hooks
 * Bookhouse(서재) 관련 TanStack Query hooks
 */

import { useQuery } from '@tanstack/react-query'
import {
  searchBooks,
  getBookOwners,
  getMyBookhouse,
} from '@/services/bookhouseService'

/**
 * Query Keys
 */
export const bookhouseKeys = {
  all: ['bookhouse'] as const,
  search: (query: string) => [...bookhouseKeys.all, 'search', query] as const,
  owners: (bookId: number) => [...bookhouseKeys.all, 'owners', bookId] as const,
  myBooks: (page?: number, size?: number) =>
    [...bookhouseKeys.all, 'my-books', page, size] as const,
}

/**
 * useBookSearch Hook
 * 책 검색
 */
export function useBookSearch(params: {
  query: string
  page?: number
  size?: number
  enabled?: boolean
}) {
  return useQuery({
    queryKey: bookhouseKeys.search(params.query),
    queryFn: () => searchBooks(params),
    enabled: params.enabled !== false && params.query.length > 0,
    staleTime: 60000, // 1분
    gcTime: 300000, // 5분
  })
}

/**
 * useBookOwners Hook
 * 특정 책을 소유한 유저 목록 조회
 */
export function useBookOwners(bookId: number | null) {
  return useQuery({
    queryKey: bookhouseKeys.owners(bookId ?? 0),
    queryFn: () => {
      if (!bookId) throw new Error('bookId is required')
      return getBookOwners(bookId)
    },
    enabled: bookId !== null,
    staleTime: 30000, // 30초
    gcTime: 300000, // 5분
  })
}

/**
 * useMyBookhouse Hook
 * 내 서재 책 목록 조회
 */
export function useMyBookhouse(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: bookhouseKeys.myBooks(params?.page, params?.size),
    queryFn: () => getMyBookhouse(params),
    staleTime: 30000, // 30초
    gcTime: 300000, // 5분
  })
}
