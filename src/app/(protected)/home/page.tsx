'use client'

import { useState } from 'react'
import HomeTabs from '@/components/home/HomeTabs'
import ExchangedBooksSection from '@/components/home/ExchangedBooksSection'
import MyLibrarySection from '@/components/home/MyLibrarySection'
import { HomeTab } from '@/types/home'
import { useAuth } from '@/hooks/useAuth'
import { useExchangedBooks } from '@/hooks/useExchangedBooks'

/**
 * 홈 화면 페이지
 * - 상단 탭바로 "나의 리딩타운" / "추천 도서" 탭 전환
 * - 각 탭별 콘텐츠 영역 표시
 * - 사용자 닉네임과 동네 정보를 동적으로 표시
 */
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<HomeTab>('myTown')
  const { user } = useAuth()

  // 닉네임: API에서 가져온 닉네임 사용, 없으면 '사용자' 기본값
  const nickname = user?.nickname || '사용자'

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 탭바 */}
      <HomeTabs
        nickname={nickname}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 탭별 콘텐츠 영역 */}
      <main className="max-w-[430px] mx-auto">
        {activeTab === 'myTown' ? (
          <MyTownTab nickname={nickname} />
        ) : (
          <RecommendationsTab nickname={nickname} />
        )}
      </main>
    </div>
  )
}

/**
 * "---님의 리딩타운" 탭 콘텐츠
 */
function MyTownTab({ nickname }: { nickname: string }) {
  const { data: exchangedBooks, isLoading: isLoadingExchanges } =
    useExchangedBooks()

  return (
    <div className="px-4 py-6 space-y-8">
      {/* 1. 인기 도서 Top 10 섹션 */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold">인기 도서 Top 10</h2>
        </div>
        {/* TODO: PopularBooksSection 컴포넌트 추가 */}
        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
          <p className="text-gray-500">인기 도서 섹션 (구현 예정)</p>
        </div>
      </section>

      {/* 2. 추천 도서 섹션 */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold">{nickname}님에게 추천하는 도서</h2>
        </div>
        {/* TODO: RecommendedBooksPreview 컴포넌트 추가 */}
        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
          <p className="text-gray-500">추천 도서 섹션 (구현 예정)</p>
        </div>
      </section>

      {/* 3. 이웃과 교환한 도서 섹션 */}
      <section>
        <h2 className="text-xl font-bold mb-4">이웃과 교환한 도서</h2>
        <ExchangedBooksSection
          books={exchangedBooks || []}
          isLoading={isLoadingExchanges}
        />
      </section>

      {/* 4. 나의 서재 섹션 */}
      <section>
        <h2 className="text-xl font-bold mb-4">나의 서재</h2>
        <MyLibrarySection />
      </section>
    </div>
  )
}

/**
 * "---님에게 추천하는 도서" 탭 콘텐츠
 */
function RecommendationsTab({ nickname }: { nickname: string }) {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold mb-4">{nickname}님에게 추천하는 도서</h2>
      {/* TODO: 추천 도서 전체 목록 컴포넌트 추가 */}
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <p className="text-gray-500">추천 도서 전체 목록 (구현 예정)</p>
      </div>
    </div>
  )
}

HomePage.displayName = 'HomePage'
