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

// Note: window.location mocking handled per test as needed

// MSW 서버 설정
import { server } from './src/mocks/server'

// 테스트 실행 전에 MSW 서버 시작
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn'
  })
})

// 각 테스트 후에 핸들러 리셋 및 상태 정리
afterEach(() => {
  server.resetHandlers()
  
  // 쿠키 초기화 (JSDOM 환경에서)
  if (typeof document !== 'undefined') {
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })
  }
  
  // Additional cleanup if needed
})

// 모든 테스트 완료 후 서버 종료
afterAll(() => {
  server.close()
})