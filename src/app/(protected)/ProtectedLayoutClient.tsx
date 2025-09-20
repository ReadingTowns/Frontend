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

  // 온보딩 페이지에서는 바텀 네비게이션 숨김
  const hideBottomNavigation = pathname === '/onboarding'

  return (
    <div className="min-h-screen-safe flex flex-col">
      {headerContent}
      <main className="flex flex-col flex-1 max-w-[430px] mx-auto py-4 px-4 overflow-y-auto">
        {children}
      </main>
      {!hideBottomNavigation && <BottomNavigation />}
    </div>
  )
}
