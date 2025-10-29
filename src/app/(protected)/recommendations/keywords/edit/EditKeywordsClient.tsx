'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useRecommendKeywords } from '@/hooks/useRecommendKeywords'
import {
  KeywordCandidatesResponse,
  useRecommendKeywordCandidates,
} from '@/hooks/useRecommendKeywordCandidates'
import { useSnackbar } from '@/hooks/useSnackbar'
import { api } from '@/lib/api'
import ProgressHeader from '@/components/layout/ProgressHeader'
import KeywordStep from '@/components/onboarding/KeywordStep'

export default function EditKeywordsClient() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // 선택된 키워드 IDs
  const [genreIds, setGenreIds] = useState<number[]>([])
  const [contentIds, setContentIds] = useState<number[]>([])
  const [moodIds, setMoodIds] = useState<number[]>([])

  // 기존 키워드 조회 (평탄한 배열)
  const { data: existingKeywords, isLoading: existingLoading } =
    useRecommendKeywords()

  // 후보 키워드 조회 (타입별 구분)
  const { data: candidates, isLoading: candidatesLoading } = useQuery({
    queryKey: ['recommend', 'keywords', 'candidates'],
    queryFn: async () => {
      const response = await api.get<KeywordCandidatesResponse>(
        '/api/v1/recommendations/members/keywords'
      )
      return response
    },
    staleTime: 1000 * 60 * 10,
  })

  const isLoading = existingLoading || candidatesLoading

  // Pre-load: 기존 키워드를 타입별로 분류하여 초기값 설정
  useEffect(() => {
    if (!existingKeywords || !candidates) return

    const existingIdSet = new Set(existingKeywords.map(k => k.id))

    // 후보 키워드 목록에서 기존 선택된 키워드만 필터링
    const genreList = candidates.genreKeyword
      .filter(k => existingIdSet.has(k.id))
      .map(k => k.id)

    const contentList = candidates.contentKeyword
      .filter(k => existingIdSet.has(k.id))
      .map(k => k.id)

    const moodList = candidates.moodKeyword
      .filter(k => existingIdSet.has(k.id))
      .map(k => k.id)

    setGenreIds(genreList)
    setContentIds(contentList)
    setMoodIds(moodList)
  }, [existingKeywords, candidates])

  // 키워드 저장 mutation
  const saveMutation = useMutation({
    mutationFn: async (keywordIds: number[]) => {
      await api.put('/api/v1/recommendations/members/keywords', {
        keywordIds: keywordIds,
      })
    },
    onSuccess: () => {
      // 추천 키워드 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['recommend', 'keywords'] })
      showSuccess('키워드가 성공적으로 변경되었습니다')
      router.push('/home?tab=recommendations')
    },
    onError: error => {
      console.error('키워드 저장 오류:', error)
      showError('키워드 저장 중 오류가 발생했습니다')
    },
  })

  // Memoized onChange handlers
  const handleGenreChange = useCallback((ids: number[]) => {
    setGenreIds(ids)
  }, [])

  const handleContentChange = useCallback((ids: number[]) => {
    setContentIds(ids)
  }, [])

  const handleMoodChange = useCallback((ids: number[]) => {
    setMoodIds(ids)
  }, [])

  // 현재 단계의 선택된 키워드 개수
  const getCurrentStepCount = () => {
    if (currentStep === 1) return genreIds.length
    if (currentStep === 2) return contentIds.length
    return moodIds.length
  }

  // 다음 단계로
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => (prev + 1) as 1 | 2 | 3)
    } else {
      // 마지막 단계: 저장
      const allKeywordIds = [
        ...new Set([...genreIds, ...contentIds, ...moodIds]),
      ]
      saveMutation.mutate(allKeywordIds)
    }
  }

  // 이전 단계로
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as 1 | 2 | 3)
    } else {
      // Step 1에서 뒤로가기: 브라우저 히스토리 뒤로
      router.back()
    }
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          </div>
          <p className="text-gray-600">키워드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Progress Header */}
      <div className="flex-shrink-0">
        <ProgressHeader currentStep={currentStep} totalSteps={3} />
      </div>

      {/* Keyword Step */}
      <div className="flex-1 overflow-y-auto">
        {currentStep === 1 && (
          <KeywordStep
            type="GENRE"
            selectedIds={genreIds}
            onChange={handleGenreChange}
            onBack={handleBack}
          />
        )}
        {currentStep === 2 && (
          <KeywordStep
            type="CONTENT"
            selectedIds={contentIds}
            onChange={handleContentChange}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <KeywordStep
            type="MOOD"
            selectedIds={moodIds}
            onChange={handleMoodChange}
            onBack={handleBack}
          />
        )}
      </div>

      {/* Next/Save Button */}
      <div className="bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
        <div className="p-4">
          <button
            onClick={handleNext}
            disabled={getCurrentStepCount() === 0 || saveMutation.isPending}
            className="btn-primary w-full"
          >
            {saveMutation.isPending
              ? '저장 중...'
              : currentStep === 3
                ? '저장하기'
                : '다음'}
          </button>
        </div>
      </div>
    </div>
  )
}

EditKeywordsClient.displayName = 'EditKeywordsClient'
