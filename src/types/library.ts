// Library/서재 관련 타입 정의 (노션 API 명세 기반)

import { ApiResponse, PaginationInfo } from './common'

// 기본 서재 책 정보 (리스트 조회시)
export interface LibraryBook {
  id: string // 책 id
  image: string // 이미지 조회 URI
  title: string // 책 제목
  authorName: string // 작가 이름
}

// 서재 책 리스트 응답
export interface LibraryBooksResponse {
  content: LibraryBook[]
}

export type LibraryBooksApiResponse = ApiResponse<
  LibraryBooksResponse & PaginationInfo
>

// 서재 책 등록 요청
export interface AddLibraryBookRequest {
  isbn: string
  image: string
  title: string
  author: string
  publisher: string
}

// 서재 책 등록 응답
export type AddLibraryBookApiResponse = ApiResponse<null>

// 서재 책 삭제 응답
export type DeleteLibraryBookApiResponse = ApiResponse<null>

// 사용자 프로필 정보
export interface UserProfile {
  memberId: number
  profileImage: string
  nickname: string
  currentTown: string
  userRating: number | null
  userRatingCount: number
  availableTime: string | null
  following: boolean
}

export type UserProfileApiResponse = ApiResponse<UserProfile>

// 책 감상평
export interface BookReview {
  reviewId: number
  content: string
}

// 감상평 등록 요청
export interface AddReviewRequest {
  content: string
}

// 감상평 등록 응답
export type AddReviewApiResponse = ApiResponse<Pick<BookReview, 'content'>>

// 감상평 조회 응답
export type GetReviewApiResponse = ApiResponse<BookReview>

// 감상평 수정 요청
export interface UpdateReviewRequest {
  content: string
}

// 감상평 수정 응답
export type UpdateReviewApiResponse = ApiResponse<Pick<BookReview, 'content'>>

// 서재 통계 정보 (UI용 - 실제 API는 없지만 클라이언트에서 계산)
export interface LibraryStats {
  totalBooks: number
  completedBooks: number
  readingBooks: number
  completionRate: number
}

// 교환자들의 감상평 (책방/서재 > 책 조회 페이지)
export interface ExchangerReview {
  reviewId: number
  memberName: string
  memberImage: string
  content: string
  createdAt: string
}

export type ExchangerReviewsApiResponse = ApiResponse<ExchangerReview[]>

// 특정 사람의 특정 책 감상평
export interface UserBookReview {
  reviewId: number
  content: string
  memberName: string
  memberImage: string
}

export type UserBookReviewApiResponse = ApiResponse<UserBookReview>

// 서재 컴포넌트 Props 타입들
export interface LibraryBookCardProps {
  book: LibraryBook
  onDelete?: (bookId: string) => void
  onReviewClick?: (bookId: string) => void
  showActions?: boolean
  isOwner?: boolean
}

export interface BookReviewModalProps {
  isOpen: boolean
  onClose: () => void
  bookId: string
  bookTitle: string
  existingReview?: BookReview
  mode: 'create' | 'edit'
}

export interface LibraryStatsProps {
  stats: LibraryStats
  isLoading?: boolean
}

export interface UserLibraryProfileProps {
  user: UserProfile
  isLoading?: boolean
}

// Hook 반환 타입들
export interface UseLibraryBooksResult {
  books: LibraryBook[]
  pagination: PaginationInfo | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
  fetchNextPage: () => void
  hasNextPage: boolean
}

export interface UseAddLibraryBookResult {
  mutate: (data: AddLibraryBookRequest) => void
  isLoading: boolean
  error: Error | null
  isSuccess: boolean
}

export interface UseDeleteLibraryBookResult {
  mutate: (bookId: string) => void
  isLoading: boolean
  error: Error | null
  isSuccess: boolean
}

export interface UseBookReviewResult {
  review: BookReview | null
  isLoading: boolean
  error: Error | null
  addReview: {
    mutate: (data: AddReviewRequest) => void
    isLoading: boolean
    error: Error | null
    isSuccess: boolean
  }
  updateReview: {
    mutate: (data: UpdateReviewRequest) => void
    isLoading: boolean
    error: Error | null
    isSuccess: boolean
  }
}
