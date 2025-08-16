'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useHeader } from '@/contexts/HeaderContext'
import MainHeader from '@/components/layout/MainHeader'
import CurrentExchange from '@/components/dashboard/CurrentExchange'
import UserRecommendations from '@/components/dashboard/UserRecommendations'
import BookRecommendations from '@/components/dashboard/BookRecommendations'
import type {
  ExchangeData,
  RecommendedUser,
  RecommendedBook,
} from '@/types/dashboard'

interface HomePageClientProps {
  initialData: {
    currentExchange: ExchangeData | null
    recommendedUsers: RecommendedUser[]
    recommendedBooks: RecommendedBook[]
  }
}

export default function HomePageClient({ initialData }: HomePageClientProps) {
  const { setHeaderContent } = useHeader()
  const queryClient = useQueryClient()
  const [data, setData] = useState(initialData)

  useEffect(() => {
    setHeaderContent(<MainHeader />)

    // SSR 데이터를 TanStack Query 캐시에 미리 로드
    queryClient.setQueryData(
      ['dashboard', 'current-exchange'],
      initialData.currentExchange
    )
    queryClient.setQueryData(
      ['dashboard', 'recommended-users'],
      initialData.recommendedUsers
    )
    queryClient.setQueryData(
      ['dashboard', 'recommended-books'],
      initialData.recommendedBooks
    )

    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent, queryClient, initialData])

  return (
    <>
      {/* Main Content */}
      <div className="space-y-8">
        <CurrentExchange exchange={data.currentExchange} isLoading={false} />

        <UserRecommendations users={data.recommendedUsers} isLoading={false} />

        <BookRecommendations books={data.recommendedBooks} isLoading={false} />

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">빠른 실행</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-primary-400 text-white rounded-lg text-center hover:bg-primary-500 transition-colors">
              <div className="text-2xl mb-1">📚</div>
              <div className="text-sm font-medium">내 서재</div>
            </button>
            <button className="p-4 bg-secondary-200 text-gray-800 rounded-lg text-center hover:bg-secondary-300 transition-colors">
              <div className="text-2xl mb-1">🔍</div>
              <div className="text-sm font-medium">책 검색</div>
            </button>
            <button className="p-4 bg-gray-100 text-gray-800 rounded-lg text-center hover:bg-gray-200 transition-colors">
              <div className="text-2xl mb-1">💬</div>
              <div className="text-sm font-medium">채팅</div>
            </button>
            <button className="p-4 bg-gray-100 text-gray-800 rounded-lg text-center hover:bg-gray-200 transition-colors">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-sm font-medium">이웃 찾기</div>
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
