// BookCard 통합 컴포넌트 타입 정의

/**
 * 기본 Book 타입 (통일된 필드명)
 */
export interface Book {
  bookId: number
  bookTitle: string // bookName에서 통일
  bookCoverImage: string | null // bookImage에서 통일
  author: string
  publisher?: string
  description?: string
  publicationDate?: string
}

/**
 * Grid variant용 확장 Book 타입
 * - 서재, 추천, 검색, 교환 도서에서 사용
 */
export interface GridBook extends Book {
  bookhouseId?: number
  categories?: string[]
  statusLabel?: string
  statusColor?: 'blue' | 'pink' | 'gray'
  similarity?: number
  relatedUserKeywords?: string[] | null
  partnerNickname?: string
}

/**
 * Grid Variant Props
 * - 서재 페이지 (3열, 액션 메뉴, 카테고리, 상태)
 * - 추천 탭 (가로 스크롤, 유사도, 키워드)
 * - 검색 결과 (2열, 선택 모드)
 * - 교환 도서 (3열, 파트너 정보)
 */
export interface BookCardGridProps {
  variant: 'grid'
  book: GridBook

  // Layout
  columns?: 1 | 2 | 3
  compact?: boolean
  aspectRatio?: '2/3' | '3/4'

  // Features
  showActions?: boolean
  showSimilarity?: boolean
  showKeywords?: boolean
  showCategories?: boolean
  showStatus?: boolean
  showPartner?: boolean

  // Owner mode
  isOwner?: boolean
  ownerId?: number

  // Interaction
  onClick?: (book: GridBook) => void
  onActionClick?: (action: 'review' | 'delete', book: GridBook) => void
  onExchangeRequest?: (
    bookId: number,
    bookhouseId: number,
    bookTitle: string
  ) => void
}

/**
 * Detail Variant Props
 * - 책 상세 페이지
 * - 책 등록 확인 모달
 */
export interface BookCardDetailProps {
  variant: 'detail'
  book: Book

  // Layout
  size?: 'medium' | 'large'

  // Features
  showFullInfo?: boolean
  showReviews?: boolean
  showOwnerInfo?: boolean

  // Owner mode
  fromLibrary?: boolean
  ownerId?: string

  // Interaction
  onReviewSubmit?: (content: string) => void
  onBack?: () => void
}

/**
 * Discriminated Union 타입
 * - TypeScript가 variant에 따라 자동으로 타입 좁히기
 * - 잘못된 prop 조합 컴파일 타임에 감지
 */
export type BookCardProps = BookCardGridProps | BookCardDetailProps
