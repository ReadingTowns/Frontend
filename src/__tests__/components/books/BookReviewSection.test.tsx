import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BookReviewSection from '@/components/books/BookReviewSection'
import * as useBookDetailHooks from '@/hooks/useBookDetail'
import React from 'react'

// Mock hooks
jest.mock('@/hooks/useBookDetail', () => ({
  useCreateBookReview: jest.fn(),
  useUpdateBookReview: jest.fn(),
  useDeleteBookReview: jest.fn(),
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

describe('BookReviewSection', () => {
  const mockCreateReview = {
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
  }

  const mockUpdateReview = {
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
  }

  const mockDeleteReview = {
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useBookDetailHooks.useCreateBookReview as jest.Mock).mockReturnValue(
      mockCreateReview
    )
    ;(useBookDetailHooks.useUpdateBookReview as jest.Mock).mockReturnValue(
      mockUpdateReview
    )
    ;(useBookDetailHooks.useDeleteBookReview as jest.Mock).mockReturnValue(
      mockDeleteReview
    )
  })

  it('should show create button when no review exists', () => {
    render(
      <BookReviewSection
        bookId="1"
        bookTitle="테스트 책"
        myReview={null}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('감상평 작성하기')).toBeInTheDocument()
  })

  it('should show textarea when clicking create button', () => {
    render(
      <BookReviewSection
        bookId="1"
        bookTitle="테스트 책"
        myReview={null}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )

    const createButton = screen.getByText('감상평 작성하기')
    fireEvent.click(createButton)

    expect(
      screen.getByPlaceholderText('"테스트 책"에 대한 감상을 남겨주세요...')
    ).toBeInTheDocument()
  })

  it('should display existing review', () => {
    const mockReview = {
      reviewId: 1,
      content: '정말 좋은 책이었습니다.',
    }

    render(
      <BookReviewSection
        bookId="1"
        bookTitle="테스트 책"
        myReview={mockReview}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('정말 좋은 책이었습니다.')).toBeInTheDocument()
    expect(screen.getByText('수정')).toBeInTheDocument()
    expect(screen.getByText('삭제')).toBeInTheDocument()
  })

  it('should create review when clicking save button', async () => {
    mockCreateReview.mutateAsync.mockResolvedValueOnce({})

    render(
      <BookReviewSection
        bookId="1"
        bookTitle="테스트 책"
        myReview={null}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )

    // 작성 버튼 클릭
    fireEvent.click(screen.getByText('감상평 작성하기'))

    // 텍스트 입력
    const textarea = screen.getByPlaceholderText(
      '"테스트 책"에 대한 감상을 남겨주세요...'
    )
    fireEvent.change(textarea, { target: { value: '멋진 책입니다!' } })

    // 저장 버튼 클릭
    fireEvent.click(screen.getByText('저장'))

    await waitFor(() => {
      expect(mockCreateReview.mutateAsync).toHaveBeenCalledWith(
        '멋진 책입니다!'
      )
    })
  })

  it('should update review when clicking save after edit', async () => {
    const mockReview = {
      reviewId: 1,
      content: '원래 감상평',
    }

    mockUpdateReview.mutateAsync.mockResolvedValueOnce({})

    render(
      <BookReviewSection
        bookId="1"
        bookTitle="테스트 책"
        myReview={mockReview}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )

    // 수정 버튼 클릭
    fireEvent.click(screen.getByText('수정'))

    // 텍스트 수정
    const textarea = screen.getByDisplayValue('원래 감상평')
    fireEvent.change(textarea, { target: { value: '수정된 감상평' } })

    // 저장 버튼 클릭
    fireEvent.click(screen.getByText('저장'))

    await waitFor(() => {
      expect(mockUpdateReview.mutateAsync).toHaveBeenCalledWith('수정된 감상평')
    })
  })

  it('should show delete confirmation modal', () => {
    const mockReview = {
      reviewId: 1,
      content: '원래 감상평',
    }

    render(
      <BookReviewSection
        bookId="1"
        bookTitle="테스트 책"
        myReview={mockReview}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )

    // 삭제 버튼 클릭
    fireEvent.click(screen.getByText('삭제'))

    // 확인 모달이 나타나는지 확인
    expect(screen.getByText('감상평 삭제')).toBeInTheDocument()
    expect(
      screen.getByText(/정말로 감상평을 삭제하시겠습니까?/)
    ).toBeInTheDocument()
  })

  it('should delete review when confirming deletion', async () => {
    const mockReview = {
      reviewId: 1,
      content: '원래 감상평',
    }

    mockDeleteReview.mutateAsync.mockResolvedValueOnce({})

    render(
      <BookReviewSection
        bookId="1"
        bookTitle="테스트 책"
        myReview={mockReview}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )

    // 삭제 버튼 클릭
    fireEvent.click(screen.getByText('삭제'))

    // 모달에서 삭제 확인
    const confirmButtons = screen.getAllByText('삭제')
    fireEvent.click(confirmButtons[1]) // 모달의 삭제 버튼

    await waitFor(() => {
      expect(mockDeleteReview.mutateAsync).toHaveBeenCalled()
    })
  })

  it('should validate empty review content', () => {
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <BookReviewSection
        bookId="1"
        bookTitle="테스트 책"
        myReview={null}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )

    // 작성 버튼 클릭
    fireEvent.click(screen.getByText('감상평 작성하기'))

    // 빈 내용으로 저장 시도
    fireEvent.click(screen.getByText('저장'))

    expect(alertMock).toHaveBeenCalledWith('감상평을 입력해주세요.')
    expect(mockCreateReview.mutateAsync).not.toHaveBeenCalled()

    alertMock.mockRestore()
  })

  it('should show loading spinner when isLoading is true', () => {
    render(
      <BookReviewSection
        bookId="1"
        bookTitle="테스트 책"
        myReview={null}
        isLoading={true}
      />,
      { wrapper: createWrapper() }
    )

    // 로딩 스피너가 렌더링되는지 확인
    expect(screen.getByRole('status', { name: /로딩 중/i })).toBeInTheDocument()
  })
})
