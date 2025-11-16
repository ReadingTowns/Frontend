export interface OnboardingData {
  phoneNumber?: string
  nickname?: string
  profileImage?: string
  latitude?: number
  longitude?: number
  availableTime?: string
  genreKeywordIds?: number[]
  contentKeywordIds?: number[]
  moodKeywordIds?: number[]
  keywordIds?: number[] // 전체 키워드 (API 전송용)
}

export type OnboardingStep =
  | 'start'
  | 'phone'
  | 'profile'
  | 'location'
  | 'preferences'
  | 'keywords1'
  | 'keywords2'
  | 'keywords3'
  | 'complete'

export interface PhoneStepProps {
  value: string
  onChange: (phoneNumber: string) => void
  onBack: () => void
}

export interface ProfileStepProps {
  nickname: string
  profileImage: string
  onNicknameChange: (nickname: string) => void
  onProfileImageChange: (profileImage: string) => void
  onNicknameValidationChange: (isValid: boolean) => void
  onBack: () => void
}

export interface LocationStepProps {
  latitude?: number
  longitude?: number
  onLocationChange: (latitude: number, longitude: number) => void
  onBack: () => void
  onSkip: () => void
}

export interface PreferencesStepProps {
  value: string
  onChange: (availableTime: string) => void
  onBack: () => void
}

export interface CompleteStepProps {
  data: OnboardingData
}
