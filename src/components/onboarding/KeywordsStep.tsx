'use client'

import { useState, useEffect } from 'react'
import {
  useRecommendKeywordCandidates,
  KeywordItem,
} from '@/hooks/useRecommendKeywordCandidates'

interface KeywordsStepProps {
  /** 선택된 장르 키워드 ID 배열 */
  genreKeywordIds: number[]
  /** 선택된 주제 키워드 ID 배열 */
  contentKeywordIds: number[]
  /** 선택된 분위기 키워드 ID 배열 */
  moodKeywordIds: number[]
  /** 키워드 변경 핸들러 */
  onGenreChange: (ids: number[]) => void
  onContentChange: (ids: number[]) => void
  onMoodChange: (ids: number[]) => void
  /** 뒤로가기 핸들러 */
  onBack: () => void
}

/**
 * 온보딩 키워드 선택 단계 (통합 버전)
 * - GENRE, CONTENT, MOOD 세 섹션을 하나의 페이지에 스크롤로 표시
 */
export default function KeywordsStep({
  genreKeywordIds,
  contentKeywordIds,
  moodKeywordIds,
  onGenreChange,
  onContentChange,
  onMoodChange,
  onBack,
}: KeywordsStepProps) {
  const [genreSelected, setGenreSelected] = useState<Set<number>>(
    new Set(genreKeywordIds || [])
  )
  const [contentSelected, setContentSelected] = useState<Set<number>>(
    new Set(contentKeywordIds || [])
  )
  const [moodSelected, setMoodSelected] = useState<Set<number>>(
    new Set(moodKeywordIds || [])
  )

  const {
    data: genreData,
    isLoading: genreLoading,
    error: genreError,
  } = useRecommendKeywordCandidates('GENRE')
  const {
    data: contentData,
    isLoading: contentLoading,
    error: contentError,
  } = useRecommendKeywordCandidates('CONTENT')
  const {
    data: moodData,
    isLoading: moodLoading,
    error: moodError,
  } = useRecommendKeywordCandidates('MOOD')

  // 선택 변경 시 부모에게 전달
  useEffect(() => {
    onGenreChange(Array.from(genreSelected))
  }, [genreSelected, onGenreChange])

  useEffect(() => {
    onContentChange(Array.from(contentSelected))
  }, [contentSelected, onContentChange])

  useEffect(() => {
    onMoodChange(Array.from(moodSelected))
  }, [moodSelected, onMoodChange])

  const toggleGenreKeyword = (id: number) => {
    const newSelected = new Set(genreSelected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setGenreSelected(newSelected)
  }

  const toggleContentKeyword = (id: number) => {
    const newSelected = new Set(contentSelected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setContentSelected(newSelected)
  }

  const toggleMoodKeyword = (id: number) => {
    const newSelected = new Set(moodSelected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setMoodSelected(newSelected)
  }

  // 로딩 상태
  if (genreLoading || contentLoading || moodLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">키워드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (
    genreError ||
    contentError ||
    moodError ||
    !genreData ||
    !contentData ||
    !moodData
  ) {
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

  const totalSelected =
    genreSelected.size + contentSelected.size + moodSelected.size

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
          선호하는 키워드를 선택해주세요
        </h1>
        <p className="text-gray-600">
          장르, 주제, 분위기 중 최소 3개 이상 선택해주세요
        </p>
        <div className="mt-4">
          <span className="text-sm font-medium text-primary-600">
            선택한 키워드: {totalSelected}개
          </span>
        </div>
      </div>

      {/* 키워드 선택 영역 - 스크롤 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {/* GENRE 섹션 */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">🎭</span>
            좋아하는 장르
          </h2>
          <div className="flex flex-wrap gap-2">
            {genreData.keywordList.map((keyword: KeywordItem) => {
              const isSelected = genreSelected.has(keyword.id)
              return (
                <button
                  key={keyword.id}
                  onClick={() => toggleGenreKeyword(keyword.id)}
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

        {/* CONTENT 섹션 */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">💭</span>
            관심있는 주제
          </h2>
          <div className="flex flex-wrap gap-2">
            {contentData.keywordList.map((keyword: KeywordItem) => {
              const isSelected = contentSelected.has(keyword.id)
              return (
                <button
                  key={keyword.id}
                  onClick={() => toggleContentKeyword(keyword.id)}
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

        {/* MOOD 섹션 */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">📖</span>
            선호하는 분위기
          </h2>
          <div className="flex flex-wrap gap-2">
            {moodData.keywordList.map((keyword: KeywordItem) => {
              const isSelected = moodSelected.has(keyword.id)
              return (
                <button
                  key={keyword.id}
                  onClick={() => toggleMoodKeyword(keyword.id)}
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
    </div>
  )
}

KeywordsStep.displayName = 'KeywordsStep'
