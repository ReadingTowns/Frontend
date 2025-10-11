import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useExchangedBooks } from '@/hooks/useExchangedBooks'
import { ExchangedBook } from '@/types/home'

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

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            code: '1000',
            message: '성공',
            result: mockBooks,
          }),
      })
    ) as jest.Mock

    const { result } = renderHook(() => useExchangedBooks(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockBooks)
    expect(result.current.data?.length).toBe(2)
  })

  it('should return empty array when API returns non-success code', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            code: '4001',
            message: '인증 실패',
            result: null,
          }),
      })
    ) as jest.Mock

    const { result } = renderHook(() => useExchangedBooks(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })

  it('should return empty array when result is null', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            code: '1000',
            message: '성공',
            result: null,
          }),
      })
    ) as jest.Mock

    const { result } = renderHook(() => useExchangedBooks(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })
})
