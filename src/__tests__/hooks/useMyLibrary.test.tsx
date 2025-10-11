import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LibraryBook } from '@/types/home'

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

import { useMyLibrary } from '@/hooks/useMyLibrary'

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

    mockApiGet.mockResolvedValue(mockBooks)

    const { result } = renderHook(() => useMyLibrary(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockBooks)
    expect(result.current.data?.length).toBe(2)
    expect(mockApiGet).toHaveBeenCalledWith('/api/v1/bookhouse/members/me', {
      limit: 6,
    })
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

    mockApiGet.mockResolvedValue(mockBooks)

    const { result } = renderHook(() => useMyLibrary(10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockApiGet).toHaveBeenCalledWith('/api/v1/bookhouse/members/me', {
      limit: 10,
    })
  })

  it('should return empty array when result is empty array', async () => {
    mockApiGet.mockResolvedValue([])

    const { result } = renderHook(() => useMyLibrary(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })
})
