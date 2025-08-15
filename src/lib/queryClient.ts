import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 데이터가 5분 동안 신선하다고 간주
        staleTime: 1000 * 60 * 5,
        // 백그라운드에서 자동 리페치 비활성화 (모바일 환경 고려)
        refetchOnWindowFocus: false,
        // 컴포넌트가 다시 마운트될 때 리페치 비활성화
        refetchOnMount: false,
        // 네트워크가 다시 연결될 때만 리페치
        refetchOnReconnect: true,
        // 재시도 횟수 설정
        retry: (failureCount, error: unknown) => {
          // 4xx 에러는 재시도하지 않음
          if (error && typeof error === 'object' && 'status' in error && 
              typeof error.status === 'number' && 
              error.status >= 400 && error.status < 500) {
            return false
          }
          // 최대 3번까지 재시도
          return failureCount < 3
        },
      },
      mutations: {
        // 뮤테이션 재시도 비활성화
        retry: false,
      },
    },
  })
}

// 전역 QueryClient 인스턴스
let clientSingleton: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버 환경에서는 항상 새 클라이언트 생성
    return createQueryClient()
  } else {
    // 브라우저 환경에서는 싱글톤 패턴 사용
    if (!clientSingleton) {
      clientSingleton = createQueryClient()
    }
    return clientSingleton
  }
}