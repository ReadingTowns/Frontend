'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import CommonHeader from '@/components/layout/CommonHeader'
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
    console.log('🔍 [ProtectedLayoutClient] useEffect 실행:', {
      pathname,
      isLoading,
      isOnboardingLoading,
      isAuthenticated,
      isOnboardingCompleted,
    })

    // 로딩 중이거나 온보딩 페이지면 체크 안함
    if (
      isLoading ||
      isOnboardingLoading ||
      pathname.startsWith('/onboarding')
    ) {
      console.log(
        '🔍 [ProtectedLayoutClient] 체크 스킵 (로딩 중 또는 온보딩 페이지)'
      )
      return
    }

    // 인증은 되었지만 온보딩 미완료 시 → 온보딩으로
    if (isAuthenticated && !isOnboardingCompleted) {
      console.log(
        '🔍 [ProtectedLayoutClient] 온보딩 미완료 - /onboarding으로 리다이렉트'
      )
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
    </div>
  )
}
