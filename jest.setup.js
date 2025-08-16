import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Global fetch mock for API Routes testing
global.fetch = jest.fn()

// Reset fetch mock before each test
beforeEach(() => {
  fetch.mockClear()
})

// Mock default successful API responses
beforeAll(() => {
  // Mock successful auth check
  fetch.mockImplementation(url => {
    if (url.includes('/api/auth/me')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: {
              id: 'test_user',
              email: 'test@example.com',
              name: 'Test User',
            },
          }),
      })
    }

    // Mock OAuth redirects
    if (url.includes('/oauth2/authorization/')) {
      return Promise.resolve({
        ok: true,
        status: 302,
        headers: { get: () => 'http://localhost:3000/auth/callback' },
      })
    }

    // Mock dashboard data
    if (url.includes('/api/v1/members/me/exchanges')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ result: null }),
      })
    }

    if (url.includes('/api/v1/users/recommendations')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ result: [] }),
      })
    }

    if (url.includes('/api/v1/books/recommendations')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ result: [] }),
      })
    }

    // Mock library data
    if (url.includes('/api/v1/bookhouse/members/me')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ result: { content: [] } }),
      })
    }

    // Default successful response
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
  })
})

// Cookie cleanup after each test
afterEach(() => {
  // 쿠키 초기화 (JSDOM 환경에서)
  if (typeof document !== 'undefined') {
    // 모든 쿠키 삭제
    document.cookie.split(';').forEach(c => {
      const eqPos = c.indexOf('=')
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie =
        name.trim() +
        '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost'
      document.cookie =
        name.trim() + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    })
    // 강제로 모든 쿠키 삭제
    document.cookie =
      'access_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    document.cookie =
      'refresh_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
  }

  // Reset mocks
  jest.clearAllMocks()
})
