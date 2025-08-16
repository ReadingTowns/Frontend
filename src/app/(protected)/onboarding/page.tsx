'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useHeader } from '@/contexts/HeaderContext'
import ProgressHeader from '@/components/layout/ProgressHeader'
import StartStep from '@/components/onboarding/StartStep'
import PhoneStep from '@/components/onboarding/PhoneStep'
import ProfileStep from '@/components/onboarding/ProfileStep'
import LocationStep from '@/components/onboarding/LocationStep'
import PreferencesStep from '@/components/onboarding/PreferencesStep'
import CompleteStep from '@/components/onboarding/CompleteStep'
import { OnboardingStep, OnboardingData } from '@/types/onboarding'

// 온보딩 단계 정의
const steps: OnboardingStep[] = [
  'start',
  'phone',
  'profile',
  'location',
  'preferences',
  'complete',
]

export default function OnboardingPage() {
  const router = useRouter()
  const { setHeaderContent } = useHeader()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('start')
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNicknameValid, setIsNicknameValid] = useState(false)

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
      const response = await fetch('/api/v1/members/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          phoneNumber: onboardingData.phoneNumber,
          latitude: onboardingData.latitude,
          longitude: onboardingData.longitude,
          nickname: onboardingData.nickname,
          profileImage: onboardingData.profileImage,
          availableTime:
            onboardingData.availableTime === '나중에 설정하기'
              ? null
              : onboardingData.availableTime,
        }),
      })

      if (response.ok) {
        router.push('/home')
      } else {
        throw new Error('온보딩 저장에 실패했습니다')
      }
    } catch (error) {
      console.error('온보딩 완료 오류:', error)
      alert('온보딩 저장 중 오류가 발생했습니다. 다시 시도해주세요.')
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
        return !!(
          onboardingData.availableTime &&
          onboardingData.availableTime.trim().length >= 2
        )
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

      case 'complete':
        return <CompleteStep data={onboardingData} />

      default:
        return <StartStep />
    }
  }

  return (
    <div className="min-h-screen-safe bg-gray-50 flex flex-col">
      {/* 컨텐츠 영역 - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[430px] mx-auto">{renderStep()}</div>
      </div>

      {/* 버튼 영역 - 하단 고정 */}
      <div className="bg-white border-t border-gray-200 flex-shrink-0 shadow-lg">
        <div className="max-w-[430px] mx-auto p-4">
          <button
            onClick={() => handleNextButton()}
            disabled={!canProceed() || isSubmitting}
            className="btn-primary w-full"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  )
}
