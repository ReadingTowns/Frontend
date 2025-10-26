'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import { useHeader } from '@/contexts/HeaderContext'
import { useKeywordStatus } from '@/hooks/useKeywordStatus'
import { useKeywordOnboarding } from '@/hooks/useKeywordOnboarding'
import KeywordOnboardingModal from '@/components/keyword/KeywordOnboardingModal'

export default function ProtectedLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { headerContent } = useHeader()
  const { hasKeywords, isLoading: isLoadingKeywords } = useKeywordStatus()
  const { shouldShow, dismissLater } = useKeywordOnboarding()
  const [showModal, setShowModal] = useState(false)

  // 쿠키 체크 로직 제거
  // - HttpOnly 쿠키는 document.cookie로 읽을 수 없음
  // - Middleware에서 서버사이드로 access_token 체크 수행
  // - 토큰 재발급은 useAuth Hook에서 처리

  // 온보딩 페이지에서는 바텀 네비게이션 숨김
  const hideBottomNavigation =
    pathname === '/onboarding' || pathname.startsWith('/onboarding/')

  // 키워드 온보딩 모달 표시 로직
  useEffect(() => {
    // 키워드 선택 페이지에서는 모달 표시 안 함
    if (pathname === '/onboarding/keywords') {
      return
    }

    // 키워드 상태 로딩 완료 후 체크
    if (!isLoadingKeywords && !hasKeywords && shouldShow) {
      // 2초 딜레이 후 모달 표시 (초기 로딩 완료 대기)
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isLoadingKeywords, hasKeywords, shouldShow, pathname])

  const handleAccept = () => {
    setShowModal(false)
    router.push('/onboarding/keywords')
  }

  const handleDismiss = () => {
    dismissLater()
    setShowModal(false)
  }

  return (
    <div className="h-screen-safe flex flex-col overflow-hidden">
      {headerContent}
      <main className="flex flex-col flex-1 max-w-[430px] mx-auto w-full overflow-y-auto">
        {children}
      </main>
      {!hideBottomNavigation && <BottomNavigation />}

      {/* 키워드 온보딩 모달 */}
      {showModal && (
        <KeywordOnboardingModal
          onAccept={handleAccept}
          onDismiss={handleDismiss}
          onClose={handleDismiss}
        />
      )}
    </div>
  )
}
