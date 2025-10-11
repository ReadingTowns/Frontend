import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock the API client before importing components
const mockApiGet = jest.fn()
const mockApiPost = jest.fn()
const mockApiPut = jest.fn()
const mockApiPatch = jest.fn()
const mockApiDelete = jest.fn()

jest.mock('../../../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => mockApiGet(...args),
    post: (...args: unknown[]) => mockApiPost(...args),
    put: (...args: unknown[]) => mockApiPut(...args),
    patch: (...args: unknown[]) => mockApiPatch(...args),
    delete: (...args: unknown[]) => mockApiDelete(...args),
  },
}))

import HomePage from '@/app/(protected)/home/page'

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

describe('NewHomePage', () => {
  beforeEach(() => {
    // Mock API responses using api client
    mockApiGet.mockImplementation((path: string) => {
      // Mock exchanged books API - return empty array
      if (path.includes('/api/v1/members/me/exchanges')) {
        return Promise.resolve([])
      }
      // Mock library books API - return empty array
      if (path.includes('/api/v1/bookhouse/members/me')) {
        return Promise.resolve([])
      }
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render home page with default myTown tab', () => {
    render(<HomePage />, { wrapper: createWrapper() })

    // 탭바 존재 확인
    expect(
      screen.getByRole('tab', { name: /님의 리딩타운/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /님에게 추천하는 도서/ })
    ).toBeInTheDocument()

    // "나의 리딩타운" 탭 콘텐츠 확인
    expect(screen.getByText('가양동 인기 도서 Top 10')).toBeInTheDocument()
    expect(screen.getByText('이웃과 교환한 도서')).toBeInTheDocument()
    expect(screen.getByText('나의 서재')).toBeInTheDocument()
  })

  it('should switch to recommendations tab when clicking tab', () => {
    render(<HomePage />, { wrapper: createWrapper() })

    const recommendationsTab = screen.getByRole('tab', {
      name: /님에게 추천하는 도서/,
    })
    fireEvent.click(recommendationsTab)

    // 추천 도서 탭 콘텐츠 확인
    expect(
      screen.getByText('추천 도서 전체 목록 (구현 예정)')
    ).toBeInTheDocument()
  })

  it('should show placeholder sections for myTown tab', async () => {
    render(<HomePage />, { wrapper: createWrapper() })

    expect(screen.getByText('인기 도서 섹션 (구현 예정)')).toBeInTheDocument()
    expect(screen.getByText('추천 도서 섹션 (구현 예정)')).toBeInTheDocument()

    // 교환한 도서 섹션 - 실제 구현됨, 빈 상태 확인
    await waitFor(() => {
      expect(
        screen.getByText('아직 교환한 도서가 없습니다')
      ).toBeInTheDocument()
    })

    // 나의 서재 섹션 - 실제 구현됨, 빈 상태 확인
    await waitFor(() => {
      expect(
        screen.getByText('아직 등록된 도서가 없습니다')
      ).toBeInTheDocument()
    })
  })

  it('should display section headers with correct styling', () => {
    render(<HomePage />, { wrapper: createWrapper() })

    const headers = screen.getAllByRole('heading', { level: 2 })
    expect(headers.length).toBeGreaterThan(0)

    // 첫 번째 헤더 스타일 확인
    expect(headers[0]).toHaveClass('text-xl', 'font-bold')
  })

  it('should have proper max-width container for mobile-first design', () => {
    const { container } = render(<HomePage />, { wrapper: createWrapper() })

    const mainElement = container.querySelector('main')
    expect(mainElement).toHaveClass('max-w-[430px]', 'mx-auto')
  })
})
