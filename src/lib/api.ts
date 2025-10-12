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
      const data = (await response.json()) as ApiResponse<unknown>
      // 백엔드가 Set-Cookie로 새 access_token 설정
      const successCodes = [1000, '1000', '2000', 2000]
      return successCodes.includes(data.code)
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

  try {
    const response = await fetch(url, config)
    return await parseResponse<T>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      // 401 Unauthorized: Access token 만료
      if (error.status === 401 && !path.includes('/auth/reissue')) {
        // 이미 refresh 중이면 대기
        if (isRefreshing) {
          return new Promise<T>((resolve, reject) => {
            subscribeTokenRefresh(async () => {
              try {
                // 토큰 갱신 후 원래 요청 재시도
                const retryResponse = await fetch(url, config)
                const result = await parseResponse<T>(retryResponse)
                resolve(result)
              } catch (retryError) {
                reject(retryError)
              }
            })
          })
        }

        // Refresh token으로 access token 갱신 시도
        isRefreshing = true

        try {
          const refreshSuccess = await refreshAccessToken()

          if (refreshSuccess) {
            // 갱신 성공: 대기 중인 요청들에게 알림
            onTokenRefreshed('refreshed')

            // 원래 요청 재시도
            const retryResponse = await fetch(url, config)
            return await parseResponse<T>(retryResponse)
          } else {
            // Refresh 실패: 로그아웃 처리
            onTokenRefreshed('failed')
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('sessionExpired', 'true')
              window.location.replace('/login?session=expired')
            }
            throw new ApiError('Session expired', 401)
          }
        } finally {
          isRefreshing = false
        }
      }

      throw error
    }
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
