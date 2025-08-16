'use client'

import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import {
  CurrentExchange,
  UserRecommendations,
  BookRecommendations,
} from '@/components/dashboard'

export default function HomePage() {
  const { user, logout, isLoggingOut } = useAuth()
  const dashboard = useDashboard()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-screen py-8 px-4">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-200 to-secondary-800 bg-clip-text text-transparent">
            리딩 타운
          </h1>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
        <p className="text-center text-gray-500 mt-2">
          책으로 연결되는 우리 동네
        </p>
        {user && (
          <p className="text-center text-sm text-gray-400 mt-1">
            안녕하세요, {user.name}님!
          </p>
        )}
      </header>

      {/* Main Content */}
      <div className="space-y-8">
        <CurrentExchange
          exchange={dashboard.currentExchange.data}
          isLoading={dashboard.currentExchange.isLoading}
        />

        <UserRecommendations
          users={dashboard.recommendedUsers.data}
          isLoading={dashboard.recommendedUsers.isLoading}
        />

        <BookRecommendations
          books={dashboard.recommendedBooks.data}
          isLoading={dashboard.recommendedBooks.isLoading}
        />

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
    </div>
  )
}
