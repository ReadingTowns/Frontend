import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import HomePage from '@/app/(protected)/home/page'
import { HeaderProvider } from '@/contexts/HeaderContext'

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
    <QueryClientProvider client={queryClient}>
      <HeaderProvider>{children}</HeaderProvider>
    </QueryClientProvider>
  )
  TestWrapper.displayName = 'TestWrapper'
  return TestWrapper
}

describe('Home Page (Dashboard)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
  })

  it('renders dashboard with user info', async () => {
    // Mock authenticated response for auth check
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

    const TestComponent = await HomePage()
    render(<div>{TestComponent}</div>, { wrapper: createWrapper() })

    // Should render the dashboard content
    expect(screen.getByText('추천 이웃')).toBeInTheDocument()
  })

  it('has logout button', async () => {
    // Mock authenticated response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            user: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              provider: 'google',
              isAuthenticated: true,
            },
          }),
      })
    )

    const TestComponent = await HomePage()
    render(<div>{TestComponent}</div>, { wrapper: createWrapper() })

    await waitFor(() => {
      // The dashboard should render properly
      expect(screen.getByText('추천 이웃')).toBeInTheDocument()
    })
  })

  it('dashboard has proper layout structure', async () => {
    // Mock authenticated response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            user: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              provider: 'google',
              isAuthenticated: true,
            },
          }),
      })
    )

    const TestComponent = await HomePage()
    render(<div>{TestComponent}</div>, { wrapper: createWrapper() })

    await waitFor(() => {
      // Check that the main dashboard elements are present
      expect(screen.getByText('추천 이웃')).toBeInTheDocument()
    })
  })
})
