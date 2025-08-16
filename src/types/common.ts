// 공통 API 응답 타입 정의

export interface ApiResponse<T> {
  code: string
  message: string
  result: T
}

export interface PaginationInfo {
  curPage: number
  curElements: number
  totalPages: number
  totalElements: number
  last: boolean
}
