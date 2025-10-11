'use client'

import { useQuery } from '@tanstack/react-query'
import { LibraryBook } from '@/types/home'
import { ApiResponse } from '@/types/common'

const myLibraryKeys = {
  all: ['myLibrary'] as const,
  list: (limit?: number) => [...myLibraryKeys.all, 'list', limit] as const,
}

/**
 * 나의 서재 도서 목록을 가져오는 훅
 * @param limit - 가져올 도서 수 (기본값: 6)
 */
export function useMyLibrary(limit: number = 6) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

  return useQuery({
    queryKey: myLibraryKeys.list(limit),
    queryFn: async (): Promise<LibraryBook[]> => {
      const response = await fetch(
        `${backendUrl}/api/v1/bookhouse/members/me?limit=${limit}`,
        {
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch library books')
      }

      const data: ApiResponse<LibraryBook[]> = await response.json()

      // 성공 응답이 아니거나 result가 없으면 빈 배열 반환
      if (data.code !== '1000' || !data.result) {
        return []
      }

      return data.result
    },
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  })
}
