/**
 * API Client - Centralized fetch wrapper with authentication
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

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
  params?: Record<string, string | number | boolean>
}

/**
 * Build URL with query parameters
 */
function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean>
): string {
  const url = new URL(path, BASE_URL)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }

  return url.toString()
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

  if (data.code !== 1000) {
    throw new ApiError(
      data.message || 'Request failed',
      response.status,
      data.code
    )
  }

  return data.result
}

/**
 * Main API client function
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
    params?: Record<string, string | number | boolean>
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
