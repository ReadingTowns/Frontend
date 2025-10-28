'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { BookSearchResult } from '@/types/book'

/**
 * 책 이름으로 검색하는 hook
 * @param query 검색어
 * @param enabled 검색 활성화 여부 (기본값: true)
 * @returns 검색 결과
 */
export function useBookSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: async (): Promise<BookSearchResult[]> => {
      // api.get()이 이미 response.result를 반환하므로 직접 사용
      const result = await api.get<BookSearchResult[]>('/api/v1/books/search', {
        bookname: query,
      })
      return result
    },
    enabled: enabled && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1,
  })
}
