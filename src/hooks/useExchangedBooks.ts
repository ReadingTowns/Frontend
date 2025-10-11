'use client'

import { useQuery } from '@tanstack/react-query'
import { ExchangedBook } from '@/types/home'
import { ApiResponse } from '@/types/common'

const exchangedBooksKeys = {
  all: ['exchangedBooks'] as const,
  list: () => [...exchangedBooksKeys.all, 'list'] as const,
}

/**
 * 교환한 도서 목록을 가져오는 훅
 */
export function useExchangedBooks() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

  return useQuery({
    queryKey: exchangedBooksKeys.list(),
    queryFn: async (): Promise<ExchangedBook[]> => {
      const response = await fetch(
        `${backendUrl}/api/v1/members/me/exchanges`,
        {
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch exchanged books')
      }

      const data: ApiResponse<ExchangedBook[]> = await response.json()

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
