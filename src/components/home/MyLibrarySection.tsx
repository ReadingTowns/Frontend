'use client'

import { useMyLibraryBooks } from '@/hooks/useLibrary'
import { LibraryBookCard } from '@/components/library/LibraryBookCard'
import Link from 'next/link'
import { BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

/**
 * 나의 서재 섹션 컴포넌트
 * - 최근 도서 6권 표시 (3열 그리드)
 * - LibraryBookCard 재사용으로 서재 탭과 동일한 UI
 * - 클릭 시 책 상세 페이지로 이동
 * - "전체 보기" 버튼으로 서재 페이지 이동
 */
export default function MyLibrarySection() {
  const { data, isLoading } = useMyLibraryBooks({ page: 0, size: 6 })
  const books = data?.content || []

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* 로딩 스켈레톤 */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-1" />
              <div className="h-2 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <BookOpenIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600 text-sm mb-4">
          아직 등록된 도서가 없습니다
        </p>
        <Link href="/library/add">
          <button className="bg-primary-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors">
            첫 책 등록하기
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 3열 그리드 - 서재 탭과 동일한 레이아웃 */}
      <div className="grid grid-cols-3 gap-3">
        {books.map(book => (
          <LibraryBookCard
            key={book.bookId}
            book={book}
            showActions={false} // 홈에서는 액션 버튼 숨김
            isOwner={true}
            compact={true} // 3열 모드
          />
        ))}
      </div>

      {/* 전체 보기 버튼 */}
      {books.length > 0 && (
        <Link href="/library">
          <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <span>서재 전체 보기</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </Link>
      )}
    </div>
  )
}

MyLibrarySection.displayName = 'MyLibrarySection'
