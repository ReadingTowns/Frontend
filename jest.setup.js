import '@testing-library/jest-dom'

// 환경변수 설정
process.env.NODE_ENV = 'test'

// whatwg-fetch polyfill for fetch API
import 'whatwg-fetch'

// TextEncoder/TextDecoder polyfill for MSW
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

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

// Mock window.location globally (Jest 공식 문서 방식)
delete global.window.location
global.window.location = {
  assign: jest.fn(),
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
}