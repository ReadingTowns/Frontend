'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import { useHeader } from '@/contexts/HeaderContext'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { headerContent } = useHeader()
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

  return (
    <div className="h-screen-safe flex flex-col overflow-hidden">
      {headerContent}
      <main className="flex flex-col flex-1 max-w-[430px] mx-auto w-full overflow-y-auto">
        {children}
      </main>
      {!hideBottomNavigation && <BottomNavigation />}
    </div>
  )
}
