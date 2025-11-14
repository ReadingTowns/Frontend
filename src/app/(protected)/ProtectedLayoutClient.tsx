'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import CommonHeader from '@/components/layout/CommonHeader'
import { ChatbotFloatingButton } from '@/components/chatbot/ChatbotFloatingButton'
import { useHeader } from '@/contexts/HeaderContext'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { headerContent, headerConfig } = useHeader()
  const {
    isAuthenticated,
    isOnboardingCompleted,
    isLoading,
    isOnboardingLoading,
  } = useAuth()

  // 온보딩 완료 체크 및 리다이렉트
  useEffect(() => {
    // 로딩 중이거나 온보딩 페이지면 체크 안함
    if (
      isLoading ||
      isOnboardingLoading ||
      pathname.startsWith('/onboarding')
    ) {
      return
    }

    // 인증은 되었지만 온보딩 미완료 시 → 온보딩으로
    if (isAuthenticated && !isOnboardingCompleted) {
      router.push('/onboarding')
    }
  }, [
    isAuthenticated,
    isOnboardingCompleted,
    isLoading,
    isOnboardingLoading,
    pathname,
    router,
  ])

  // 온보딩 및 키워드 편집 페이지에서는 바텀 네비게이션 숨김
  const hideBottomNavigation =
    pathname === '/onboarding' ||
    pathname.startsWith('/onboarding/') ||
    pathname.startsWith('/recommendations/keywords/edit')

  // 챗봇 페이지에서는 플로팅 버튼 숨김 (중복 방지)
  const hideChatbotButton = pathname === '/chatbot'

  return (
    <div className="h-screen-safe flex flex-col overflow-hidden">
      {/* 새로운 CommonHeader 사용 (headerConfig 기반) */}
      {headerConfig && <CommonHeader />}
      {/* 레거시 지원: headerContent가 있고 headerConfig가 없는 경우 */}
      {!headerConfig && headerContent}
      <main className="flex flex-col flex-1 max-w-[430px] mx-auto w-full overflow-y-auto">
        {children}
      </main>
      {!hideBottomNavigation && <BottomNavigation />}
      {!hideChatbotButton && <ChatbotFloatingButton />}
    </div>
  )
}
