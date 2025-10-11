'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ExchangedBook } from '@/types/home'

const exchangedBooksKeys = {
  all: ['exchangedBooks'] as const,
  list: () => [...exchangedBooksKeys.all, 'list'] as const,
}

/**
 * 교환한 도서 목록을 가져오는 훅
 */
export function useExchangedBooks() {
  return useQuery({
    queryKey: exchangedBooksKeys.list(),
    queryFn: async (): Promise<ExchangedBook[]> => {
      return await api.get<ExchangedBook[]>('/api/v1/members/me/exchanges')
    },
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  })
}
