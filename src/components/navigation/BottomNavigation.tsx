'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
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
  queryKeys?: string[][] // 해당 페이지에서 무효화할 쿼리 키들
}

const navigationItems: NavigationItem[] = [
  {
    href: '/home',
    label: '홈',
    Icon: HomeIcon,
    ActiveIcon: HomeIconSolid,
    queryKeys: [
      ['recommend', 'books'], // 책 추천
      ['recommend', 'users'], // 사용자 추천
      ['exchanged-books'], // 교환한 도서
      ['bookRecommendations'], // 추천 도서
    ],
  },
  {
    href: '/library',
    label: '서재',
    Icon: BookOpenIcon,
    ActiveIcon: BookOpenIconSolid,
    queryKeys: [
      ['library', 'my-books-infinite'], // 무한 스크롤 서재
      ['library', 'my-books'], // 서재 목록
    ],
  },
  {
    href: '/social',
    label: '소셜',
    Icon: ChatBubbleLeftIcon,
    ActiveIcon: ChatBubbleLeftIconSolid,
    queryKeys: [
      ['users'], // 유저 검색
      ['followers'], // 팔로워 목록
      ['following'], // 팔로잉 목록
    ],
  },
  {
    href: '/mypage',
    label: '마이페이지',
    Icon: UserIcon,
    ActiveIcon: UserIconSolid,
    queryKeys: [
      ['auth', 'me'], // 사용자 정보
      ['user', 'profile'], // 프로필 정보
    ],
  },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavigationItem
  ) => {
    e.preventDefault()

    // 현재 페이지와 같은 경로면 쿼리 무효화만 수행
    const isSamePage =
      pathname === item.href || pathname.startsWith(item.href + '/')

    if (isSamePage && item.queryKeys) {
      // 같은 페이지 클릭 시 새로고침 효과
      item.queryKeys.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey })
      })
    } else {
      // 다른 페이지로 이동 시 해당 페이지 쿼리 무효화
      if (item.queryKeys) {
        item.queryKeys.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
      router.push(item.href)
    }
  }

  return (
    <nav className="sticky bottom-0 bg-white border-t border-gray-200 flex-shrink-0 z-10">
      <div className="max-w-[430px] mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navigationItems.map(item => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={e => handleNavigate(e, item)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors cursor-pointer ${
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
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
