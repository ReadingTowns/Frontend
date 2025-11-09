/**
 * useHeaderConfig Hook
 * 페이지별 헤더 설정을 쉽게 관리하기 위한 커스텀 훅
 */

import { useEffect } from 'react'
import { useHeader } from '@/contexts/HeaderContext'
import { HeaderConfig, ChatHeaderConfig } from '@/types/header'

/**
 * 헤더 설정을 관리하는 훅
 * @param config - 헤더 설정 객체
 * @param deps - useEffect 의존성 배열 (옵션)
 *
 * @example
 * // 기본 사용법
 * useHeaderConfig({
 *   variant: 'navigation',
 *   title: '나의 서재',
 *   subtitle: '내 책들을 관리해보세요'
 * })
 *
 * @example
 * // 동적 제목 사용
 * useHeaderConfig({
 *   variant: 'navigation',
 *   title: userData?.nickname,
 * }, [userData])
 */
export function useHeaderConfig(
  config: HeaderConfig | null,
  deps: React.DependencyList = []
) {
  const { setHeaderConfig } = useHeader()

  useEffect(() => {
    if (config) {
      setHeaderConfig(config)
    }

    // 컴포넌트 언마운트 시 헤더 설정 초기화
    return () => {
      setHeaderConfig(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
