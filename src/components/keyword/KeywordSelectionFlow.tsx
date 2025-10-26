'use client'

import { useState } from 'react'
import { Keyword, KeywordCategories } from '@/types/keyword'

interface KeywordSelectionFlowProps {
  /** 키워드 카테고리 데이터 */
  categories: KeywordCategories
  /** 선택 완료 핸들러 */
  onComplete: (selectedIds: number[]) => void
  /** 취소 핸들러 */
  onCancel?: () => void
  /** 로딩 상태 */
  isLoading?: boolean
}

/**
 * 키워드 선택 플로우 컴포넌트
 * - 3개 카테고리별 키워드 선택
 * - 최소 3개 이상 선택 필수
 */
export default function KeywordSelectionFlow({
  categories,
  onComplete,
  onCancel,
  isLoading = false,
}: KeywordSelectionFlowProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const MIN_SELECTION = 3
  const MAX_SELECTION = 10
  const canSubmit = selectedIds.size >= MIN_SELECTION && !isLoading

  const toggleKeyword = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      if (newSelected.size >= MAX_SELECTION) {
        return // 최대 개수 초과 방지
      }
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    onComplete(Array.from(selectedIds))
  }

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-900">
            키워드를 선택해주세요
          </h1>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="취소"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">
          선택된 키워드: {selectedIds.size}/{MAX_SELECTION} (최소{' '}
          {MIN_SELECTION}
          개)
        </p>
      </div>

      {/* 키워드 카테고리 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {/* 분위기 키워드 */}
        <KeywordCategory
          title="📖 분위기"
          keywords={categories.moodKeyword}
          selectedIds={selectedIds}
          onToggle={toggleKeyword}
        />

        {/* 장르 키워드 */}
        <KeywordCategory
          title="🎭 장르"
          keywords={categories.genreKeyword}
          selectedIds={selectedIds}
          onToggle={toggleKeyword}
        />

        {/* 내용 키워드 */}
        <KeywordCategory
          title="💭 내용"
          keywords={categories.contentKeyword}
          selectedIds={selectedIds}
          onToggle={toggleKeyword}
        />
      </div>

      {/* 완료 버튼 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-200 ${
            canSubmit
              ? 'bg-primary-400 hover:bg-primary-500 text-white shadow-sm hover:shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? '저장 중...' : '완료하기'}
        </button>
        {selectedIds.size < MIN_SELECTION && (
          <p className="text-center text-sm text-gray-500 mt-2">
            최소 {MIN_SELECTION}개 이상 선택해주세요
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * 키워드 카테고리 섹션
 */
function KeywordCategory({
  title,
  keywords,
  selectedIds,
  onToggle,
}: {
  title: string
  keywords: Keyword[]
  selectedIds: Set<number>
  onToggle: (id: number) => void
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map(keyword => {
          const isSelected = selectedIds.has(keyword.id)
          return (
            <button
              key={keyword.id}
              onClick={() => onToggle(keyword.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-400 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
              aria-pressed={isSelected}
            >
              {keyword.content}
            </button>
          )
        })}
      </div>
    </section>
  )
}

KeywordSelectionFlow.displayName = 'KeywordSelectionFlow'
