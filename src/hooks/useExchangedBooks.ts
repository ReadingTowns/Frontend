'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ExchangedBook, ExchangeApiResponse } from '@/types/home'

const exchangedBooksKeys = {
  all: ['exchangedBooks'] as const,
  list: () => [...exchangedBooksKeys.all, 'list'] as const,
}

/**
 * API 응답을 프론트엔드 타입으로 변환
 */
function transformExchangeResponse(
  apiResponse: ExchangeApiResponse[]
): ExchangedBook[] {
  const books: ExchangedBook[] = []

  apiResponse.forEach(item => {
    // myBook: 내가 빌려준 책
    if (item.myBook) {
      books.push({
        exchangeId: item.myBook.bookhouseId,
        bookTitle: item.myBook.bookName,
        bookCoverImage: item.myBook.bookImage,
        isMyBook: true,
      })
    }

    // yourBook: 내가 빌린 책
    if (item.yourBook) {
      books.push({
        exchangeId: item.yourBook.bookhouseId,
        bookTitle: item.yourBook.bookName,
        bookCoverImage: item.yourBook.bookImage,
        isMyBook: false,
      })
    }
  })

  return books
}

/**
 * 교환한 도서 목록을 가져오는 훅
 */
export function useExchangedBooks() {
  return useQuery({
    queryKey: exchangedBooksKeys.list(),
    queryFn: async (): Promise<ExchangedBook[]> => {
      const apiResponse = await api.get<ExchangeApiResponse[]>(
        '/api/v1/members/me/exchanges'
      )
      return transformExchangeResponse(apiResponse)
    },
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  })
}
