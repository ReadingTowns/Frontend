import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useBookDetail,
  useMyBookReview,
  useCreateBookReview,
  useUpdateBookReview,
  useDeleteBookReview,
} from '@/hooks/useBookDetail'
import { api } from '@/lib/api'
import React from 'react'

// Mock api module
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    )
  }
}

describe('useBookDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch book details successfully', async () => {
    const mockBook = {
      bookId: 1,
      isbn: '9781234567890',
      title: '테스트 책',
      author: '테스트 저자',
      publisher: '테스트 출판사',
      image: 'https://example.com/cover.jpg',
    }

    ;(api.get as jest.Mock).mockResolvedValueOnce(mockBook)

    const { result } = renderHook(() => useBookDetail('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockBook)
    expect(api.get).toHaveBeenCalledWith('/api/v1/books/1')
  })

  it('should handle fetch error', async () => {
    ;(api.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'))

    const { result } = renderHook(() => useBookDetail('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeTruthy()
  })
})

describe('useMyBookReview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch my review successfully', async () => {
    const mockReview = {
      reviewId: 1,
      content: '좋은 책입니다.',
    }

    ;(api.get as jest.Mock).mockResolvedValueOnce(mockReview)

    const { result } = renderHook(() => useMyBookReview('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockReview)
  })

  it('should return null when review does not exist (404)', async () => {
    ;(api.get as jest.Mock).mockRejectedValueOnce(new Error('404'))

    const { result } = renderHook(() => useMyBookReview('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeNull()
  })
})

describe('useCreateBookReview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create review successfully', async () => {
    ;(api.post as jest.Mock).mockResolvedValueOnce({})

    const { result } = renderHook(() => useCreateBookReview('1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate('멋진 책입니다!')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.post).toHaveBeenCalledWith('/api/v1/books/1/review', {
      content: '멋진 책입니다!',
    })
  })
})

describe('useUpdateBookReview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update review successfully', async () => {
    ;(api.put as jest.Mock).mockResolvedValueOnce({})

    const { result } = renderHook(() => useUpdateBookReview('1', 123), {
      wrapper: createWrapper(),
    })

    result.current.mutate('수정된 감상입니다.')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.put).toHaveBeenCalledWith('/api/v1/books/review/123', {
      content: '수정된 감상입니다.',
    })
  })
})

describe('useDeleteBookReview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete review successfully', async () => {
    ;(api.delete as jest.Mock).mockResolvedValueOnce({})

    const { result } = renderHook(() => useDeleteBookReview('1', 123), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.delete).toHaveBeenCalledWith('/api/v1/books/review/123')
  })
})
