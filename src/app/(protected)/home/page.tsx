'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import HomeTabs from '@/components/home/HomeTabs'
import ExchangedBooksSection from '@/components/home/ExchangedBooksSection'
import MyLibrarySection from '@/components/home/MyLibrarySection'
import RecommendedBooksSection from '@/components/home/RecommendedBooksSection'
import KeywordSelector from '@/components/recommendations/KeywordSelector'
import BookRecommendations from '@/components/recommendations/BookRecommendations'
import UserRecommendations from '@/components/recommendations/UserRecommendations'
import SearchRecommendations from '@/components/recommendations/SearchRecommendations'
import { HomeTab } from '@/types/home'
import { useAuth } from '@/hooks/useAuth'
import { useExchangedBooks } from '@/hooks/useExchangedBooks'
import { useHeaderConfig } from '@/hooks/useHeaderConfig'

/**
 * 홈 화면 페이지
 * - 상단 탭바로 "나의 리딩타운" / "추천 도서" 탭 전환
 * - 각 탭별 콘텐츠 영역 표시
 * - 사용자 닉네임과 동네 정보를 동적으로 표시
 * - URL query parameter로 탭 상태 관리 (?tab=myTown or ?tab=recommendations)
 */
export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}

function HomePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  // URL query parameter에서 탭 상태 읽기 (기본값: 'myTown')
  const activeTab = (searchParams.get('tab') as HomeTab) || 'myTown'

  // 닉네임: API에서 가져온 닉네임 사용, 없으면 '사용자' 기본값
  const nickname = user?.nickname || '사용자'

  // 헤더 설정
  useHeaderConfig(
    {
      variant: 'basic',
      title: '리딩타운',
    },
    []
  )

  // 탭 변경 시 URL query parameter 업데이트
  const handleTabChange = (tab: HomeTab) => {
    router.push(`/home?tab=${tab}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 탭바 */}
      <HomeTabs
        nickname={nickname}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* 탭별 콘텐츠 영역 */}
      <main className="max-w-[430px] mx-auto">
        {activeTab === 'myTown' ? (
          <MyTownTab
            nickname={nickname}
            onSwitchToRecommendations={() => handleTabChange('recommendations')}
          />
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
function MyTownTab({
  nickname,
  onSwitchToRecommendations,
}: {
  nickname: string
  onSwitchToRecommendations: () => void
}) {
  const { data: exchangedBooks, isLoading: isLoadingExchanges } =
    useExchangedBooks()

  return (
    <div className="px-4 py-6 space-y-8">
      {/* 1. 인기 도서 Top 10 섹션 */}
      {/* <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold">인기 도서 Top 10</h2>
        </div>
        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
          <p className="text-gray-500">인기 도서 섹션 (구현 예정)</p>
        </div>
      </section> */}

      {/* 2. 이웃과 교환한 도서 섹션 */}
      <section>
        <h2 className="text-xl font-bold mb-4">교환중인 도서</h2>
        <ExchangedBooksSection
          exchanges={exchangedBooks || []}
          isLoading={isLoadingExchanges}
        />
      </section>

      {/* 3. 추천 도서 섹션 */}
      <section>
        <RecommendedBooksSection
          title={`${nickname}님에게 추천하는 도서`}
          limit={3}
          showMoreButton
          onMoreClick={onSwitchToRecommendations}
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
    <div className="bg-gray-50">
      {/* 맞춤 추천받기 */}
      <KeywordSelector />

      {/* 구분선 */}
      <div className="h-2 bg-gray-50" />

      {/* 책 추천 */}
      <BookRecommendations />

      {/* 구분선 */}
      <div className="h-2 bg-gray-50" />

      {/* 사용자 추천 */}
      <UserRecommendations />

      {/* 구분선 */}
      <div className="h-2 bg-gray-50" />

      {/* 내 취향으로 책 검색 */}
      <SearchRecommendations />
    </div>
  )
}

HomePage.displayName = 'HomePage'
