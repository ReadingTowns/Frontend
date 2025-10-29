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
  /** 현재 SubStep 변경 핸들러 */
  onSubStepChange?: (step: 1 | 2 | 3) => void
}

/**
 * 온보딩 키워드 선택 단계 (3단계 분리 버전)
 * - Step 1: 🎭 장르 (GENRE)
 * - Step 2: 💭 주제 (CONTENT)
 * - Step 3: 📖 분위기 (MOOD)
 * - 각 단계마다 최소 1개 이상 선택 필요
 */
export default function KeywordsStep({
  genreKeywordIds,
  contentKeywordIds,
  moodKeywordIds,
  onGenreChange,
  onContentChange,
  onMoodChange,
  onBack,
  onSubStepChange,
}: KeywordsStepProps) {
  const [currentSubStep, setCurrentSubStep] = useState<1 | 2 | 3>(1)

  // SubStep 변경 시 부모에게 알림
  useEffect(() => {
    onSubStepChange?.(currentSubStep)
  }, [currentSubStep, onSubStepChange])
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

  // 현재 단계의 선택된 ID 가져오기
  const getCurrentSelectedIds = () => {
    if (currentSubStep === 1) return genreSelected
    if (currentSubStep === 2) return contentSelected
    return moodSelected
  }

  // 현재 단계에서 다음으로 넘어갈 수 있는지
  const canProceedToNext = getCurrentSelectedIds().size >= 1

  // 다음 단계로
  const handleNext = () => {
    if (!canProceedToNext) return
    if (currentSubStep < 3) {
      setCurrentSubStep(prev => (prev + 1) as 1 | 2 | 3)
    }
  }

  // 이전 단계로
  const handleSubBack = () => {
    if (currentSubStep > 1) {
      setCurrentSubStep(prev => (prev - 1) as 1 | 2 | 3)
    } else {
      // Step 1에서 이전 버튼 누르면 온보딩 이전 단계로
      onBack()
    }
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

  // 현재 단계 데이터 가져오기
  const getStepData = () => {
    if (currentSubStep === 1) {
      return {
        title: '🎭 좋아하는 장르',
        description: '관심있는 장르를 선택해주세요 (최소 1개)',
        keywords: genreData.keywordList,
        selectedIds: genreSelected,
        toggleKeyword: toggleGenreKeyword,
      }
    } else if (currentSubStep === 2) {
      return {
        title: '💭 관심있는 주제',
        description: '읽고 싶은 주제를 선택해주세요 (최소 1개)',
        keywords: contentData.keywordList,
        selectedIds: contentSelected,
        toggleKeyword: toggleContentKeyword,
      }
    } else {
      return {
        title: '📖 선호하는 분위기',
        description: '원하는 분위기를 선택해주세요 (최소 1개)',
        keywords: moodData.keywordList,
        selectedIds: moodSelected,
        toggleKeyword: toggleMoodKeyword,
      }
    }
  }

  const stepData = getStepData()

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-gray-200">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleSubBack}
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

        {/* Step 인디케이터 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  currentSubStep === step
                    ? 'bg-primary-400 text-white'
                    : currentSubStep > step
                      ? 'bg-primary-200 text-primary-700'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-colors ${
                    currentSubStep > step ? 'bg-primary-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {stepData.title}
        </h1>
        <p className="text-gray-600">{stepData.description}</p>
        <div className="mt-4">
          <span className="text-sm font-medium text-primary-600">
            선택한 키워드: {stepData.selectedIds.size}개
          </span>
        </div>
      </div>

      {/* 키워드 선택 영역 - 스크롤 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {stepData.keywords.map((keyword: KeywordItem) => {
            const isSelected = stepData.selectedIds.has(keyword.id)
            return (
              <button
                key={keyword.id}
                onClick={() => stepData.toggleKeyword(keyword.id)}
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

      {/* 하단 버튼 (Step 1, 2에만 표시) */}
      {currentSubStep < 3 && (
        <div className="bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleNext}
            disabled={!canProceedToNext}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
              canProceedToNext
                ? 'bg-primary-400 hover:bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

KeywordsStep.displayName = 'KeywordsStep'
