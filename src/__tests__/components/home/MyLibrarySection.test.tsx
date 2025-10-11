import { render, screen } from '@testing-library/react'
import MyLibrarySection from '@/components/home/MyLibrarySection'
import { LibraryBook } from '@/types/home'

describe('MyLibrarySection', () => {
  const mockBooks: LibraryBook[] = [
    {
      id: '1',
      title: '테스트 도서 1',
      coverImage: 'https://example.com/book1.jpg',
      categories: ['드라마', '성장소설'],
      readingStatus: 'reading',
    },
    {
      id: '2',
      title: '테스트 도서 2',
      coverImage: 'https://example.com/book2.jpg',
      categories: ['SF', '판타지'],
      readingStatus: 'completed',
    },
    {
      id: '3',
      title: '테스트 도서 3',
      coverImage: '',
      categories: ['역사'],
      readingStatus: 'wish',
    },
    {
      id: '4',
      title: '테스트 도서 4',
      coverImage: 'https://example.com/book4.jpg',
      categories: [],
      readingStatus: 'reading',
    },
    {
      id: '5',
      title: '테스트 도서 5',
      coverImage: 'https://example.com/book5.jpg',
      categories: ['비즈니스', '자기계발', '경제'],
      readingStatus: 'completed',
    },
    {
      id: '6',
      title: '테스트 도서 6',
      coverImage: 'https://example.com/book6.jpg',
      categories: ['소설'],
      readingStatus: 'wish',
    },
  ]

  it('should render loading state', () => {
    render(<MyLibrarySection books={[]} isLoading={true} />)

    // 스켈레톤 6개 확인
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(6)
  })

  it('should render empty state when no books', () => {
    render(<MyLibrarySection books={[]} isLoading={false} />)

    expect(screen.getByText('아직 등록된 도서가 없습니다')).toBeInTheDocument()
  })

  it('should render books in 2x3 grid', () => {
    render(<MyLibrarySection books={mockBooks} isLoading={false} />)

    // 책 제목 확인
    expect(screen.getByText('테스트 도서 1')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 2')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 3')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 4')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 5')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 6')).toBeInTheDocument()
  })

  it('should render images with correct alt text', () => {
    render(<MyLibrarySection books={mockBooks} isLoading={false} />)

    const images = screen.getAllByRole('img')
    expect(images[0]).toHaveAttribute('alt', '테스트 도서 1')
    expect(images[1]).toHaveAttribute('alt', '테스트 도서 2')
  })

  it('should display placeholder for missing cover image', () => {
    render(<MyLibrarySection books={mockBooks} isLoading={false} />)

    expect(screen.getByText('표지 없음')).toBeInTheDocument()
  })

  it('should render category tags', () => {
    render(<MyLibrarySection books={mockBooks} isLoading={false} />)

    // 첫 번째 책의 카테고리 태그 확인
    expect(screen.getByText('#드라마')).toBeInTheDocument()
    expect(screen.getByText('#성장소설')).toBeInTheDocument()

    // 두 번째 책의 카테고리 태그 확인
    expect(screen.getByText('#SF')).toBeInTheDocument()
    expect(screen.getByText('#판타지')).toBeInTheDocument()
  })

  it('should display only first 2 category tags when more than 2 exist', () => {
    render(<MyLibrarySection books={mockBooks} isLoading={false} />)

    // 5번째 책은 3개 카테고리가 있지만 2개만 표시
    expect(screen.getByText('#비즈니스')).toBeInTheDocument()
    expect(screen.getByText('#자기계발')).toBeInTheDocument()
    expect(screen.queryByText('#경제')).not.toBeInTheDocument()
  })

  it('should not display category section when no categories', () => {
    const booksWithoutCategories: LibraryBook[] = [
      {
        id: '1',
        title: '카테고리 없는 책',
        coverImage: 'https://example.com/book.jpg',
        categories: [],
        readingStatus: 'reading',
      },
    ]

    render(
      <MyLibrarySection books={booksWithoutCategories} isLoading={false} />
    )

    // 카테고리 태그가 없는 경우 카테고리 섹션 자체가 렌더링되지 않음
    const categoryTags = document.querySelectorAll('.text-xs.text-gray-500')
    expect(categoryTags.length).toBe(0)
  })

  it('should render only first 6 books when more than 6 books provided', () => {
    const manyBooks: LibraryBook[] = [
      ...mockBooks,
      {
        id: '7',
        title: '테스트 도서 7',
        coverImage: '',
        categories: ['추가도서'],
        readingStatus: 'reading',
      },
      {
        id: '8',
        title: '테스트 도서 8',
        coverImage: '',
        categories: ['추가도서'],
        readingStatus: 'reading',
      },
    ]

    render(<MyLibrarySection books={manyBooks} isLoading={false} />)

    // 첫 6권만 렌더링되는지 확인
    expect(screen.getByText('테스트 도서 1')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 2')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 3')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 4')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 5')).toBeInTheDocument()
    expect(screen.getByText('테스트 도서 6')).toBeInTheDocument()
    expect(screen.queryByText('테스트 도서 7')).not.toBeInTheDocument()
    expect(screen.queryByText('테스트 도서 8')).not.toBeInTheDocument()
  })

  it('should have correct grid layout classes', () => {
    const { container } = render(
      <MyLibrarySection books={mockBooks} isLoading={false} />
    )

    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-2', 'gap-4')
  })
})
