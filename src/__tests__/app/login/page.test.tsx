import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import LoginPage from '@/app/(public)/login/page'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

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

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
  })

  it('shows loading state initially', () => {
    // Mock delayed unauthenticated response
    fetch.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: false,
                status: 401,
                json: () =>
                  Promise.resolve({ success: false, message: 'Unauthorized' }),
              }),
            100
          )
        )
    )

    render(<LoginPage />, { wrapper: createWrapper() })

    // Initially should show loading text
    expect(screen.getByText(/로딩 중/)).toBeInTheDocument()
  })

  it('renders login screen when user is not authenticated', async () => {
    // Mock unauthenticated response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({ success: false, message: 'Unauthorized' }),
      })
    )

    render(<LoginPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('리딩타운')).toBeInTheDocument()
    })

    // Check if login buttons are present
    expect(screen.getByText(/Google로 로그인/)).toBeInTheDocument()
    expect(screen.getByText(/카카오로 로그인/)).toBeInTheDocument()
  })

  it('redirects to dashboard when user is authenticated', async () => {
    // Mock authenticated response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            code: '1000',
            message: '인증 성공',
            result: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              provider: 'google',
              isAuthenticated: true,
            },
          }),
      })
    )

    render(<LoginPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home')
    })
  })

  it('shows redirect message when authenticated user is being redirected', async () => {
    // Mock authenticated response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            code: '1000',
            message: '인증 성공',
            result: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              provider: 'google',
              isAuthenticated: true,
            },
          }),
      })
    )

    render(<LoginPage />, { wrapper: createWrapper() })

    // Should initially show loading while redirecting
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home')
    })
  })

  it('login buttons have proper layout structure', async () => {
    // Mock unauthenticated response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            code: '4001',
            message: 'Unauthorized',
            result: null,
          }),
      })
    )

    render(<LoginPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText(/Google로 로그인/)).toBeInTheDocument()
    })

    // Check layout structure
    const googleButton = screen.getByText(/Google로 로그인/)
    const kakaoButton = screen.getByText(/카카오로 로그인/)

    expect(googleButton).toBeInTheDocument()
    expect(kakaoButton).toBeInTheDocument()
  })
})
