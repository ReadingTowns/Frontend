'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useHeader } from '@/contexts/HeaderContext'
import { useAuth } from '@/hooks/useAuth'
import { useSnackbar } from '@/hooks/useSnackbar'
import ProgressHeader from '@/components/layout/ProgressHeader'
import StartStep from '@/components/onboarding/StartStep'
import PhoneStep from '@/components/onboarding/PhoneStep'
import ProfileStep from '@/components/onboarding/ProfileStep'
import LocationStep from '@/components/onboarding/LocationStep'
import PreferencesStep from '@/components/onboarding/PreferencesStep'
import KeywordsStep from '@/components/onboarding/KeywordsStep'
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
  'keywords',
  'complete',
]

export default function OnboardingPage() {
  const router = useRouter()
  const { setHeaderContent } = useHeader()
  const { isAuthenticated, isOnboardingCompleted, isLoading } = useAuth()
  const { showError } = useSnackbar()
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

  // 온보딩 완료 여부 확인 및 리다이렉트
  useEffect(() => {
    if (isLoading) return

    // 인증되지 않은 경우 로그인 페이지로
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // 이미 온보딩 완료한 경우 홈으로
    if (isAuthenticated && isOnboardingCompleted) {
      router.push('/home')
      return
    }
  }, [isAuthenticated, isOnboardingCompleted, isLoading, router])

  // Update header when step changes
  useEffect(() => {
    const currentStepIndex = steps.indexOf(currentStep) + 1
    setHeaderContent(
      <ProgressHeader
        currentStep={currentStepIndex}
        totalSteps={steps.length}
      />
    )

    return () => {
      setHeaderContent(null)
    }
  }, [currentStep, setHeaderContent])

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
      case 'keywords':
        setCurrentStep('preferences')
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
        setCurrentStep('keywords')
        break
      case 'keywords':
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
        latitude: onboardingData.latitude,
        longitude: onboardingData.longitude,
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
      showError('온보딩 저장 중 오류가 발생했습니다. 다시 시도해주세요.')
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
        return !!(onboardingData.latitude && onboardingData.longitude)
      case 'preferences':
        // 선택적 입력: 항상 다음 단계로 진행 가능
        return true
      case 'keywords':
        // 전체 키워드 최소 3개 이상 선택 필수
        return (onboardingData.keywordIds?.length || 0) >= 3
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

      case 'keywords':
        return (
          <KeywordsStep
            genreKeywordIds={onboardingData.genreKeywordIds || []}
            contentKeywordIds={onboardingData.contentKeywordIds || []}
            moodKeywordIds={onboardingData.moodKeywordIds || []}
            onGenreChange={handleGenreKeywordsChange}
            onContentChange={handleContentKeywordsChange}
            onMoodChange={handleMoodKeywordsChange}
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
