// 공통 API 클라이언트 유틸리티

import { ApiResponse } from '@/types/common'

// 기본 fetch 옵션들
const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
}

// API 에러 클래스
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 공통 fetch 래퍼 함수
export async function apiClient<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...DEFAULT_FETCH_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_FETCH_OPTIONS.headers,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      errorData?.code || 'UNKNOWN_ERROR',
      errorData?.message || `HTTP ${response.status}`
    )
  }

  return response.json()
}

// GET 요청 헬퍼
export function apiGet<T>(url: string, options?: RequestInit): Promise<T> {
  return apiClient<T>(url, { ...options, method: 'GET' })
}

// POST 요청 헬퍼
export function apiPost<T>(
  url: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  return apiClient<T>(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

// PATCH 요청 헬퍼
export function apiPatch<T>(
  url: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  return apiClient<T>(url, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}

// DELETE 요청 헬퍼
export function apiDelete<T>(url: string, options?: RequestInit): Promise<T> {
  return apiClient<T>(url, { ...options, method: 'DELETE' })
}

// API 응답에서 result 추출 헬퍼
export function extractResult<T>(response: ApiResponse<T>): T {
  return response.result
}
