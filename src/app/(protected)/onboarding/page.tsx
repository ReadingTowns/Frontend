'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useHeaderConfig } from '@/hooks/useHeaderConfig'
import { useAuth } from '@/hooks/useAuth'
import StartStep from '@/components/onboarding/StartStep'
import PhoneStep from '@/components/onboarding/PhoneStep'
import ProfileStep from '@/components/onboarding/ProfileStep'
import LocationStep from '@/components/onboarding/LocationStep'
import PreferencesStep from '@/components/onboarding/PreferencesStep'
import KeywordStep from '@/components/onboarding/KeywordStep'
import CompleteStep from '@/components/onboarding/CompleteStep'
import { OnboardingStep, OnboardingData } from '@/types/onboarding'
import { api } from '@/lib/api'

// 온보딩 단계 정의
const steps: OnboardingStep[] = [
  'start',
  'phone',
  'profile',
  'location',
  'preferences',
  'keywords1',
  'keywords2',
  'keywords3',
  'complete',
]

export default function OnboardingPage() {
  const router = useRouter()
  const { isAuthenticated, isOnboardingCompleted, isLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('start')
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNicknameValid, setIsNicknameValid] = useState(false)

  // 메모이제이션된 onChange 핸들러들
  const handleGenreKeywordsChange = useCallback((ids: number[]) => {
    setOnboardingData(prev => {
      const genreKeywordIds = ids
      const contentKeywordIds = prev.contentKeywordIds || []
      const moodKeywordIds = prev.moodKeywordIds || []
      const keywordIds = [
        ...genreKeywordIds,
        ...contentKeywordIds,
        ...moodKeywordIds,
      ]
      return { ...prev, genreKeywordIds, keywordIds }
    })
  }, [])

  const handleContentKeywordsChange = useCallback((ids: number[]) => {
    setOnboardingData(prev => {
      const genreKeywordIds = prev.genreKeywordIds || []
      const contentKeywordIds = ids
      const moodKeywordIds = prev.moodKeywordIds || []
      const keywordIds = [
        ...genreKeywordIds,
        ...contentKeywordIds,
        ...moodKeywordIds,
      ]
      return { ...prev, contentKeywordIds, keywordIds }
    })
  }, [])

  const handleMoodKeywordsChange = useCallback((ids: number[]) => {
    setOnboardingData(prev => {
      const genreKeywordIds = prev.genreKeywordIds || []
      const contentKeywordIds = prev.contentKeywordIds || []
      const moodKeywordIds = ids
      const keywordIds = [
        ...genreKeywordIds,
        ...contentKeywordIds,
        ...moodKeywordIds,
      ]
      return { ...prev, moodKeywordIds, keywordIds }
    })
  }, [])

  // 온보딩 완료 여부 확인 - ProtectedLayoutClient에서 처리하므로 완료된 경우만 체크
  useEffect(() => {
    if (isLoading) return

    // 이미 온보딩 완료한 경우 홈으로
    if (isAuthenticated && isOnboardingCompleted) {
      router.push('/home')
      return
    }
  }, [isAuthenticated, isOnboardingCompleted, isLoading, router])

  // 진행률 계산
  const currentStepIndex = useMemo(() => {
    return steps.indexOf(currentStep) + 1
  }, [currentStep])

  // Progress 헤더 설정
  useHeaderConfig(
    {
      variant: 'progress',
      title: '온보딩',
      currentStep: currentStepIndex,
      totalSteps: steps.length,
    },
    [currentStepIndex]
  )

  const handleBackButton = () => {
    switch (currentStep) {
      case 'phone':
        setCurrentStep('start')
        break
      case 'profile':
        setCurrentStep('phone')
        break
      case 'location':
        setCurrentStep('profile')
        break
      case 'preferences':
        setCurrentStep('location')
        break
      case 'keywords1':
        setCurrentStep('preferences')
        break
      case 'keywords2':
        setCurrentStep('keywords1')
        break
      case 'keywords3':
        setCurrentStep('keywords2')
        break
      default:
        break
    }
  }

  const handleNextButton = async () => {
    switch (currentStep) {
      case 'start':
        setCurrentStep('phone')
        break
      case 'phone':
        setCurrentStep('profile')
        break
      case 'profile':
        setCurrentStep('location')
        break
      case 'location':
        setCurrentStep('preferences')
        break
      case 'preferences':
        setCurrentStep('keywords1')
        break
      case 'keywords1':
        setCurrentStep('keywords2')
        break
      case 'keywords2':
        setCurrentStep('keywords3')
        break
      case 'keywords3':
        setCurrentStep('complete')
        break
      case 'complete':
        await handleOnboardingComplete()
        break
    }
  }

  const handleOnboardingComplete = async () => {
    setIsSubmitting(true)

    try {
      await api.post('/api/v1/members/onboarding/complete', {
        phoneNumber: onboardingData.phoneNumber,
        latitude: onboardingData.latitude || null,
        longitude: onboardingData.longitude || null,
        nickname: onboardingData.nickname,
        profileImage: onboardingData.profileImage,
        availableTime:
          onboardingData.availableTime === '나중에 설정하기'
            ? null
            : onboardingData.availableTime,
        keywordIdList: onboardingData.keywordIds || [],
      })

      router.push('/home')
    } catch (error) {
      console.error('온보딩 완료 오류:', error)
      // API 에러는 api.ts에서 자동으로 토스트 표시
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'start':
        return true
      case 'phone':
        return !!onboardingData.phoneNumber
      case 'profile':
        return !!onboardingData.nickname && isNicknameValid
      case 'location':
        // 선택적 입력: 위치 설정 또는 건너뛰기 가능
        return true
      case 'preferences':
        // 선택적 입력: 항상 다음 단계로 진행 가능
        return true
      case 'keywords1':
        // 장르 키워드 최소 1개 이상 선택 필수
        return (onboardingData.genreKeywordIds?.length || 0) >= 1
      case 'keywords2':
        // 주제 키워드 최소 1개 이상 선택 필수
        return (onboardingData.contentKeywordIds?.length || 0) >= 1
      case 'keywords3':
        // 분위기 키워드 최소 1개 이상 선택 필수
        return (onboardingData.moodKeywordIds?.length || 0) >= 1
      case 'complete':
        return true
      default:
        return false
    }
  }

  const getButtonText = () => {
    switch (currentStep) {
      case 'start':
        return '시작하기'
      case 'complete':
        return isSubmitting ? '저장 중...' : '리딩타운 시작하기'
      default:
        return '다음'
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'start':
        return <StartStep />

      case 'phone':
        return (
          <PhoneStep
            value={onboardingData.phoneNumber || ''}
            onChange={phoneNumber =>
              setOnboardingData(prev => ({ ...prev, phoneNumber }))
            }
            onBack={handleBackButton}
          />
        )

      case 'profile':
        return (
          <ProfileStep
            nickname={onboardingData.nickname || ''}
            profileImage={onboardingData.profileImage || ''}
            onNicknameChange={nickname =>
              setOnboardingData(prev => ({ ...prev, nickname }))
            }
            onProfileImageChange={profileImage =>
              setOnboardingData(prev => ({ ...prev, profileImage }))
            }
            onNicknameValidationChange={setIsNicknameValid}
            onBack={handleBackButton}
          />
        )

      case 'location':
        return (
          <LocationStep
            latitude={onboardingData.latitude}
            longitude={onboardingData.longitude}
            onLocationChange={(latitude, longitude) =>
              setOnboardingData(prev => ({ ...prev, latitude, longitude }))
            }
            onBack={handleBackButton}
            onSkip={() => setCurrentStep('preferences')}
          />
        )

      case 'preferences':
        return (
          <PreferencesStep
            value={onboardingData.availableTime || ''}
            onChange={availableTime =>
              setOnboardingData(prev => ({ ...prev, availableTime }))
            }
            onBack={handleBackButton}
          />
        )

      case 'keywords1':
        return (
          <KeywordStep
            type="GENRE"
            selectedIds={onboardingData.genreKeywordIds || []}
            onChange={handleGenreKeywordsChange}
            onBack={handleBackButton}
          />
        )

      case 'keywords2':
        return (
          <KeywordStep
            type="CONTENT"
            selectedIds={onboardingData.contentKeywordIds || []}
            onChange={handleContentKeywordsChange}
            onBack={handleBackButton}
          />
        )

      case 'keywords3':
        return (
          <KeywordStep
            type="MOOD"
            selectedIds={onboardingData.moodKeywordIds || []}
            onChange={handleMoodKeywordsChange}
            onBack={handleBackButton}
          />
        )

      case 'complete':
        return <CompleteStep data={onboardingData} />

      default:
        return <StartStep />
    }
  }

  // 로딩 중일 때만 로딩 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">로딩 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 컨텐츠 영역 - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto">{renderStep()}</div>

      {/* 버튼 영역 - 하단 고정 */}
      <div className="bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
        <div className="p-4">
          <button
            onClick={() => handleNextButton()}
            disabled={!canProceed() || isSubmitting}
            className="btn-primary w-full"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </>
  )
}
