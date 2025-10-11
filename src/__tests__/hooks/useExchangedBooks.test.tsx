import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ExchangedBook } from '@/types/home'

// Mock the API client before importing hooks
const mockApiGet = jest.fn()
const mockApiPost = jest.fn()
const mockApiPut = jest.fn()
const mockApiPatch = jest.fn()
const mockApiDelete = jest.fn()

jest.mock('../../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => mockApiGet(...args),
    post: (...args: unknown[]) => mockApiPost(...args),
    put: (...args: unknown[]) => mockApiPut(...args),
    patch: (...args: unknown[]) => mockApiPatch(...args),
    delete: (...args: unknown[]) => mockApiDelete(...args),
  },
}))

import { useExchangedBooks } from '@/hooks/useExchangedBooks'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = 'TestWrapper'
  return Wrapper
}

describe('useExchangedBooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch exchanged books successfully', async () => {
    const mockBooks: ExchangedBook[] = [
      {
        exchangeId: 1,
        bookTitle: '테스트 도서 1',
        bookCoverImage: 'https://example.com/book1.jpg',
        partnerMemberId: 100,
        partnerNickname: '홍길동',
        exchangeDate: '2025-10-01',
        status: 'COMPLETED',
      },
      {
        exchangeId: 2,
        bookTitle: '테스트 도서 2',
        bookCoverImage: 'https://example.com/book2.jpg',
        partnerMemberId: 101,
        partnerNickname: '김철수',
        exchangeDate: '2025-10-05',
        status: 'COMPLETED',
      },
    ]

    mockApiGet.mockResolvedValue(mockBooks)

    const { result } = renderHook(() => useExchangedBooks(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockBooks)
    expect(result.current.data?.length).toBe(2)
    expect(mockApiGet).toHaveBeenCalledWith('/api/v1/members/me/exchanges')
  })

  it('should return empty array when result is empty array', async () => {
    mockApiGet.mockResolvedValue([])

    const { result } = renderHook(() => useExchangedBooks(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })
})
