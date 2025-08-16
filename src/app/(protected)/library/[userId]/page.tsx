'use client'

import { useParams } from 'next/navigation'
import { useUserLibraryBooks, useUserProfile } from '@/hooks/useLibrary'
import { LibraryBookCard, LibraryStats } from '@/components/library'
import { useAuth } from '@/hooks/useAuth'
import {
  BookCardSkeleton,
  ProfileSkeleton,
  HeaderSkeleton,
} from '@/components/ui/Skeleton'

export default function UserLibraryPage() {
  const params = useParams()
  const userId = params.userId as string
  const { user: currentUser } = useAuth()

  const { data: profile, isLoading: profileLoading } = useUserProfile(userId)
  const { data: libraryData, isLoading: booksLoading } =
    useUserLibraryBooks(userId)

  const books = libraryData?.content || []
  const isOwnLibrary = currentUser?.memberId?.toString() === userId

  if (profileLoading || booksLoading) {
    return (
      <div className="max-w-[430px] mx-auto bg-gray-50 min-h-screen py-4 px-4">
        <HeaderSkeleton />
        <ProfileSkeleton />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-[430px] mx-auto bg-white min-h-screen py-4 px-4">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            사용자를 찾을 수 없습니다
          </h3>
          <p className="text-gray-600">
            존재하지 않거나 접근할 수 없는 사용자입니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[430px] mx-auto bg-gray-50 min-h-screen py-4 px-4">
      {/* Header */}
      <header className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-800 mb-4"
        >
          ← 뒤로
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {profile.nickname}님의 서재
        </h1>
        <p className="text-sm text-gray-600">
          {isOwnLibrary
            ? '나만의 책 컬렉션을 관리해보세요'
            : '이웃의 책 컬렉션을 둘러보세요'}
        </p>
      </header>

      {/* User Profile */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 bg-cover bg-center bg-gray-200 rounded-full"
            style={{
              backgroundImage: profile.profileImage
                ? `url(${profile.profileImage})`
                : 'none',
            }}
          >
            {!profile.profileImage && (
              <div className="w-full h-full bg-gradient-to-br from-primary-300 to-secondary-300 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">👤</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {profile.nickname}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              📍 {profile.currentTown || '위치 정보 없음'}
            </p>
            {profile.userRating && (
              <div className="flex items-center text-xs text-gray-500">
                <span>⭐ {profile.userRating.toFixed(1)}</span>
                <span className="mx-1">•</span>
                <span>리뷰 {profile.userRatingCount}개</span>
              </div>
            )}
          </div>
          {!isOwnLibrary && (
            <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors">
              {profile.following ? '팔로잉' : '팔로우'}
            </button>
          )}
        </div>

        {profile.availableTime && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              <span className="font-medium">교환 가능 시간:</span>{' '}
              {profile.availableTime}
            </p>
          </div>
        )}
      </div>

      {/* Library Stats */}
      <LibraryStats
        totalBooks={books.length}
        completionRate={Math.random() * 60 + 20} // 임시 완독률
        isLoading={false}
      />

      {/* Books Section */}
      <section>
        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isOwnLibrary ? '서재가 비어있어요' : '등록된 책이 없어요'}
            </h3>
            <p className="text-gray-600">
              {isOwnLibrary
                ? '첫 번째 책을 등록하고 나만의 서재를 만들어보세요!'
                : '아직 등록된 책이 없습니다.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {isOwnLibrary ? '내 책' : '등록한 책'} ({books.length}권)
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {books.map(book => (
                <LibraryBookCard
                  key={book.id}
                  book={book}
                  showActions={false}
                  isOwner={isOwnLibrary}
                />
              ))}
            </div>

            {/* Load More Button */}
            {libraryData && !libraryData.last && (
              <div className="text-center mt-8">
                <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  더 보기
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
