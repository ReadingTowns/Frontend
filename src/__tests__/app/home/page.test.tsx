import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import HomePage from '@/app/(protected)/home/page'
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

describe('Home Page (Dashboard)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
  })

  it('renders dashboard with user info', async () => {
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
            isAuthenticated: true
          }
        })
      })
    )

    render(<HomePage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('리딩 타운')).toBeInTheDocument()
      expect(screen.getByText('책으로 연결되는 우리 동네')).toBeInTheDocument()
      expect(screen.getByText('안녕하세요, Test User님!')).toBeInTheDocument()
    })

    // 대시보드 섹션들 확인
    expect(screen.getByText('현재 교환')).toBeInTheDocument()
    expect(screen.getByText('추천 이웃')).toBeInTheDocument()
    expect(screen.getByText('오늘의 추천 도서')).toBeInTheDocument()
    expect(screen.getByText('빠른 실행')).toBeInTheDocument()
  })

  it('has logout button', async () => {
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
            isAuthenticated: true
          }
        })
      }),
      http.post('/api/auth/logout', () => {
        return HttpResponse.json({ success: true })
      })
    )

    render(<HomePage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('로그아웃')).toBeInTheDocument()
    })
  })

  it('dashboard has proper layout structure', async () => {
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
            isAuthenticated: true
          }
        })
      })
    )

    render(<HomePage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('리딩 타운')).toBeInTheDocument()
    })

    // 헤더가 올바른 구조를 가지는지 확인
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('mb-8')

    // 그래디언트 텍스트 확인
    const title = screen.getByText('리딩 타운')
    expect(title).toHaveClass('text-3xl', 'font-bold')
  })
})