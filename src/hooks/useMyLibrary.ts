'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { LibraryBook } from '@/types/home'

const myLibraryKeys = {
  all: ['myLibrary'] as const,
  list: (limit?: number) => [...myLibraryKeys.all, 'list', limit] as const,
}

/**
 * 나의 서재 도서 목록을 가져오는 훅
 * @param limit - 가져올 도서 수 (기본값: 6)
 */
export function useMyLibrary(limit: number = 6) {
  return useQuery({
    queryKey: myLibraryKeys.list(limit),
    queryFn: async (): Promise<LibraryBook[]> => {
      const result = await api.get<LibraryBook[]>(
        '/api/v1/bookhouse/members/me',
        {
          limit,
        }
      )
      // API 응답이 배열이 아니거나 undefined인 경우 빈 배열 반환
      return Array.isArray(result) ? result : []
    },
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  })
}
