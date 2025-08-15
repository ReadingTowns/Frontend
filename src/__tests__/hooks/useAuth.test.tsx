import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { ReactNode } from 'react'

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

const createWrapper = () => {
  const queryClient = createQueryClient()
  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  TestWrapper.displayName = 'TestWrapper'
  return TestWrapper
}

// MSW를 사용한 테스트 (fetch mock 대신)
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return default state when not authenticated', async () => {
    // MSW 핸들러 추가 - 인증되지 않은 상태
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      })
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeUndefined()
  })

  it('should return user data when authenticated', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      provider: 'google' as const,
      isAuthenticated: true,
    }

    // MSW 핸들러 추가 - 인증된 상태
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json({
          success: true,
          user: mockUser,
        })
      })
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
  })

  it('should handle fetch errors gracefully', async () => {
    // MSW 핸들러 추가 - 서버 에러 (500)
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 }
        )
      })
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 3000 }
    )

    // 에러가 발생하면 isAuthenticated는 false여야 함
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should handle 401 unauthorized correctly', async () => {
    // MSW 핸들러 추가 - 401 응답
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      })
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeUndefined()
  })
})
