'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  BookOpenIcon,
  ChatBubbleLeftIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid'

interface NavigationItem {
  href: string
  label: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  ActiveIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const navigationItems: NavigationItem[] = [
  {
    href: '/home',
    label: '홈',
    Icon: HomeIcon,
    ActiveIcon: HomeIconSolid,
  },
  {
    href: '/library',
    label: '서재',
    Icon: BookOpenIcon,
    ActiveIcon: BookOpenIconSolid,
  },
  {
    href: '/chat',
    label: '채팅',
    Icon: ChatBubbleLeftIcon,
    ActiveIcon: ChatBubbleLeftIconSolid,
  },
  {
    href: '/mypage',
    label: '마이페이지',
    Icon: UserIcon,
    ActiveIcon: UserIconSolid,
  },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky bottom-0 bg-white border-t border-gray-200 flex-shrink-0 z-10">
      <div className="max-w-[430px] mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navigationItems.map(item => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')
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
                {isActive ? (
                  <item.ActiveIcon className="w-6 h-6 mb-1" />
                ) : (
                  <item.Icon className="w-6 h-6 mb-1" />
                )}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
