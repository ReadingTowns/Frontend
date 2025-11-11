'use client'

/**
 * LibraryBooksGrid Component
 * 서재 책 목록을 보여주는 공통 컴포넌트
 * - 내 서재 / 다른 사람 서재 모두 지원
 * - 무한 스크롤
 * - 선택 모드 / 일반 모드
 * - 2열 / 3열 그리드
 */

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLibraryBooksInfinite } from '@/hooks/useLibrary'
import { LibraryBookCard } from './LibraryBookCard'
import { SelectableBookCard } from '../chat/SelectableBookCard'

interface LibraryBooksGridProps {
  userId?: string // undefined면 내 서재
  isOwner?: boolean // 액션 버튼 표시 여부
  selectionMode?: boolean // 선택 모드 (라디오 버튼)
  selectedBookhouseId?: number // 선택된 책 ID (selectionMode일 때)
  onSelect?: (bookhouseId: number) => void
  compact?: boolean // 3열 모드
  pageSize?: number // 기본 12
  onDelete?: (bookId: string) => void
  onReviewClick?: (bookId: string, bookTitle: string) => void
  onExchangeRequest?: (
    bookId: number,
    bookhouseId: number,
    bookTitle: string
  ) => void
}

export function LibraryBooksGrid({
  userId,
  isOwner = false,
  selectionMode = false,
  selectedBookhouseId,
  onSelect,
  compact = false,
  pageSize = 12,
  onDelete,
  onReviewClick,
  onExchangeRequest,
}: LibraryBooksGridProps) {
  const router = useRouter()
  const observerTarget = useRef<HTMLDivElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useLibraryBooksInfinite(userId, pageSize)

  // Infinite scroll observer
  useEffect(() => {
    if (!observerTarget.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const books = data?.pages.flatMap(page => page.content) || []

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">책 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">
            책 목록을 불러오는데 실패했습니다
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  // Empty state
  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-4">등록된 책이 없습니다</p>
          {isOwner && (
            <button
              onClick={() => router.push('/library/register')}
              className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
            >
              첫 번째 책 등록하기
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`grid ${compact ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
        {books.map(book =>
          selectionMode ? (
            <SelectableBookCard
              key={book.bookhouseId}
              book={book}
              isSelected={selectedBookhouseId === book.bookhouseId}
              onSelect={onSelect || (() => {})}
            />
          ) : (
            <LibraryBookCard
              key={book.bookhouseId}
              book={book}
              showActions={isOwner}
              isOwner={isOwner}
              compact={compact}
              onDelete={onDelete}
              onReviewClick={onReviewClick}
              onExchangeRequest={onExchangeRequest}
              ownerId={userId ? parseInt(userId) : undefined}
            />
          )
        )}
      </div>

      {/* Infinite Scroll Observer */}
      {hasNextPage && (
        <div
          ref={observerTarget}
          className="flex items-center justify-center py-4"
        >
          {isFetchingNextPage && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          )}
        </div>
      )}
    </>
  )
}

LibraryBooksGrid.displayName = 'LibraryBooksGrid'
