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
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

global.fetch = jest.fn()

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  it('should return default state when not authenticated', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: 'Unauthorized',
      }),
    })

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

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        user: mockUser,
      }),
    })

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
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // 에러가 발생하면 isAuthenticated는 false여야 함
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should call correct endpoint for auth check', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: false }),
    })

    renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/me', {
        credentials: 'include',
      })
    })
  })
})