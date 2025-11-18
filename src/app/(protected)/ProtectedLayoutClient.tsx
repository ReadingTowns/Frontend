'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import CommonHeader from '@/components/layout/CommonHeader'
import { FloatingButton } from '@/components/layout/FloatingButton'
import { RobotIcon } from '@/components/icons/RobotIcon'
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

  // 플로팅 버튼 설정 - 페이지별 조건부 렌더링
  const floatingButtons = useMemo(() => {
    const buttons: Array<{
      id: string
      variant: 'primary' | 'secondary' | 'neutral'
      icon?: React.ComponentType<{ className?: string }>
      text?: string
      href?: string
      ariaLabel: string
    }> = []

    // 라이브러리 페이지 - 책 추가 버튼
    if (pathname === '/library') {
      buttons.push({
        id: 'library-add',
        variant: 'secondary',
        text: '+',
        href: '/library/add',
        ariaLabel: '책 추가',
      })
    }

    // 소셜 페이지 - 챗봇 버튼
    if (
      (pathname === '/social' || pathname.startsWith('/social/')) &&
      pathname !== '/chatbot'
    ) {
      buttons.push({
        id: 'chatbot',
        variant: 'primary',
        icon: RobotIcon,
        text: 'AI 챗봇',
        href: '/chatbot',
        ariaLabel: 'AI 챗봇 열기',
      })
    }

    return buttons
  }, [pathname])

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

      {/* 플로팅 버튼 컨테이너 - max-width 제약 적용 */}
      {floatingButtons.length > 0 && (
        <div className="fixed bottom-0 right-0 left-0 z-50 pointer-events-none">
          <div className="max-w-[430px] mx-auto relative h-0 pointer-events-none">
            <div className="absolute bottom-28 right-4 flex flex-col-reverse space-y-3 space-y-reverse pointer-events-auto">
              {floatingButtons.map(button => (
                <FloatingButton key={button.id} {...button} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
