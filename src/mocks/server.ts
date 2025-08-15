import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Node.js 환경(테스트)에서 MSW 설정
export const server = setupServer(...handlers)
