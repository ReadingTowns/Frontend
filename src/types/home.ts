/**
 * 홈 화면 관련 타입 정의
 */

/**
 * 홈 탭 타입
 */
export type HomeTab = 'myTown' | 'recommendations'

/**
 * 인기 도서 정보
 */
export interface PopularBook {
  id: string
  title: string
  coverImage: string
  rank: number
  author?: string
  publisher?: string
}

/**
 * 추천 도서 정보
 */
export interface RecommendedBook {
  id: string
  title: string
  coverImage: string
  reason?: string
  matchScore?: number
}

/**
 * 백엔드 API 응답 구조 (실제 API 응답)
 */
export interface ExchangeApiResponse {
  chatRoomId: number | null
  myBook: {
    bookhouseId: number
    bookName: string
    bookImage: string
  } | null
  yourBook: {
    bookhouseId: number
    bookName: string
    bookImage: string
  } | null
}

/**
 * 교환한 도서 정보 (프론트엔드 사용)
 */
export interface ExchangedBook {
  exchangeId: number
  bookTitle: string
  bookCoverImage: string
  chatRoomId?: number | null
  partnerMemberId?: number
  partnerNickname?: string
  exchangeDate?: string
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  isMyBook: boolean // true: 내가 빌려준 책, false: 내가 빌린 책
}

/**
 * 서재 도서 정보
 */
export interface LibraryBook {
  id: string
  title: string
  coverImage: string
  categories: string[]
  readingStatus: 'reading' | 'completed' | 'wish'
}

/**
 * 홈 데이터 응답
 */
export interface HomeData {
  nickname: string
  townName: string
  popularBooks: PopularBook[]
  recommendations: RecommendedBook[]
  exchanges: ExchangedBook[]
  library: LibraryBook[]
}
