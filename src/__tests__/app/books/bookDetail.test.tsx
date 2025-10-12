import { render, screen } from '@testing-library/react'
import BookDetailClient from '@/app/(protected)/books/[bookId]/BookDetailClient'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock the custom hooks
jest.mock('@/hooks/useBookDetail', () => ({
  useBookDetailPage: jest.fn(() => ({
    book: {
      data: {
        bookId: 1,
        isbn: '9781234567890',
        title: '테스트 책 제목',
        author: '테스트 저자',
        publisher: '테스트 출판사',
        image: 'https://example.com/cover.jpg',
        description: '테스트 책 설명입니다.',
        publicationDate: '2024-01-01',
      },
      isLoading: false,
      error: null,
    },
    myReview: {
      data: null,
      isLoading: false,
      error: null,
      hasReview: false,
    },
    isLoading: false,
  })),
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

describe('BookDetailClient', () => {
  it('should render book information', () => {
    render(<BookDetailClient bookId="1" />, { wrapper: createWrapper() })

    // 책 제목이 표시되는지 확인
    expect(screen.getByText('테스트 책 제목')).toBeInTheDocument()

    // 저자가 표시되는지 확인
    expect(screen.getByText(/테스트 저자/)).toBeInTheDocument()

    // 출판사가 표시되는지 확인
    expect(screen.getByText(/테스트 출판사/)).toBeInTheDocument()

    // 책 설명이 표시되는지 확인
    expect(screen.getByText('테스트 책 설명입니다.')).toBeInTheDocument()
  })

  it('should render back button', () => {
    render(<BookDetailClient bookId="1" />, { wrapper: createWrapper() })

    // 뒤로가기 버튼이 있는지 확인
    const backButton = screen.getByLabelText('뒤로가기')
    expect(backButton).toBeInTheDocument()
  })

  it('should render review section', () => {
    render(<BookDetailClient bookId="1" />, { wrapper: createWrapper() })

    // 리뷰 섹션 제목이 있는지 확인
    expect(screen.getByText('내 감상평')).toBeInTheDocument()
  })
})
