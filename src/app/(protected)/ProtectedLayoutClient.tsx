'use client'

import { usePathname } from 'next/navigation'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import { useHeader } from '@/contexts/HeaderContext'

export default function ProtectedLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { headerContent } = useHeader()

  // 쿠키 체크 로직 제거
  // - HttpOnly 쿠키는 document.cookie로 읽을 수 없음
  // - Middleware에서 서버사이드로 access_token 체크 수행
  // - 토큰 재발급은 useAuth Hook에서 처리

  // 온보딩 페이지에서는 바텀 네비게이션 숨김
  const hideBottomNavigation = pathname === '/onboarding'

  return (
    <div className="min-h-screen-safe flex flex-col">
      {headerContent}
      <main className="flex flex-col flex-1 max-w-[430px] mx-auto overflow-y-auto w-full">
        {children}
      </main>
      {!hideBottomNavigation && <BottomNavigation />}
    </div>
  )
}
