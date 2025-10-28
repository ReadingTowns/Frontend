'use client'

import { BookCardProps } from '@/types/bookCard'
import { BookCardGrid } from './BookCardGrid'
import { BookCardDetail } from './BookCardDetail'

/**
 * BookCard 통합 컴포넌트
 *
 * ## 사용법
 *
 * ### Grid Variant (서재, 추천, 검색, 교환 도서)
 * ```tsx
 * // 서재 (3열, 액션 메뉴, 카테고리)
 * <BookCard
 *   variant="grid"
 *   book={book}
 *   columns={3}
 *   compact={true}
 *   showActions={true}
 *   showCategories={true}
 *   onActionClick={(action, book) => {
 *     if (action === 'delete') handleDelete(book.bookId)
 *   }}
 * />
 *
 * // 추천 탭 (유사도, 키워드)
 * <BookCard
 *   variant="grid"
 *   book={book}
 *   showSimilarity={true}
 *   showKeywords={true}
 * />
 *
 * // 검색 결과 (2열)
 * <BookCard
 *   variant="grid"
 *   book={book}
 *   columns={2}
 *   aspectRatio="3/4"
 *   onClick={(book) => handleSelect(book)}
 * />
 * ```
 *
 * ### Detail Variant (상세 페이지, 등록 확인)
 * ```tsx
 * // 상세 페이지
 * <BookCard
 *   variant="detail"
 *   book={book}
 *   size="large"
 *   showFullInfo={true}
 * />
 *
 * // 등록 확인 모달
 * <BookCard
 *   variant="detail"
 *   book={book}
 *   size="medium"
 *   showFullInfo={false}
 * />
 * ```
 *
 * ## TypeScript 타입 안전성
 *
 * Discriminated Union 타입으로 variant에 따라 사용 가능한 props가 자동으로 제한됩니다:
 *
 * ```tsx
 * // ✅ 올바른 사용
 * <BookCard variant="grid" columns={3} />
 * <BookCard variant="detail" size="large" />
 *
 * // ❌ 타입 에러 발생
 * <BookCard variant="detail" columns={3} />  // Error: 'columns' does not exist
 * <BookCard variant="grid" size="large" />   // Error: 'size' does not exist
 * ```
 */
export function BookCard(props: BookCardProps) {
  if (props.variant === 'grid') {
    return <BookCardGrid {...props} />
  }

  return <BookCardDetail {...props} />
}

BookCard.displayName = 'BookCard'
