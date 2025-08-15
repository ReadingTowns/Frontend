import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// 브라우저 환경에서 MSW 설정
export const worker = setupWorker(...handlers)

// 개발 환경에서만 MSW 활성화
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'warn',
  })
}