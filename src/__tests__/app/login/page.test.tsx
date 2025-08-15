import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import LoginPage from '@/app/(public)/login/page'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

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
    // MSW 핸들러 추가 - 지연된 응답
    server.use(
      http.get('/api/auth/me', async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return HttpResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      })
    )

    render(<LoginPage />, { wrapper: createWrapper() })

    expect(screen.getByText('로딩 중...')).toBeInTheDocument()
  })

  it('renders login screen when user is not authenticated', async () => {
    // MSW 핸들러 추가 - 인증되지 않은 상태
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      })
    )

    render(<LoginPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('리딩타운')).toBeInTheDocument()
      expect(
        screen.getByText('책으로 이웃과 연결되는 공간')
      ).toBeInTheDocument()
      expect(
        screen.getByText('로그인하여 리딩타운의 모든 서비스를 이용하세요')
      ).toBeInTheDocument()
    })

    expect(screen.getByText('Google로 로그인')).toBeInTheDocument()
    expect(screen.getByText('카카오로 로그인')).toBeInTheDocument()
  })

  it('redirects to dashboard when user is authenticated', async () => {
    // MSW 핸들러 추가 - 인증된 상태
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json({
          success: true,
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            provider: 'google',
            isAuthenticated: true,
          },
        })
      })
    )

    render(<LoginPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home')
    })
  })

  it('shows redirect message when authenticated user is being redirected', async () => {
    // MSW 핸들러 추가 - 인증된 상태
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json({
          success: true,
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            provider: 'google',
            isAuthenticated: true,
          },
        })
      })
    )

    render(<LoginPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('홈으로 이동 중...')).toBeInTheDocument()
    })
  })

  it('login buttons have proper layout structure', async () => {
    // MSW 핸들러 추가 - 인증되지 않은 상태
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      })
    )

    render(<LoginPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('리딩타운')).toBeInTheDocument()
    })

    const titleContainer = screen.getByText('리딩타운').closest('div')
    expect(titleContainer).toHaveClass('text-center', 'space-y-4')

    const buttonContainer = screen
      .getByText('Google로 로그인')
      .closest('button')?.parentElement
    expect(buttonContainer).toHaveClass('w-full', 'max-w-sm', 'space-y-4')
  })
})
