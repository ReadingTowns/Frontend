'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavigationItem {
  href: string
  label: string
  icon: string
  activeIcon: string
}

const navigationItems: NavigationItem[] = [
  {
    href: '/home',
    label: '홈',
    icon: '🏠',
    activeIcon: '🏠',
  },
  {
    href: '/library',
    label: '서재',
    icon: '📖',
    activeIcon: '📖',
  },
  {
    href: '/users',
    label: '이웃',
    icon: '👥',
    activeIcon: '👥',
  },
  {
    href: '/chat',
    label: '채팅',
    icon: '💬',
    activeIcon: '💬',
  },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-[430px] mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navigationItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg mb-1">
                  {isActive ? item.activeIcon : item.icon}
                </span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
