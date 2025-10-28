'use client'

import { CategoryTags } from '@/components/library/CategoryTags'

interface BookMetadataProps {
  title: string
  author?: string
  compact?: boolean
  showSimilarity?: boolean
  similarity?: number
  showKeywords?: boolean
  keywords?: string[] | null
  showCategories?: boolean
  categories?: string[]
  showPartner?: boolean
  partnerNickname?: string
}

/**
 * 책 메타데이터 공통 컴포넌트
 * - 제목, 저자 기본 표시
 * - 유사도, 키워드, 카테고리, 파트너 정보 옵션
 * - compact 모드로 크기 조절
 */
export function BookMetadata({
  title,
  author,
  compact = false,
  showSimilarity,
  similarity,
  showKeywords,
  keywords,
  showCategories,
  categories,
  showPartner,
  partnerNickname,
}: BookMetadataProps) {
  return (
    <div className="space-y-1">
      {/* 책 제목 */}
      <h3
        className={`font-medium ${compact ? 'text-xs' : 'text-sm'} text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors`}
      >
        {title}
      </h3>

      {/* 저자 */}
      {author && (
        <p
          className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500 truncate`}
        >
          {author}
        </p>
      )}

      {/* 유사도 (추천 탭) */}
      {showSimilarity && similarity !== undefined && (
        <p className="text-xs text-primary-600 font-medium">
          유사도: {(similarity * 10).toFixed(1)}%
        </p>
      )}

      {/* 관련 키워드 (추천 탭) */}
      {showKeywords && keywords && keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {keywords.slice(0, 2).map((keyword, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full"
            >
              {keyword}
            </span>
          ))}
          {keywords.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{keywords.length - 2}
            </span>
          )}
        </div>
      )}

      {/* 카테고리 태그 (서재) */}
      {showCategories && categories && categories.length > 0 && (
        <CategoryTags categories={categories} maxDisplay={2} />
      )}

      {/* 교환 파트너 (교환 도서) */}
      {showPartner && partnerNickname && (
        <p className="text-xs text-gray-500">{partnerNickname}님과 교환</p>
      )}
    </div>
  )
}

BookMetadata.displayName = 'BookMetadata'
