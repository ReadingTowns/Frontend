'use client'

import { useState, useEffect } from 'react'
import {
  useRecommendKeywordCandidates,
  KeywordItem,
} from '@/hooks/useRecommendKeywordCandidates'

type KeywordType = 'GENRE' | 'CONTENT' | 'MOOD'

interface KeywordStepProps {
  type: KeywordType
  selectedIds: number[]
  onChange: (ids: number[]) => void
  onBack: () => void
}

const STEP_CONFIG = {
  GENRE: {
    emoji: '🎭',
    title: '좋아하는 장르',
    description: '관심있는 장르를 선택해주세요 (최소 1개)',
  },
  CONTENT: {
    emoji: '💭',
    title: '관심있는 주제',
    description: '읽고 싶은 주제를 선택해주세요 (최소 1개)',
  },
  MOOD: {
    emoji: '📖',
    title: '선호하는 분위기',
    description: '원하는 분위기를 선택해주세요 (최소 1개)',
  },
}

/**
 * 온보딩 키워드 선택 단계 (공통 컴포넌트)
 */
export default function KeywordStep({
  type,
  selectedIds,
  onChange,
  onBack,
}: KeywordStepProps) {
  const [selected, setSelected] = useState<Set<number>>(
    new Set(selectedIds || [])
  )

  const { data, isLoading, error } = useRecommendKeywordCandidates(type)
  const config = STEP_CONFIG[type]

  // type이나 selectedIds가 변경되면 selected 상태 초기화
  useEffect(() => {
    setSelected(new Set(selectedIds || []))
  }, [type, selectedIds])

  const toggleKeyword = (id: number) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
    // 상태 업데이트 후 부모에게 알림
    onChange(Array.from(newSelected))
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">키워드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            키워드를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            네트워크 연결을 확인하고 다시 시도해주세요
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary-400 hover:bg-primary-500 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-gray-200">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="ml-1">이전</span>
        </button>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {config.emoji} {config.title}
        </h1>
        <p className="text-gray-600">{config.description}</p>
        <div className="mt-4">
          <span className="text-sm font-medium text-primary-600">
            선택한 키워드: {selected.size}개
          </span>
        </div>
      </div>

      {/* 키워드 선택 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {data.keywordList.map((keyword: KeywordItem) => {
            const isSelected = selected.has(keyword.id)
            return (
              <button
                key={keyword.id}
                onClick={() => toggleKeyword(keyword.id)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary-400 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                aria-pressed={isSelected}
              >
                {keyword.content}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

KeywordStep.displayName = 'KeywordStep'
