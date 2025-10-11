import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMyLibrary } from '@/hooks/useMyLibrary'
import { LibraryBook } from '@/types/home'

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

describe('useMyLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch library books successfully with default limit', async () => {
    const mockBooks: LibraryBook[] = [
      {
        id: '1',
        title: '테스트 도서 1',
        coverImage: 'https://example.com/book1.jpg',
        categories: ['드라마', '성장소설'],
        readingStatus: 'reading',
      },
      {
        id: '2',
        title: '테스트 도서 2',
        coverImage: 'https://example.com/book2.jpg',
        categories: ['SF'],
        readingStatus: 'completed',
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

    const { result } = renderHook(() => useMyLibrary(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockBooks)
    expect(result.current.data?.length).toBe(2)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/bookhouse/members/me?limit=6'),
      expect.objectContaining({
        credentials: 'include',
      })
    )
  })

  it('should fetch library books with custom limit', async () => {
    const mockBooks: LibraryBook[] = [
      {
        id: '1',
        title: '테스트 도서 1',
        coverImage: 'https://example.com/book1.jpg',
        categories: ['드라마'],
        readingStatus: 'reading',
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

    const { result } = renderHook(() => useMyLibrary(10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/bookhouse/members/me?limit=10'),
      expect.objectContaining({
        credentials: 'include',
      })
    )
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

    const { result } = renderHook(() => useMyLibrary(), {
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

    const { result } = renderHook(() => useMyLibrary(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })

  it('should return empty array when result is empty array', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            code: '1000',
            message: '성공',
            result: [],
          }),
      })
    ) as jest.Mock

    const { result } = renderHook(() => useMyLibrary(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })
})
