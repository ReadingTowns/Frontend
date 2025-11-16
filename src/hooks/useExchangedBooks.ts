'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ExchangePair, ExchangeApiResponse } from '@/types/home'

const exchangedBooksKeys = {
  all: ['exchangedBooks'] as const,
  list: () => [...exchangedBooksKeys.all, 'list'] as const,
}

/**
 * API 응답을 ExchangePair로 변환
 * myBook과 partnerBook이 모두 있는 완전한 교환만 반환
 */
function transformExchangeResponse(
  apiResponse: ExchangeApiResponse[]
): ExchangePair[] {
  return apiResponse
    .filter(item => item.myBook && item.partnerBook) // 완전한 교환만 필터링
    .map(item => ({
      chatroomId: item.chatroomId,
      myBook: item.myBook!,
      partnerBook: item.partnerBook!,
    }))
}

/**
 * 교환한 도서 목록을 가져오는 훅
 * ExchangePair 배열을 반환하여 교환 단위로 그룹화
 */
export function useExchangedBooks() {
  return useQuery({
    queryKey: exchangedBooksKeys.list(),
    queryFn: async (): Promise<ExchangePair[]> => {
      const apiResponse = await api.get<ExchangeApiResponse[]>(
        '/api/v1/members/me/exchanges'
      )
      return transformExchangeResponse(apiResponse)
    },
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  })
}
