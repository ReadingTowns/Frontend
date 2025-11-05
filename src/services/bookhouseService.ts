/**
 * Bookhouse Service
 * Handles bookhouse (서재) related API calls
 */

import { api } from '@/lib/api'
import type { BookSearchResult, BookhouseOwner } from '@/types/exchange'

/**
 * Bookhouse API endpoints
 */
const BOOKHOUSE_API = {
  SEARCH_BOOKS: '/api/v1/bookhouse/books/search',
  GET_BOOK_OWNERS: (bookId: number) => `/api/v1/bookhouse/books/${bookId}`,
  GET_MY_BOOKHOUSE: '/api/v1/bookhouse/members/me',
} as const

/**
 * Search books in bookhouse
 * GET /api/v1/bookhouse/books/search?bookname={query}
 * Returns array of books directly (no pagination wrapper)
 */
export async function searchBooks(params: {
  query: string
  page?: number
  size?: number
}): Promise<BookSearchResult[]> {
  const searchParams = new URLSearchParams()
  searchParams.append('bookname', params.query)
  if (params.page !== undefined)
    searchParams.append('page', String(params.page))
  if (params.size !== undefined)
    searchParams.append('size', String(params.size))

  return api.get<BookSearchResult[]>(
    `${BOOKHOUSE_API.SEARCH_BOOKS}?${searchParams.toString()}`
  )
}

/**
 * Get users who own a specific book
 * GET /api/v1/bookhouse/books/{bookId}
 */
export async function getBookOwners(bookId: number): Promise<BookhouseOwner[]> {
  return api.get<BookhouseOwner[]>(BOOKHOUSE_API.GET_BOOK_OWNERS(bookId))
}

/**
 * Get my bookhouse (books I own)
 * GET /api/v1/bookhouse/members/me
 */
export async function getMyBookhouse(params?: {
  page?: number
  size?: number
}): Promise<{ content: BookSearchResult[]; totalPages: number }> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined)
    searchParams.append('page', String(params.page))
  if (params?.size !== undefined)
    searchParams.append('size', String(params.size))

  const query = searchParams.toString()
  const url = query
    ? `${BOOKHOUSE_API.GET_MY_BOOKHOUSE}?${query}`
    : BOOKHOUSE_API.GET_MY_BOOKHOUSE

  return api.get<{ content: BookSearchResult[]; totalPages: number }>(url)
}
