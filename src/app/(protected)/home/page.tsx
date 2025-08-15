'use client'

import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { user, logout, isLoggingOut } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen py-8">
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
        {/* Current Exchange */}
        <section>
          <h2 className="text-xl font-semibold mb-4">현재 교환</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-24 bg-gradient-to-br from-primary-200 to-secondary-200 rounded"></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">혼자 있는 시간의 힘</h3>
                <p className="text-sm text-gray-600">정희선</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                    D-15
                  </span>
                  <span className="text-sm text-gray-500">반납까지</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary-400 text-white rounded-lg text-sm font-medium">
                채팅
              </button>
            </div>
          </div>
        </section>

        {/* Recommended Users */}
        <section>
          <h2 className="text-xl font-semibold mb-4">추천 이웃</h2>
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">김리딩</h4>
                  <p className="text-sm text-gray-500">취향 유사도 85% · 우리동네</p>
                </div>
                <button className="text-primary-600 text-sm font-medium">
                  팔로우
                </button>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-300 to-primary-300 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">박북스</h4>
                  <p className="text-sm text-gray-500">취향 유사도 78% · 우리동네</p>
                </div>
                <button className="text-primary-600 text-sm font-medium">
                  팔로우
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendations */}
        <section>
          <h2 className="text-xl font-semibold mb-4">오늘의 추천 도서</h2>
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="w-16 h-24 bg-gradient-to-br from-primary-300 to-secondary-300 rounded"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">사피엔스</h3>
                  <p className="text-sm text-gray-600">유발 하라리</p>
                  <p className="text-xs text-gray-500 mt-1">AI 추천 이유: 최근 읽은 책과 유사한 주제</p>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded">
                      역사
                    </span>
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                      인문
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
  );
}