import { render, screen } from '@testing-library/react'
import ExchangedBooksSection from '@/components/home/ExchangedBooksSection'
import { ExchangedBook } from '@/types/home'

describe('ExchangedBooksSection', () => {
  const mockBooks: ExchangedBook[] = [
    {
      exchangeId: 1,
      bookTitle: '테스트 도서 1',
      bookCoverImage: 'https://example.com/book1.jpg',
      partnerMemberId: 100,
      partnerNickname: '홍길동',
      exchangeDate: '2025-10-01',
      status: 'COMPLETED',
    },
    {
      exchangeId: 2,
      bookTitle: '테스트 도서 2',
      bookCoverImage: 'https://example.com/book2.jpg',
      partnerMemberId: 101,
      partnerNickname: '김철수',
      exchangeDate: '2025-10-05',
      status: 'COMPLETED',
    },
    {
      exchangeId: 3,
      bookTitle: '테스트 도서 3',
      bookCoverImage: '',
      partnerMemberId: 102,
      partnerNickname: '이영희',
      exchangeDate: '2025-10-08',
      status: 'COMPLETED',
    },
  ]

  it('should render loading state', () => {
    render(<ExchangedBooksSection books={[]} isLoading={true} />)

    // 스켈레톤 3개 확인
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(3)
  })

  it('should render empty state when no books', () => {
    render(<ExchangedBooksSection books={[]} isLoading={false} />)

    expect(screen.getByText('아직 교환한 도서가 없습니다')).toBeInTheDocument()
  })

  it('should render books correctly', () => {
    render(<ExchangedBooksSection books={mockBooks} isLoading={false} />)

    // 책 제목 확인
    expect(screen.getByText('테스트 도서 1')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 2')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 3')).toBeInTheDocument()

    // 교환 상대 닉네임 확인
    expect(screen.getByText('홍길동님과 교환')).toBeInTheDocument()
    expect(screen.getByText('김철수님과 교환')).toBeInTheDocument()
    expect(screen.getByText('이영희님과 교환')).toBeInTheDocument()
  })

  it('should render images with correct alt text', () => {
    render(<ExchangedBooksSection books={mockBooks} isLoading={false} />)

    const images = screen.getAllByRole('img')
    expect(images[0]).toHaveAttribute('alt', '테스트 도서 1')
    expect(images[1]).toHaveAttribute('alt', '테스트 도서 2')
  })

  it('should display placeholder for missing cover image', () => {
    render(<ExchangedBooksSection books={mockBooks} isLoading={false} />)

    expect(screen.getByText('표지 없음')).toBeInTheDocument()
  })

  it('should render only first 3 books when more than 3 books provided', () => {
    const manyBooks: ExchangedBook[] = [
      ...mockBooks,
      {
        exchangeId: 4,
        bookTitle: '테스트 도서 4',
        bookCoverImage: '',
        partnerMemberId: 103,
        partnerNickname: '박민수',
        exchangeDate: '2025-10-10',
        status: 'COMPLETED',
      },
      {
        exchangeId: 5,
        bookTitle: '테스트 도서 5',
        bookCoverImage: '',
        partnerMemberId: 104,
        partnerNickname: '최수진',
        exchangeDate: '2025-10-11',
        status: 'COMPLETED',
      },
    ]

    render(<ExchangedBooksSection books={manyBooks} isLoading={false} />)

    // 첫 3권만 렌더링되는지 확인
    expect(screen.getByText('테스트 도서 1')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 2')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 3')).toBeInTheDocument()
    expect(screen.queryByText('테스트 도서 4')).not.toBeInTheDocument()
    expect(screen.queryByText('테스트 도서 5')).not.toBeInTheDocument()
  })
})
