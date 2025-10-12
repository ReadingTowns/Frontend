/**
 * 책 정보 타입 정의
 */
export interface BookInfo {
  isbn: string
  title: string
  author: string
  publisher: string
  publishDate: string
  coverImage?: string
  description?: string
  category?: string
  price?: number
  link?: string
}

/**
 * 책 상세 정보 (백엔드 API)
 */
export interface BookDetail {
  bookId: number
  isbn: string
  bookName: string
  author: string
  publisher: string
  bookImage: string
  description?: string
  publicationDate?: string
}

/**
 * 책 리뷰 정보
 */
export interface BookReviewItem {
  reviewId: number
  memberId: number
  memberName: string
  memberImage: string
  content: string
  createdAt: string
}

/**
 * 내 리뷰 정보
 */
export interface MyBookReview {
  reviewId: number
  content: string
}

/**
 * 알라딘 API 응답 타입
 */
export interface AladinApiResponse {
  version: string
  logo: string
  title: string
  link: string
  pubDate: string
  totalResults: number
  startIndex: number
  itemsPerPage: number
  query: string
  searchCategoryId: number
  searchCategoryName: string
  item: AladinBookItem[]
  errorCode?: string
  errorMessage?: string
}

export interface AladinBookItem {
  title: string
  link: string
  author: string
  pubDate: string
  description: string
  isbn: string
  isbn13: string
  itemId: number
  priceSales: number
  priceStandard: number
  mallType: string
  stockStatus: string
  mileage: number
  cover: string
  categoryId: number
  categoryName: string
  publisher: string
  salesPoint: number
  adult: boolean
  fixedPrice: boolean
  customerReviewRank: number
  subInfo?: {
    subTitle?: string
    originalTitle?: string
    itemPage?: number
  }
}
