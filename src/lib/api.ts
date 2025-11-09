/**
 * API Client - Centralized fetch wrapper with authentication
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

/**
 * Token refresh state management
 * Prevents race conditions when multiple requests fail simultaneously
 */
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

/**
 * Add callback to be executed after token refresh
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

/**
 * Execute all callbacks after token refresh
 */
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  timestamp: string
  code: number
  message: string
  result: T
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Fetch options with credentials included by default
 */
interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * Build URL with query parameters
 */
function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(path, BASE_URL)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      // Skip undefined values
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/reissue`, {
      method: 'POST',
      credentials: 'include', // refresh_token 쿠키 포함
    })

    if (response.ok) {
      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type')
      const contentLength = response.headers.get('content-length')

      // If no content or empty response, but status is OK, consider it success
      // (Some backends return 200 with Set-Cookie header but no body)
      if (!contentType || contentLength === '0' || contentLength === null) {
        console.log(
          '🔍 [api.ts] 토큰 재발급 성공 (응답 본문 없음, Set-Cookie 헤더만 존재)'
        )
        return true
      }

      // If JSON content exists, parse and validate
      if (contentType.includes('application/json')) {
        const data = (await response.json()) as ApiResponse<unknown>
        const successCodes = [1000, '1000', '2000', 2000]
        return successCodes.includes(data.code)
      }

      // Unknown content type but OK status - consider success
      return true
    }

    return false
  } catch (error) {
    console.error('Token refresh failed:', error)
    return false
  }
}

/**
 * Parse API response
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')

  if (!contentType || !contentType.includes('application/json')) {
    throw new ApiError('Invalid response format', response.status)
  }

  const data = (await response.json()) as ApiResponse<T>

  if (!response.ok) {
    throw new ApiError(
      data.message || 'Request failed',
      response.status,
      data.code
    )
  }

  // Accept both 1000 (number) and "1000"/"2000" (string) as success codes
  const successCodes = [1000, '1000', '2000', 2000]
  if (!successCodes.includes(data.code)) {
    throw new ApiError(
      data.message || 'Request failed',
      response.status,
      typeof data.code === 'string' ? parseInt(data.code) : data.code
    )
  }

  return data.result
}

/**
 * Main API client function with automatic token refresh
 */
async function apiClient<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers, ...fetchOptions } = options

  const url = buildUrl(path, params)

  const config: RequestInit = {
    ...fetchOptions,
    credentials: 'include', // 🔥 자동으로 쿠키 포함
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  console.log('🔍 [api.ts] API 요청 시작:', { url, path })

  try {
    const response = await fetch(url, config)
    console.log('🔍 [api.ts] API 응답 받음:', {
      url,
      status: response.status,
      ok: response.ok,
    })
    return await parseResponse<T>(response)
  } catch (error) {
    console.log('🔍 [api.ts] API 에러 발생:', {
      url,
      error,
      errorType: error instanceof ApiError ? 'ApiError' : 'Unknown',
      status: error instanceof ApiError ? error.status : 'N/A',
    })

    if (error instanceof ApiError) {
      // 401 Unauthorized: Access token 만료
      if (error.status === 401 && !path.includes('/auth/reissue')) {
        console.log('🔍 [api.ts] 401 에러 감지 - 토큰 재발급 시작:', {
          url,
          isRefreshing,
          currentPath:
            typeof window !== 'undefined' ? window.location.pathname : 'N/A',
        })

        // 이미 refresh 중이면 대기
        if (isRefreshing) {
          console.log('🔍 [api.ts] 이미 재발급 중 - 대기열에 추가:', url)
          return new Promise<T>((resolve, reject) => {
            subscribeTokenRefresh(async () => {
              try {
                console.log('🔍 [api.ts] 대기열에서 재시도:', url)
                // 토큰 갱신 후 원래 요청 재시도
                const retryResponse = await fetch(url, config)
                const result = await parseResponse<T>(retryResponse)
                console.log('🔍 [api.ts] 대기열 재시도 성공:', url)
                resolve(result)
              } catch (retryError) {
                console.log('🔍 [api.ts] 대기열 재시도 실패:', url, retryError)
                reject(retryError)
              }
            })
          })
        }

        // Refresh token으로 access token 갱신 시도
        isRefreshing = true
        console.log('🔍 [api.ts] 토큰 재발급 시작')

        try {
          const refreshSuccess = await refreshAccessToken()
          console.log('🔍 [api.ts] 토큰 재발급 결과:', refreshSuccess)

          if (refreshSuccess) {
            // 갱신 성공: 대기 중인 요청들에게 알림
            console.log('🔍 [api.ts] 토큰 재발급 성공 - 원래 요청 재시도')
            onTokenRefreshed('refreshed')

            // 원래 요청 재시도
            const retryResponse = await fetch(url, config)
            console.log('🔍 [api.ts] 재시도 응답:', {
              url,
              status: retryResponse.status,
              ok: retryResponse.ok,
            })
            const result = await parseResponse<T>(retryResponse)
            console.log('🔍 [api.ts] 재시도 성공 - 결과 반환:', url)
            return result
          } else {
            // Refresh 실패: 로그아웃 처리
            console.log(
              '🔍 [api.ts] 토큰 재발급 실패 - 로그인 페이지로 리다이렉트'
            )
            onTokenRefreshed('failed')
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('sessionExpired', 'true')
              console.log(
                '🔍 [api.ts] window.location.replace 호출 - /login?session=expired'
              )
              window.location.replace('/login?session=expired')
            }
            throw new ApiError('Session expired', 401)
          }
        } finally {
          isRefreshing = false
          console.log('🔍 [api.ts] 토큰 재발급 프로세스 종료')
        }
      }

      console.log('🔍 [api.ts] ApiError throw:', error)
      throw error
    }
    console.log('🔍 [api.ts] 일반 에러 throw:', error)
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

/**
 * Convenience methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T = unknown>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ) => apiClient<T>(path, { method: 'GET', params }),

  /**
   * POST request
   */
  post: <T = unknown>(path: string, body?: unknown) =>
    apiClient<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T = unknown>(path: string, body?: unknown) =>
    apiClient<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: <T = unknown>(path: string, body?: unknown) =>
    apiClient<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T = unknown>(path: string) =>
    apiClient<T>(path, { method: 'DELETE' }),
}

/**
 * Export for advanced use cases
 */
export { apiClient }
